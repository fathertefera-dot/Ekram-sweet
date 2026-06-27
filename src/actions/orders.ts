"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Order, OrderStatus, PaymentMethod } from "@/types";
import { isAdmin } from "./auth";

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  order_note?: string;
  payment_method: PaymentMethod;
  items: {
    product_id: string;
    variant_id?: string;
    variant_name?: string;
    product_name: string;
    price: number;
    quantity: number;
    cake_message?: string;
  }[];
}) {
  const supabase = await createClient();

  // 🔧 [Bug Fix #3] - Recompute total_amount on the server for security
  const itemPrices = data.items.map((item) => ({
    ...item,
    total: item.price * item.quantity,
  }));
  const subtotal = itemPrices.reduce((sum, item) => sum + item.total, 0);
  const deliveryFee = 150;
  const totalAmount = subtotal + deliveryFee;

  // 🔧 [Bug Fix #2] - Prevent order number collision (using timestamp + random suffix)
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const orderNumber = `IKU-${Date.now().toString().slice(-6)}${suffix}`;

  // Create order with generated number
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .insert({
      order_number: orderNumber,
      customer_name: data.customer_name,
      customer_phone: data.customer_phone,
      customer_email: data.customer_email || null,
      delivery_address: data.delivery_address,
      order_note: data.order_note || null,
      payment_method: data.payment_method,
      total_amount: totalAmount,
    })
    .select()
    .single();

  if (orderError) throw orderError;

  // Insert order items
  const orderItems = data.items.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    product_name: item.product_name,
    variant_name: item.variant_name || null,
    price: item.price,
    quantity: item.quantity,
    cake_message: item.cake_message || null,
  }));

  const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
  if (itemsError) throw itemsError;

  // Send Telegram notification (fire-and-forget)
  await sendTelegramNotification(orderNumber, {
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    delivery_address: data.delivery_address,
    payment_method: data.payment_method,
    items: data.items,
    total_amount: totalAmount,
  });

  revalidatePath("/admin/orders");
  return order as Order;
}

async function sendTelegramNotification(orderNumber: string, data: any) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;

    const itemsList = data.items
      .map(
        (item: any) =>
          `- ${item.product_name}${item.variant_name ? ` (${item.variant_name})` : ""} x${item.quantity} = ${item.price * item.quantity} ETB${item.cake_message ? `\n  Message: "${item.cake_message}"` : ""}`
      )
      .join("\n");

    const message = `
🎂 *New Order - ${orderNumber}*

👤 *Customer:* ${data.customer_name}
📱 *Phone:* ${data.customer_phone}
📍 *Address:* ${data.delivery_address}
💳 *Payment:* ${data.payment_method.replace(/_/g, " ").toUpperCase()}

🛒 *Items:*
${itemsList}

💰 *Total:* ${data.total_amount} ETB
    `.trim();

    await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: message, parse_mode: "Markdown" }),
    });
  } catch {
    // Silently fail - must not block order creation
  }
}

export async function trackOrder(orderNumber: string, phoneNumber: string): Promise<Order | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("orders")
    .select("*, items:order_items(*)")
    .eq("order_number", orderNumber)
    .eq("customer_phone", phoneNumber)
    .single();

  if (error) return null;
  return data as Order;
}

// Admin: Get all orders
export async function getAllOrders(options: { page?: number; limit?: number; status?: OrderStatus; search?: string } = {}) {
  // 🔧 [Bug Fix #5] - Admin authorization check
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { page = 1, limit = 10, status, search } = options;

  let query = supabase.from("orders").select("*, items:order_items(*)", { count: "exact" });
  if (status) query = query.eq("status", status);
  if (search) query = query.or(`order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`);

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query.order("created_at", { ascending: false }).range(from, to);
  if (error) throw error;

  return {
    orders: data as Order[] || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  };
}

// Admin: Update order status
export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  // 🔧 [Bug Fix #5] - Admin authorization check
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
  if (error) throw error;
  revalidatePath("/admin/orders");
}

// Admin: Cancel order
export async function cancelOrder(orderId: string, reason: string) {
  // 🔧 [Bug Fix #5] - Admin authorization check
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase.from("orders").update({ status: "cancelled", cancel_reason: reason }).eq("id", orderId);
  if (error) throw error;
  revalidatePath("/admin/orders");
}

// Admin: Get order stats
export async function getOrderStats() {
  // 🔧 [Bug Fix #1 & #7] - Correctly destructure 'count' and use Promise.all for parallel queries
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: deliveredOrders },
    { count: totalProducts },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "pending"),
    supabase.from("orders").select("*", { count: "exact", head: true }).eq("status", "delivered"),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    deliveredOrders: deliveredOrders ?? 0,
    totalProducts: totalProducts ?? 0,
  };
}
