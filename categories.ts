"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Category } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Category[] || [];
}

export async function getAllCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data as Category[] || [];
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error) return null;
  return data as Category;
}

export async function createCategory(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const image = formData.get("image") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const is_active = formData.get("is_active") === "true";

  const { data, error } = await supabase
    .from("categories")
    .insert({ name, slug, image, sort_order, is_active })
    .select()
    .single();

  if (error) throw error;

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  return data;
}

export async function updateCategory(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const image = formData.get("image") as string;
  const sort_order = parseInt(formData.get("sort_order") as string) || 0;
  const is_active = formData.get("is_active") === "true";

  const { error } = await supabase
    .from("categories")
    .update({ name, slug, image, sort_order, is_active })
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/categories");
  revalidatePath("/products");
}

export async function deleteCategory(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/categories");
  revalidatePath("/products");
}
