-- ============================================
-- BANNERS TABLE
-- ============================================
CREATE TABLE banners (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  image TEXT NOT NULL,
  link TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_banners_is_active ON banners(is_active);
CREATE INDEX idx_banners_sort_order ON banners(sort_order);

-- ============================================
-- SETTINGS TABLE
-- ============================================
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_name TEXT NOT NULL DEFAULT 'Iku Sweet Cake',
  phone TEXT,
  support_email TEXT,
  telegram TEXT,
  facebook TEXT,
  address TEXT,
  business_hours TEXT,
  about_title TEXT,
  about_content TEXT,
  about_image TEXT,
  logo TEXT,
  favicon TEXT,
  meta_title TEXT,
  meta_description TEXT,
  enable_cash_on_delivery BOOLEAN NOT NULL DEFAULT true,
  enable_telebirr BOOLEAN NOT NULL DEFAULT false,
  enable_bank_transfer BOOLEAN NOT NULL DEFAULT false,
  telegram_bot_token TEXT,
  telegram_chat_id TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Insert default settings
INSERT INTO settings (business_name) VALUES ('Iku Sweet Cake') ON CONFLICT DO NOTHING;

-- ============================================
-- ORDER NUMBER SEQUENCE
-- ============================================
CREATE SEQUENCE IF NOT EXISTS order_number_seq START 1001;

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TEXT AS $$
BEGIN
  RETURN 'IKU-' || nextval('order_number_seq');
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_carts_updated_at BEFORE UPDATE ON carts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_banners_updated_at BEFORE UPDATE ON banners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_settings_updated_at BEFORE UPDATE ON settings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
