"use server";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { CartWithItems } from "@/types";
import { SupabaseClient } from "@supabase/supabase-js";

function generateSessionId(): string {
  return "sess_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// 🔧 አሁን RLS ን በማይጋጭ መልኩ ሴሽኑን እናስቀምጣለን
async function setSessionConfig(supabase: SupabaseClient, sessionId: string) {
  try {
    // አዲሱን የ RPC ተግባር እንጠቀማለን
    const { error } = await supabase.rpc('set_app_session_id', {
      session_id: sessionId
    });
    if (error) {
      console.error("RPC Error setting session ID:", error);
    }
  } catch (error) {
    console.error("Failed to set app.session_id config:", error);
  }
}

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session_id")?.value;

  if (!sessionId) {
    sessionId = generateSessionId();
    cookieStore.set("cart_session_id", sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });
  }

  return sessionId;
}

async function getCartId(): Promise<string | null> {
  const supabase = await createClient();
  const sessionId = await getOrCreateSessionId();

  // 🔧 የ RLS ፖሊሲው እንዲሰራ እዚህ ላይ የ PostgreSQL ሴሽን ቅንብር እናስቀምጣለን
  await setSessionConfig(supabase, sessionId);

  // Check authenticated user
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    // Try to find cart by user_id
    const { data: userCart } = await supabase
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .single();

    if (userCart) return userCart.id;

    // Try to migrate session cart to user cart
    const { data: sessionCart } = await supabase
      .from("carts")
      .select("id")
      .eq("session_id", sessionId)
      .single();

    if (sessionCart) {
      await supabase
        .from("carts")
        .update({ user_id: user.id })
        .eq("id", sessionCart.id);
      return sessionCart.id;
    }

    // Create new cart for user
    const { data: newCart } = await supabase
      .from("carts")
      .insert({ user_id: user.id, session_id: sessionId })
      .select("id")
      .single();

    return newCart?.id || null;
  }

  // Guest user - find or create by session
  const { data: sessionCart } = await supabase
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .single();

  if (sessionCart) return sessionCart.id;

  const { data: newCart } = await supabase
    .from("carts")
    .insert({ session_id: sessionId })
    .select("id")
    .single();

  return newCart?.id || null;
}

export async function getCart(): Promise<CartWithItems | null> {
  const supabase = await createClient();
  const cartId = await getCartId();

  if (!cartId) return null;

  const { data, error } = await supabase
    .from("carts")
    .select(`
      *,
      items:cart_items(
        *,
        product:products(*, category:categories(*), images:product_images(*)),
        variant:product_variants(*)
      )
    `)
    .eq("id", cartId)
    .single();

  if (error) return null;
  return data as CartWithItems;
}

export async function addToCart(productId: string, variantId: string | null, quantity: number = 1, cakeMessage?: string) {
  const supabase = await createClient();
  const cartId = await getCartId();

  if (!cartId) throw new Error("Failed to create cart");

  // Check if item already exists
  const { data: existingItem } = await supabase
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .is("variant_id", variantId || null)
    .single();

  if (existingItem) {
    // Update quantity
    const { error } = await supabase
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
        cake_message: cakeMessage || null,
      })
      .eq("id", existingItem.id);

    if (error) throw error;
  } else {
    // Insert new item
    const { error } = await supabase
      .from("cart_items")
      .insert({
        cart_id: cartId,
        product_id: productId,
        variant_id: variantId,
        quantity,
        cake_message: cakeMessage || null,
      });

    if (error) throw error;
  }

  revalidatePath("/cart");
}

export async function updateCartItem(itemId: string, quantity: number) {
  const supabase = await createClient();

  if (quantity <= 0) {
    await removeCartItem(itemId);
    return;
  }

  const { error } = await supabase
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId);

  if (error) throw error;

  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("id", itemId);

  if (error) throw error;

  revalidatePath("/cart");
}

export async function clearCart() {
  const supabase = await createClient();
  const cartId = await getCartId();

  if (!cartId) return;

  const { error } = await supabase
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (error) throw error;

  revalidatePath("/cart");
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  if (!cart || !cart.items) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
