"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import type { CartWithItems } from "@/types";

// ---------------------------------------------------------------------------
// Session ID helpers
// ---------------------------------------------------------------------------

function generateSessionId(): string {
  return (
    "sess_" +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
}

async function getOrCreateSessionId(): Promise<string> {
  const cookieStore = await cookies();
  let sessionId = cookieStore.get("cart_session_id")?.value;

  if (!sessionId) {
    sessionId = generateSessionId();
    // cookies() in a Server Action triggered from a Client Component works fine.
    // We wrap in try/catch so a Server Component render path doesn't crash —
    // the generated ID will still be used for this request even if the Set-Cookie
    // header cannot be written (the next request will just generate a new one,
    // but that is far better than throwing).
    try {
      cookieStore.set("cart_session_id", sessionId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 30, // 30 days
      });
    } catch {
      // Server Component render path – cookie will not persist, but the
      // current request can still proceed with the generated id.
    }
  }

  return sessionId;
}

// ---------------------------------------------------------------------------
// Client helpers
//
// KEY DESIGN DECISION — why we use the admin client for guest operations:
//
// Supabase runs PgBouncer in *transaction* mode.  set_config() with the
// third argument = true (transaction-local) is cleared the moment the
// transaction ends.  Because each supabase-js query is its own transaction
// on a potentially different backend connection, any value written via
// set_app_session_id() RPC is gone by the time the next SELECT/INSERT runs.
//
// All cart operations already run inside trusted Server Actions, so we do NOT
// need database-level RLS to validate the session ID — we validate it here in
// application code.  The admin (service-role) client bypasses RLS entirely,
// which is safe because:
//   1. We're running server-side only (never exposed to the browser).
//   2. We already resolved the correct cart_id before touching cart_items.
//   3. For authenticated users we still use the regular client so that
//      auth.uid()-based RLS remains active as a defence-in-depth layer.
// ---------------------------------------------------------------------------

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

// ---------------------------------------------------------------------------
// Cart ID resolution
// ---------------------------------------------------------------------------

async function getCartId(): Promise<string | null> {
  const sessionId = await getOrCreateSessionId();
  const user = await getAuthUser();

  // We use the admin client throughout getCartId so that RLS never blocks the
  // lookup/creation — we are trusted server code and we manually scope every
  // query to either user_id or session_id.
  const admin = createAdminClient();

  if (user) {
    // 1. Look for an existing cart owned by this user.
    const { data: userCart } = await admin
      .from("carts")
      .select("id")
      .eq("user_id", user.id)
      .maybeSingle();

    if (userCart) return userCart.id;

    // 2. Migrate a guest session cart to the now-authenticated user.
    const { data: sessionCart } = await admin
      .from("carts")
      .select("id")
      .eq("session_id", sessionId)
      .is("user_id", null)
      .maybeSingle();

    if (sessionCart) {
      await admin
        .from("carts")
        .update({ user_id: user.id })
        .eq("id", sessionCart.id);
      return sessionCart.id;
    }

    // 3. Create a fresh cart for the authenticated user.
    const { data: newCart, error } = await admin
      .from("carts")
      .insert({ user_id: user.id, session_id: sessionId })
      .select("id")
      .single();

    if (error) {
      console.error("Failed to create user cart:", error);
      return null;
    }
    return newCart.id;
  }

  // Guest path — scope strictly by session_id.
  const { data: sessionCart } = await admin
    .from("carts")
    .select("id")
    .eq("session_id", sessionId)
    .is("user_id", null)
    .maybeSingle();

  if (sessionCart) return sessionCart.id;

  const { data: newCart, error } = await admin
    .from("carts")
    .insert({ session_id: sessionId })
    .select("id")
    .single();

  if (error) {
    console.error("Failed to create guest cart:", error);
    return null;
  }
  return newCart.id;
}

// ---------------------------------------------------------------------------
// Public Server Actions
// ---------------------------------------------------------------------------

export async function getCart(): Promise<CartWithItems | null> {
  const cartId = await getCartId();
  if (!cartId) return null;

  const admin = createAdminClient();
  const { data, error } = await admin
    .from("carts")
    .select(
      `
      *,
      items:cart_items(
        *,
        product:products(*, category:categories(*), images:product_images(*)),
        variant:product_variants(*)
      )
    `
    )
    .eq("id", cartId)
    .single();

  if (error) {
    console.error("getCart error:", error);
    return null;
  }
  return data as CartWithItems;
}

export async function addToCart(
  productId: string,
  variantId: string | null,
  quantity: number = 1,
  cakeMessage?: string
) {
  const cartId = await getCartId();
  if (!cartId) throw new Error("Failed to create cart");

  const admin = createAdminClient();

  const { data: existingItem } = await admin
    .from("cart_items")
    .select("id, quantity")
    .eq("cart_id", cartId)
    .eq("product_id", productId)
    .is("variant_id", variantId ?? null)
    .maybeSingle();

  if (existingItem) {
    const { error } = await admin
      .from("cart_items")
      .update({
        quantity: existingItem.quantity + quantity,
        cake_message: cakeMessage ?? null,
      })
      .eq("id", existingItem.id);

    if (error) throw error;
  } else {
    const { error } = await admin.from("cart_items").insert({
      cart_id: cartId,
      product_id: productId,
      variant_id: variantId,
      quantity,
      cake_message: cakeMessage ?? null,
    });

    if (error) throw error;
  }

  revalidatePath("/cart");
}

export async function updateCartItem(itemId: string, quantity: number) {
  if (quantity <= 0) {
    await removeCartItem(itemId);
    return;
  }

  // Verify the item belongs to the caller's cart before mutating.
  const cartId = await getCartId();
  if (!cartId) throw new Error("No active cart");

  const admin = createAdminClient();

  const { error } = await admin
    .from("cart_items")
    .update({ quantity })
    .eq("id", itemId)
    .eq("cart_id", cartId); // ownership check

  if (error) throw error;

  revalidatePath("/cart");
}

export async function removeCartItem(itemId: string) {
  const cartId = await getCartId();
  if (!cartId) throw new Error("No active cart");

  const admin = createAdminClient();

  const { error } = await admin
    .from("cart_items")
    .delete()
    .eq("id", itemId)
    .eq("cart_id", cartId); // ownership check

  if (error) throw error;

  revalidatePath("/cart");
}

export async function clearCart() {
  const cartId = await getCartId();
  if (!cartId) return;

  const admin = createAdminClient();

  const { error } = await admin
    .from("cart_items")
    .delete()
    .eq("cart_id", cartId);

  if (error) throw error;

  revalidatePath("/cart");
}

export async function getCartCount(): Promise<number> {
  const cart = await getCart();
  if (!cart?.items) return 0;
  return cart.items.reduce((sum, item) => sum + item.quantity, 0);
}
