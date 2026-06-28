"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Settings } from "@/types";
import { isAdmin } from "./auth";

// [Fix: Medium 3] — use upsert with a fixed id=1 so concurrent requests
// cannot race-insert duplicate rows. Requires:
//   ALTER TABLE settings ADD CONSTRAINT settings_single_row CHECK (id = 1);
// (or simply ensure the table has a UNIQUE constraint on the primary key,
// which is true by default for integer PKs.)
export async function getSettings(): Promise<Settings | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("settings")
    .upsert(
      { id: 1, business_name: "Iku Sweet Cake" },
      {
        onConflict: "id",
        ignoreDuplicates: true, // only insert if row doesn't exist; never overwrite
      }
    )
    .select()
    .single();

  if (error) {
    // upsert failed (e.g. RLS blocks the insert on a fresh DB) — try a plain read
    const { data: existing } = await supabase
      .from("settings")
      .select("*")
      .single();
    return (existing as Settings) ?? null;
  }

  return data as Settings;
}

export async function updateSettings(formData: FormData) {
  if (!(await isAdmin())) throw new Error("Unauthorized");

  const supabase = await createClient();

  const settings = {
    business_name: (formData.get("business_name") as string) || null,
    phone: (formData.get("phone") as string) || null,
    support_email: (formData.get("support_email") as string) || null,
    telegram: (formData.get("telegram") as string) || null,
    facebook: (formData.get("facebook") as string) || null,
    address: (formData.get("address") as string) || null,
    business_hours: (formData.get("business_hours") as string) || null,
    about_title: (formData.get("about_title") as string) || null,
    about_content: (formData.get("about_content") as string) || null,
    about_image: (formData.get("about_image") as string) || null,
    logo: (formData.get("logo") as string) || null,
    favicon: (formData.get("favicon") as string) || null,
    meta_title: (formData.get("meta_title") as string) || null,
    meta_description: (formData.get("meta_description") as string) || null,
    enable_cash_on_delivery:
      formData.get("enable_cash_on_delivery") === "true",
    enable_telebirr: formData.get("enable_telebirr") === "true",
    enable_bank_transfer: formData.get("enable_bank_transfer") === "true",
    telegram_bot_token:
      (formData.get("telegram_bot_token") as string) || null,
    telegram_chat_id: (formData.get("telegram_chat_id") as string) || null,
  };

  // Always upsert on id=1 — no separate lookup needed
  const { error } = await supabase
    .from("settings")
    .upsert({ id: 1, ...settings }, { onConflict: "id" });

  if (error) throw error;

  revalidatePath("/admin/settings");
  revalidatePath("/about");
  revalidatePath("/contact");
}

export async function getActivePaymentMethods(): Promise<string[]> {
  const settings = await getSettings();
  if (!settings) return ["cash_on_delivery"];

  const methods: string[] = [];
  if (settings.enable_cash_on_delivery) methods.push("cash_on_delivery");
  if (settings.enable_telebirr) methods.push("telebirr");
  if (settings.enable_bank_transfer) methods.push("bank_transfer");

  return methods.length > 0 ? methods : ["cash_on_delivery"];
}
