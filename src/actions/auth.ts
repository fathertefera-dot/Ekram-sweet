"use server";

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { loginSchema, registerSchema } from "@/lib/validations";

export async function login(formData: FormData) {
  const supabase = await createClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const parsed = loginSchema.safeParse({ email, password });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: error.message };

  revalidatePath("/", "layout");
  redirect("/");
}

export async function register(formData: FormData) {
  const supabase = await createClient();

  const fullName = formData.get("fullName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  const parsed = registerSchema.safeParse({
    fullName,
    email,
    phone,
    password,
    confirmPassword,
  });
  if (!parsed.success) {
    return { error: parsed.error.errors[0].message };
  }

  const { error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName, phone },
    },
  });

  if (authError) return { error: authError.message };

  // Profile is created automatically by the DB trigger on auth.users
  revalidatePath("/", "layout");
  redirect("/login?registered=true");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}

// [Fix: Medium 1] — fetch only `role` instead of full profile `SELECT *`
// This halves the payload and avoids fetching unneeded columns on every
// admin authorization check.
export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email, phone, role, created_at")
    .eq("id", user.id)
    .single();

  return profile;
}

// isAdmin makes 2 network calls (auth.getUser + profiles SELECT).
// If you want to eliminate one call completely, add `role` as a custom JWT
// claim via a Supabase Auth Hook — see the comments in code_review_v2.md.
export async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();

  // Fast path: read role from the JWT custom claim if it has been configured
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) return false;

  // Try JWT claim first (zero extra DB call)
  try {
    const payload = JSON.parse(
      Buffer.from(session.access_token.split(".")[1], "base64").toString()
    );
    if (payload?.user_role !== undefined) {
      return payload.user_role === "admin";
    }
  } catch {
    // JWT parse failed — fall through to DB lookup
  }

  // Fallback: DB lookup (one extra network call)
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", session.user.id)
    .single();

  return profile?.role === "admin";
}
