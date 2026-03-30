-- Create Enum for payment states
CREATE TYPE public.payment_status AS ENUM ('pending', 'success', 'failed', 'cancelled');

-- Create public.payments table
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    order_id TEXT NOT NULL UNIQUE,
    amount INTEGER NOT NULL,
    status public.payment_status NOT NULL DEFAULT 'pending',
    payment_key TEXT,
    fail_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Allow users to read only their own payments
CREATE POLICY "Users can view own payments" ON public.payments
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert their own payments
CREATE POLICY "Users can insert own payments" ON public.payments
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own payments
CREATE POLICY "Users can update own payments" ON public.payments
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Attach the updated_at trigger
CREATE TRIGGER handle_payments_updated_at
    BEFORE UPDATE ON public.payments
    FOR EACH ROW
    EXECUTE FUNCTION public.set_current_timestamp_updated_at();
