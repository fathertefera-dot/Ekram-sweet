"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import type { Product, Category, ProductVariant, ProductImage } from "@/types";

export async function getProducts(options: {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
} = {}) {
  const supabase = await createClient();
  const { category, search, page = 1, limit = 12, featured } = options;

  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)", { count: "exact" })
    .eq("status", "active");

  if (category) {
    query = query.eq("category_id", category);
  }

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (featured) {
    query = query.eq("featured", true);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    products: data as Product[] || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  };
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)")
    .eq("slug", slug)
    .eq("status", "active")
    .single();

  if (error) return null;
  return data as Product;
}

export async function getProductById(id: string): Promise<Product | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as Product;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)")
    .eq("status", "active")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(8);

  if (error) throw error;
  return data as Product[] || [];
}

// Admin: Get all products
export async function getAllProducts(options: {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
} = {}) {
  const supabase = await createClient();
  const { page = 1, limit = 10, search, status } = options;

  let query = supabase
    .from("products")
    .select("*, category:categories(*), images:product_images(*), variants:product_variants(*)", { count: "exact" });

  if (search) {
    query = query.ilike("name", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  const from = (page - 1) * limit;
  const to = from + limit - 1;

  const { data, error, count } = await query
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) throw error;

  return {
    products: data as Product[] || [],
    total: count || 0,
    totalPages: Math.ceil((count || 0) / limit),
    currentPage: page,
  };
}

// Admin: Create product
export async function createProduct(formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const category_id = formData.get("category_id") as string;
  const availability = formData.get("availability") as string;
  const featured = formData.get("featured") === "true";
  const status = formData.get("status") as string;
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;
  const images = JSON.parse(formData.get("images") as string) as string[];
  const variants = JSON.parse(formData.get("variants") as string) as { name: string; price: number }[];

  // Create product
  const { data: product, error: productError } = await supabase
    .from("products")
    .insert({
      name,
      slug,
      description,
      category_id,
      availability,
      featured,
      status,
      meta_title,
      meta_description,
    })
    .select()
    .single();

  if (productError) throw productError;

  // Insert images
  if (images.length > 0) {
    const imageInserts = images.map((url, index) => ({
      product_id: product.id,
      image_url: url,
      sort_order: index,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(imageInserts);

    if (imagesError) throw imagesError;
  }

  // Insert variants
  if (variants.length > 0) {
    const variantInserts = variants.map((v) => ({
      product_id: product.id,
      name: v.name,
      price: v.price,
    }));

    const { error: variantsError } = await supabase
      .from("product_variants")
      .insert(variantInserts);

    if (variantsError) throw variantsError;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  return product;
}

// Admin: Update product
export async function updateProduct(id: string, formData: FormData) {
  const supabase = await createClient();

  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const description = formData.get("description") as string;
  const category_id = formData.get("category_id") as string;
  const availability = formData.get("availability") as string;
  const featured = formData.get("featured") === "true";
  const status = formData.get("status") as string;
  const meta_title = formData.get("meta_title") as string;
  const meta_description = formData.get("meta_description") as string;
  const images = JSON.parse(formData.get("images") as string) as string[];
  const variants = JSON.parse(formData.get("variants") as string) as { name: string; price: number }[];

  // Update product
  const { error: productError } = await supabase
    .from("products")
    .update({
      name,
      slug,
      description,
      category_id,
      availability,
      featured,
      status,
      meta_title,
      meta_description,
    })
    .eq("id", id);

  if (productError) throw productError;

  // Delete existing images and re-insert
  const { error: deleteImagesError } = await supabase
    .from("product_images")
    .delete()
    .eq("product_id", id);

  if (deleteImagesError) throw deleteImagesError;

  if (images.length > 0) {
    const imageInserts = images.map((url, index) => ({
      product_id: id,
      image_url: url,
      sort_order: index,
    }));

    const { error: imagesError } = await supabase
      .from("product_images")
      .insert(imageInserts);

    if (imagesError) throw imagesError;
  }

  // Delete existing variants and re-insert
  const { error: deleteVariantsError } = await supabase
    .from("product_variants")
    .delete()
    .eq("product_id", id);

  if (deleteVariantsError) throw deleteVariantsError;

  if (variants.length > 0) {
    const variantInserts = variants.map((v) => ({
      product_id: id,
      name: v.name,
      price: v.price,
    }));

    const { error: variantsError } = await supabase
      .from("product_variants")
      .insert(variantInserts);

    if (variantsError) throw variantsError;
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath(`/products/${slug}`);
}

// Admin: Delete product
export async function deleteProduct(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id);

  if (error) throw error;

  revalidatePath("/admin/products");
  revalidatePath("/products");
}
