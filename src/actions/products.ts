"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import type { Order, OrderStatus, PaymentMethod } from "@/types";
import { isAdmin } from "./auth";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type OrderItemInput = {
  product_id: string;
  variant_id?: string;
  variant_name?: string;
  product_name: string;
  quantity: number;
  cake_message?: string;
};

type TelegramOrderData = {
  customer_name: string;
  customer_phone: string;
  delivery_address: string;
  payment_method: string;
  items: {
    product_name: string;
    variant_name?: string;
    quantity: number;
    price: number;
    cake_message?: string;
  }[];
  total_amount: number;
};

const DELIVERY_FEE_ETB = 150;

// ---------------------------------------------------------------------------
// createOrder
// ---------------------------------------------------------------------------

export async function createOrder(data: {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  order_note?: string;
  payment_method: PaymentMethod;
  items: OrderItemInput[];
}) {
  const supabase = await createClient();
  const admin = createAdminClient();

  // ── [Fix: Critical 1] Fetch real prices from DB — never trust the client ──
  const variantIds = data.items
    .map((i) => i.variant_id)
    .filter((id): id is string => Boolean(id));

  const { data: variants, error: variantFetchError } = await admin
    .from("product_variants")
    .select("id, price")
    .in("id", variantIds);

  if (variantFetchError) throw variantFetchError;

  const priceMap = new Map(
    (variants ?? []).map((v) => [v.id, Number(v.price)])
  );

  // Build verified items — price comes exclusively from the DB
  const verifiedItems = data.items.map((item) => {
    const realPrice = item.variant_id ? (priceMap.get(item.variant_id) ?? 0) : 0;
    return { ...item, price: realPrice };
  });

  const subtotal = verifiedItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const totalAmount = subtotal + DELIVERY_FEE_ETB;

  // ── [Fix: Medium 2] Collision-resistant order number ──
  const suffix = Math.random().toString(36).substring(2, 5).toUpperCase();
  const orderNumber = `IKU-${Date.now().toString().slice(-6)}${suffix}`;

  // Create the order row
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

  // Insert order items using server-verified prices
  const orderItems = verifiedItems.map((item) => ({
    order_id: order.id,
    product_id: item.product_id,
    variant_id: item.variant_id || null,
    product_name: item.product_name,
    variant_name: item.variant_name || null,
    price: item.price,
    quantity: item.quantity,
    cake_message: item.cake_message || null,
  }));

  const { error: itemsError } = await supabase
    .from("order_items")
    .insert(orderItems);

  if (itemsError) throw itemsError;

  // Fire-and-forget Telegram notification
  sendTelegramNotification(orderNumber, {
    customer_name: data.customer_name,
    customer_phone: data.customer_phone,
    delivery_address: data.delivery_address,
    payment_method: data.payment_method,
    items: verifiedItems,
    total_amount: totalAmount,
  });

  revalidatePath("/admin/orders");
  return order as Order;
}

// ---------------------------------------------------------------------------
// Telegram helper  [Fix: Medium 2 — proper type, no `any`]
// ---------------------------------------------------------------------------

async function sendTelegramNotification(
  orderNumber: string,
  data: TelegramOrderData
) {
  try {
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    const chatId = process.env.TELEGRAM_CHAT_ID;
    if (!botToken || !chatId) return;

    const itemsList = data.items
      .map(
        (item) =>
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

    await fetch(
      `https://api.telegram.org/bot${botToken}/sendMessage`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: message,
          parse_mode: "Markdown",
        }),
      }
    );
  } catch {
    // Silently fail — must never block order creation
  }
}

// ---------------------------------------------------------------------------
// Public — order tracking
// ---------------------------------------------------------------------------

export async function trackOrder(
  orderNumber: string,
  phoneNumber: string
): Promise<Order | null> {
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

// ---------------------------------------------------------------------------
// Admin — orders
// ---------------------------------------------------------------------------

export async function getAllOrders(
  options: {
    page?: number;
    limit?: number;
    status?: OrderStatus;
    search?: string;
  } = {}
) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { page = 1, limit = 10, status, search } = options;

  let query = supabase
    .from("orders")
    .select("*, items:order_items(*)", { count: "exact" });

  if (status) query = query.eq("status", status);
  if (search)
    query = query.or(
      `order_number.ilike.%${search}%,customer_name.ilike.%${search}%,customer_phone.ilike.%${search}%`
    );

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    orders: (data as Order[]) || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  };
}

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status })
    .eq("id", orderId);

  if (error) throw error;
  revalidatePath("/admin/orders");
}

export async function cancelOrder(orderId: string, reason: string) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();
  const { error } = await supabase
    .from("orders")
    .update({ status: "cancelled", cancel_reason: reason })
    .eq("id", orderId);

  if (error) throw error;
  revalidatePath("/admin/orders");
}

export async function getOrderStats() {
  const supabase = await createClient();

  const [
    { count: totalOrders },
    { count: pendingOrders },
    { count: deliveredOrders },
    { count: totalProducts },
  ] = await Promise.all([
    supabase.from("orders").select("*", { count: "exact", head: true }),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("orders")
      .select("*", { count: "exact", head: true })
      .eq("status", "delivered"),
    supabase.from("products").select("*", { count: "exact", head: true }),
  ]);

  return {
    totalOrders: totalOrders ?? 0,
    pendingOrders: pendingOrders ?? 0,
    deliveredOrders: deliveredOrders ?? 0,
    totalProducts: totalProducts ?? 0,
  };
    }
