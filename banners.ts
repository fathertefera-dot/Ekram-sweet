"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Banner } from "@/types";

export async function getBanners(): Promise<Banner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Banner[] || [];
}

export async function getAllBanners(): Promise<Banner[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Banner[] || [];
}

export async function createBanner(formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const image = formData.get("image") as string;
  const link = formData.get("link") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const is_active = formData.get("is_active") === "true";

  const { data, error } = await supabase
    .from("banners")
    .insert({ title, image, link, sort_order, is_active })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/banners");
  revalidatePath("/");
  return data;
}

export async function updateBanner(id: string, formData: FormData) {
  const supabase = await createClient();

  const title = formData.get("title") as string;
  const image = formData.get("image") as string;
  const link = formData.get("link") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const is_active = formData.get("is_active") === "true";

  const { error } = await supabase
    .from("banners")
    .update({ title, image, link, sort_order, is_active })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/banners");
  revalidatePath("/");
}

export async function deleteBanner(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("banners")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/banners");
  revalidatePath("/");
}
