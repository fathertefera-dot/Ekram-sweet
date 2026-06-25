-- Carts policies
CREATE POLICY "Carts are viewable by owner" ON carts
  FOR SELECT USING (user_id = auth.uid() OR session_id = COALESCE(current_setting('app.session_id', true), ''));

CREATE POLICY "Carts are insertable by anyone" ON carts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Carts are updatable by owner" ON carts
  FOR UPDATE USING (user_id = auth.uid() OR session_id = COALESCE(current_setting('app.session_id', true), ''));

CREATE POLICY "Carts are deletable by owner" ON carts
  FOR DELETE USING (user_id = auth.uid() OR session_id = COALESCE(current_setting('app.session_id', true), ''));

-- Cart items policies
CREATE POLICY "Cart items are viewable by cart owner" ON cart_items
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id = COALESCE(current_setting('app.session_id', true), ''))
    )
  );

CREATE POLICY "Cart items are insertable by cart owner" ON cart_items
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id = COALESCE(current_setting('app.session_id', true), ''))
    )
  );

CREATE POLICY "Cart items are updatable by cart owner" ON cart_items
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id = COALESCE(current_setting('app.session_id', true), ''))
    )
  );

CREATE POLICY "Cart items are deletable by cart owner" ON cart_items
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM carts 
      WHERE carts.id = cart_items.cart_id 
      AND (carts.user_id = auth.uid() OR carts.session_id = COALESCE(current_setting('app.session_id', true), ''))
    )
  );

-- Orders policies
CREATE POLICY "Orders are viewable by admin" ON orders
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Orders are insertable by anyone" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Orders are updatable by admin" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Order items policies
CREATE POLICY "Order items are viewable by admin" ON order_items
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Order items are insertable by anyone" ON order_items
  FOR INSERT WITH CHECK (true);

-- Banners policies
CREATE POLICY "Active banners are viewable by everyone" ON banners
  FOR SELECT USING (is_active = true OR EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  ));

CREATE POLICY "Banners are manageable by admins" ON banners
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Settings policies
CREATE POLICY "Settings are viewable by everyone" ON settings
  FOR SELECT USING (true);

CREATE POLICY "Settings are manageable by admins" ON settings
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
