import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const registerSchema = z
  .object({
    fullName: z.string().min(2, "Full name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type RegisterInput = z.infer<typeof registerSchema>;

export const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Full name is required"),
  customer_phone: z.string().min(10, "Valid phone number is required"),
  customer_email: z.string().email("Invalid email").optional().or(z.literal("")),
  delivery_address: z.string().min(5, "Delivery address is required"),
  order_note: z.string().optional(),
  payment_method: z.enum(["cash_on_delivery", "telebirr", "bank_transfer"]),
});

export type CheckoutInput = z.infer<typeof checkoutSchema>;

export const orderTrackingSchema = z.object({
  order_number: z.string().min(1, "Order number is required"),
  phone_number: z.string().min(10, "Phone number is required"),
});

export type OrderTrackingInput = z.infer<typeof orderTrackingSchema>;

export const categorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
  image: z.string().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type CategoryInput = z.infer<typeof categorySchema>;

export const productVariantSchema = z.object({
  name: z.string().min(1, "Variant name is required"),
  price: z.number().min(0, "Price must be positive"),
});

export type ProductVariantInput = z.infer<typeof productVariantSchema>;

export const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  slug: z.string().min(1, "Slug is required"),
  description: z.string().optional(),
  category_id: z.string().uuid("Category is required"),
  availability: z.enum(["available", "pre-order"]),
  featured: z.boolean().default(false),
  status: z.enum(["draft", "active", "archived"]),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  variants: z.array(productVariantSchema).min(1, "At least one variant is required"),
  images: z.array(z.string()).min(1, "At least one image is required"),
});

export type ProductInput = z.infer<typeof productSchema>;

export const bannerSchema = z.object({
  title: z.string().min(1, "Title is required"),
  image: z.string().min(1, "Image is required"),
  link: z.string().optional(),
  sort_order: z.number().int().min(0).default(0),
  is_active: z.boolean().default(true),
});

export type BannerInput = z.infer<typeof bannerSchema>;

export const settingsSchema = z.object({
  business_name: z.string().min(1, "Business name is required"),
  phone: z.string().optional(),
  support_email: z.string().email("Invalid email").optional().or(z.literal("")),
  telegram: z.string().optional(),
  facebook: z.string().optional(),
  address: z.string().optional(),
  business_hours: z.string().optional(),
  about_title: z.string().optional(),
  about_content: z.string().optional(),
  about_image: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  enable_cash_on_delivery: z.boolean().default(true),
  enable_telebirr: z.boolean().default(false),
  enable_bank_transfer: z.boolean().default(false),
  telegram_bot_token: z.string().optional(),
  telegram_chat_id: z.string().optional(),
});

export type SettingsInput = z.infer<typeof settingsSchema>;
