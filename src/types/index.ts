export type ProductStatus = "draft" | "active" | "archived";
export type AvailabilityStatus = "available" | "pre-order";
export type OrderStatus = "pending" | "confirmed" | "preparing" | "delivered" | "cancelled";
export type PaymentMethod = "cash_on_delivery" | "telebirr" | "bank_transfer";

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: "customer" | "admin";
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string;
  availability: AvailabilityStatus;
  featured: boolean;
  status: ProductStatus;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  price: number;
  created_at: string;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  cake_message: string | null;
  created_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  delivery_address: string;
  order_note: string | null;
  payment_method: PaymentMethod;
  status: OrderStatus;
  cancel_reason: string | null;
  total_amount: number;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  variant_name: string | null;
  price: number;
  quantity: number;
  cake_message: string | null;
  created_at: string;
}

export interface Banner {
  id: string;
  title: string;
  image: string;
  link: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Settings {
  id: string;
  business_name: string;
  phone: string | null;
  support_email: string | null;
  telegram: string | null;
  facebook: string | null;
  address: string | null;
  business_hours: string | null;
  about_title: string | null;
  about_content: string | null;
  about_image: string | null;
  logo: string | null;
  favicon: string | null;
  meta_title: string | null;
  meta_description: string | null;
  enable_cash_on_delivery: boolean;
  enable_telebirr: boolean;
  enable_bank_transfer: boolean;
  telegram_bot_token: string | null;
  telegram_chat_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateOrderInput {
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  delivery_address: string;
  order_note?: string;
  payment_method: PaymentMethod;
  items: {
    product_id: string;
    variant_id?: string;
    quantity: number;
    cake_message?: string;
  }[];
}

export interface CartItemWithProduct {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  cake_message: string | null;
  created_at: string;
  product: Product;
  variant: ProductVariant | null;
}

export interface CartWithItems {
  id: string;
  user_id: string | null;
  session_id: string;
  created_at: string;
  updated_at: string;
  items: CartItemWithProduct[];
}
