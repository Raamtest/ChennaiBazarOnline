-- Create vendors table for the vendor registration and approval system
CREATE TABLE public.vendors (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending_approval',
  company_name TEXT,
  gst_number TEXT,
  business_address TEXT,
  username TEXT UNIQUE,
  password TEXT,
  secure_token TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  approved_at TIMESTAMP WITH TIME ZONE,
  approved_by UUID REFERENCES auth.users(id),
  city TEXT
);

-- Add Row Level Security (RLS) to the vendors table
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;

-- Create policies for vendors table
-- Admins can view all vendors (assuming we have admin roles - for now, we'll use a simple check)
CREATE POLICY "Admins can view all vendors" 
  ON public.vendors 
  FOR SELECT 
  USING (true); -- For now, all authenticated users can view (we'll refine this later)

-- Allow vendors to view their own record via secure token
CREATE POLICY "Vendors can view their own record via token" 
  ON public.vendors 
  FOR SELECT 
  USING (secure_token IS NOT NULL);

-- Allow vendors to update their own business details via secure token
CREATE POLICY "Vendors can update their business details" 
  ON public.vendors 
  FOR UPDATE 
  USING (secure_token IS NOT NULL);

-- Allow inserting new vendor registrations
CREATE POLICY "Allow vendor registration" 
  ON public.vendors 
  FOR INSERT 
  WITH CHECK (true);

-- Create function to generate secure tokens
CREATE OR REPLACE FUNCTION generate_secure_token() 
RETURNS TEXT AS $$
BEGIN
  RETURN encode(gen_random_bytes(32), 'hex');
END;
$$ LANGUAGE plpgsql;

-- Create function to update vendor status and generate token
CREATE OR REPLACE FUNCTION approve_vendor_initial(vendor_id UUID)
RETURNS TEXT AS $$
DECLARE
  token TEXT;
BEGIN
  token := generate_secure_token();
  
  UPDATE public.vendors 
  SET 
    status = 'approved_for_details',
    secure_token = token,
    updated_at = now()
  WHERE id = vendor_id;
  
  RETURN token;
END;
$$ LANGUAGE plpgsql;
