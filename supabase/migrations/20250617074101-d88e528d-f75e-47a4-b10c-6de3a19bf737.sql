
-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image_url TEXT,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create wishlist table
CREATE TABLE public.wishlist (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'processing',
  shipping_address JSONB NOT NULL,
  billing_address JSONB,
  payment_details JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update profiles table to include address fields
ALTER TABLE public.profiles ADD COLUMN mobile TEXT;
ALTER TABLE public.profiles ADD COLUMN shipping_address JSONB;
ALTER TABLE public.profiles ADD COLUMN billing_address JSONB;

-- Add RLS policies for products (public read access)
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view products" ON public.products FOR SELECT USING (true);

-- Add RLS policies for wishlist
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own wishlist" ON public.wishlist FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own wishlist" ON public.wishlist FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can delete from their own wishlist" ON public.wishlist FOR DELETE USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Add RLS policies for cart
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own cart" ON public.cart FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can manage their own cart" ON public.cart FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can update their own cart" ON public.cart FOR UPDATE USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can delete from their own cart" ON public.cart FOR DELETE USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Add RLS policies for orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid()));

-- Add RLS policies for order_items
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON public.order_items FOR SELECT USING (order_id IN (SELECT id FROM public.orders WHERE user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())));
CREATE POLICY "Users can create their own order items" ON public.order_items FOR INSERT WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id IN (SELECT id FROM public.profiles WHERE id = auth.uid())));

-- Insert sample products
INSERT INTO public.products (name, description, price, image_url, category, subcategory, stock_quantity) VALUES
-- Electronics - Mobile
('iPhone 15 Pro', 'Latest iPhone with A17 Pro chip', 99999.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab', 'electronics', 'mobiles', 50),
('Samsung Galaxy S24', 'Premium Android smartphone', 79999.00, 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9', 'electronics', 'mobiles', 30),
('OnePlus 12', 'Flagship killer smartphone', 64999.00, 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab', 'electronics', 'mobiles', 25),

-- Electronics - Laptops
('MacBook Pro M3', 'Professional laptop for creators', 199999.00, 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853', 'electronics', 'laptops', 15),
('Dell XPS 13', 'Ultra-portable Windows laptop', 89999.00, 'https://images.unsplash.com/photo-1531297484001-80022131f5a1', 'electronics', 'laptops', 20),
('HP Pavilion Gaming', 'Gaming laptop with RTX graphics', 65999.00, 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', 'electronics', 'laptops', 12),

-- Electronics - Accessories
('AirPods Pro', 'Wireless earbuds with ANC', 24999.00, 'https://images.unsplash.com/photo-1588423771073-b8903fbb85b5', 'electronics', 'accessories', 100),
('Wireless Charger', 'Fast wireless charging pad', 2999.00, 'https://images.unsplash.com/photo-1583394838336-acd977736f90', 'electronics', 'accessories', 75),

-- Fashion - Men's Clothing
('Cotton T-Shirt', 'Comfortable cotton t-shirt', 899.00, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab', 'fashion', 'mens-clothing', 200),
('Formal Shirt', 'Professional formal shirt', 1999.00, 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf', 'fashion', 'mens-clothing', 150),

-- Fashion - Women's Clothing
('Floral Dress', 'Beautiful summer dress', 2499.00, 'https://images.unsplash.com/photo-1595777457583-95e059d581b8', 'fashion', 'womens-clothing', 80),
('Silk Saree', 'Traditional silk saree', 8999.00, 'https://images.unsplash.com/photo-1610030469983-98e550d6193c', 'fashion', 'womens-clothing', 50);
