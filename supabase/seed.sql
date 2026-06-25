-- Seed data for Iku Sweet Cake
-- Run this after applying migrations

-- Categories
INSERT INTO categories (name, slug, image, sort_order, is_active) VALUES
  ('Birthday Cakes', 'birthday-cakes', '/images/birthday-cake.jpg', 1, true),
  ('Wedding Cakes', 'wedding-cakes', '/images/wedding-cake.jpg', 2, true),
  ('Chocolate Cakes', 'chocolate-cakes', '/images/chocolate-cake.jpg', 3, true),
  ('Fruit Cakes', 'fruit-cakes', '/images/strawberry-cake.jpg', 4, true),
  ('Red Velvet', 'red-velvet', '/images/red-velvet-cake.jpg', 5, true)
ON CONFLICT (slug) DO NOTHING;

-- Products with variants
-- Birthday Cake
DO $$
DECLARE
  bday_cat_id UUID;
  choco_cat_id UUID;
  wedding_cat_id UUID;
  fruit_cat_id UUID;
  velvet_cat_id UUID;
  product_id UUID;
BEGIN
  SELECT id INTO bday_cat_id FROM categories WHERE slug = 'birthday-cakes';
  SELECT id INTO choco_cat_id FROM categories WHERE slug = 'chocolate-cakes';
  SELECT id INTO wedding_cat_id FROM categories WHERE slug = 'wedding-cakes';
  SELECT id INTO fruit_cat_id FROM categories WHERE slug = 'fruit-cakes';
  SELECT id INTO velvet_cat_id FROM categories WHERE slug = 'red-velvet';

  -- Chocolate Fudge Cake
  INSERT INTO products (name, slug, description, category_id, availability, featured, status, meta_title, meta_description)
  VALUES (
    'Chocolate Fudge Cake',
    'chocolate-fudge-cake',
    'Rich, moist chocolate cake layered with velvety chocolate fudge frosting. Topped with chocolate shavings and fresh raspberries. Perfect for chocolate lovers.',
    choco_cat_id,
    'available',
    true,
    'active',
    'Chocolate Fudge Cake - Iku Sweet Cake',
    'Indulge in our rich chocolate fudge cake made with premium cocoa and fresh ingredients.'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_id;

  IF FOUND THEN
    INSERT INTO product_images (product_id, image_url, sort_order) VALUES
      (product_id, '/images/chocolate-cake.jpg', 0);
    
    INSERT INTO product_variants (product_id, name, price) VALUES
      (product_id, 'Small (500g)', 450),
      (product_id, 'Medium (1kg)', 850),
      (product_id, 'Large (2kg)', 1500);
  END IF;

  -- Classic Birthday Cake
  INSERT INTO products (name, slug, description, category_id, availability, featured, status, meta_title, meta_description)
  VALUES (
    'Classic Birthday Cake',
    'classic-birthday-cake',
    'Beautiful birthday cake with buttercream frosting, colorful sprinkles, and fresh flowers. Customizable with your choice of colors and decorations.',
    bday_cat_id,
    'available',
    true,
    'active',
    'Classic Birthday Cake - Iku Sweet Cake',
    'Celebrate your special day with our stunning birthday cakes.'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_id;

  IF FOUND THEN
    INSERT INTO product_images (product_id, image_url, sort_order) VALUES
      (product_id, '/images/birthday-cake.jpg', 0);
    
    INSERT INTO product_variants (product_id, name, price) VALUES
      (product_id, 'Small (serves 6-8)', 600),
      (product_id, 'Medium (serves 10-12)', 1000),
      (product_id, 'Large (serves 15-20)', 1600);
  END IF;

  -- Elegant Wedding Cake
  INSERT INTO products (name, slug, description, category_id, availability, featured, status, meta_title, meta_description)
  VALUES (
    'Elegant Wedding Cake',
    'elegant-wedding-cake',
    'Stunning multi-tier wedding cake with delicate sugar flowers and pearl details. Customizable design to match your wedding theme.',
    wedding_cat_id,
    'pre-order',
    true,
    'active',
    'Elegant Wedding Cake - Iku Sweet Cake',
    'Make your wedding day unforgettable with our custom wedding cakes.'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_id;

  IF FOUND THEN
    INSERT INTO product_images (product_id, image_url, sort_order) VALUES
      (product_id, '/images/wedding-cake.jpg', 0);
    
    INSERT INTO product_variants (product_id, name, price) VALUES
      (product_id, '2-Tier (serves 30)', 2500),
      (product_id, '3-Tier (serves 50)', 4000),
      (product_id, '4-Tier (serves 80)', 6000);
  END IF;

  -- Strawberry Cream Cake
  INSERT INTO products (name, slug, description, category_id, availability, featured, status, meta_title, meta_description)
  VALUES (
    'Strawberry Cream Cake',
    'strawberry-cream-cake',
    'Light and fluffy sponge cake layered with fresh whipped cream and ripe strawberries. A refreshing treat for any occasion.',
    fruit_cat_id,
    'available',
    true,
    'active',
    'Strawberry Cream Cake - Iku Sweet Cake',
    'Fresh strawberry cream cake made with seasonal strawberries.'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_id;

  IF FOUND THEN
    INSERT INTO product_images (product_id, image_url, sort_order) VALUES
      (product_id, '/images/strawberry-cake.jpg', 0);
    
    INSERT INTO product_variants (product_id, name, price) VALUES
      (product_id, 'Small (500g)', 500),
      (product_id, 'Medium (1kg)', 900),
      (product_id, 'Large (2kg)', 1600);
  END IF;

  -- Red Velvet Cake
  INSERT INTO products (name, slug, description, category_id, availability, featured, status, meta_title, meta_description)
  VALUES (
    'Red Velvet Cake',
    'red-velvet-cake',
    'Classic red velvet cake with cream cheese frosting. Moist, tender crumb with a hint of cocoa. Decorated with edible roses.',
    velvet_cat_id,
    'available',
    true,
    'active',
    'Red Velvet Cake - Iku Sweet Cake',
    'Our signature red velvet cake with rich cream cheese frosting.'
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO product_id;

  IF FOUND THEN
    INSERT INTO product_images (product_id, image_url, sort_order) VALUES
      (product_id, '/images/red-velvet-cake.jpg', 0);
    
    INSERT INTO product_variants (product_id, name, price) VALUES
      (product_id, 'Small (500g)', 550),
      (product_id, 'Medium (1kg)', 950),
      (product_id, 'Large (2kg)', 1700);
  END IF;
END $$;

-- Default Banner
INSERT INTO banners (title, image, link, sort_order, is_active) VALUES
  (
    'Delicious Cakes for Every Occasion',
    '/images/hero-banner.jpg',
    '/products',
    0,
    true
  )
ON CONFLICT DO NOTHING;

-- Default Settings
INSERT INTO settings (
  business_name, phone, support_email, telegram, facebook,
  address, business_hours, about_title, about_content, about_image,
  enable_cash_on_delivery, enable_telebirr, enable_bank_transfer
) VALUES (
  'Iku Sweet Cake',
  '+251 911 234 567',
  'hello@ikusweetcake.com',
  '@ikusweetcake',
  'ikusweetcake',
  'Bole, Addis Ababa, Ethiopia',
  'Mon - Sat: 8:00 AM - 8:00 PM',
  'Crafting Sweet Memories Since 2019',
  'At Iku Sweet Cake, we believe every celebration deserves a perfect cake. Our skilled bakers use only the finest ingredients to create delicious masterpieces that not only look stunning but taste incredible too. From birthdays to weddings, we are here to make your special moments even sweeter.',
  '/images/about-cake.jpg',
  true,
  false,
  false
)
ON CONFLICT DO NOTHING;
