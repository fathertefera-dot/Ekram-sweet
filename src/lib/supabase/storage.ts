"use server";

import { createClient } from "@/lib/supabase/server";

export async function uploadImage(file: File, bucket: string, path: string): Promise<string> {
  const supabase = await createClient();

  const fileExt = file.name.split(".").pop() || "jpg";
  const fileName = `${path}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName);

  return publicUrl;
}

export async function deleteImage(bucket: string, path: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path]);

  if (error) throw error;
}

export function getPublicUrl(bucket: string, path: string): string {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}
