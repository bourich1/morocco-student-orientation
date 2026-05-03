-- Run this SQL in your Supabase SQL Editor to set up the database

-- 1. Create the institutions table
CREATE TABLE IF NOT EXISTS public.institutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    category TEXT NOT NULL CHECK (category IN ('vocational', 'military', 'university', 'institute', 'school')),
    description TEXT,
    fields JSONB DEFAULT '[]'::jsonb,
    city TEXT NOT NULL,
    image_url TEXT,
    apply_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Set up Storage for images
INSERT INTO storage.buckets (id, name, public) VALUES ('institutions', 'institutions', true) ON CONFLICT DO NOTHING;

-- 3. Row Level Security (RLS)
ALTER TABLE public.institutions ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Allow public read access on institutions"
    ON public.institutions
    FOR SELECT
    USING (true);

-- Allow authenticated users to insert/update/delete
CREATE POLICY "Allow authenticated users to insert institutions"
    ON public.institutions
    FOR INSERT
    TO authenticated
    WITH CHECK (true);

CREATE POLICY "Allow authenticated users to update institutions"
    ON public.institutions
    FOR UPDATE
    TO authenticated
    USING (true);

CREATE POLICY "Allow authenticated users to delete institutions"
    ON public.institutions
    FOR DELETE
    TO authenticated
    USING (true);

-- Storage RLS: Public read access for images
CREATE POLICY "Public Access"
    ON storage.objects FOR SELECT
    USING ( bucket_id = 'institutions' );

-- Storage RLS: Authenticated insert/update/delete
CREATE POLICY "Authenticated Insert"
    ON storage.objects FOR INSERT
    TO authenticated
    WITH CHECK ( bucket_id = 'institutions' );

CREATE POLICY "Authenticated Update"
    ON storage.objects FOR UPDATE
    TO authenticated
    USING ( bucket_id = 'institutions' );

CREATE POLICY "Authenticated Delete"
    ON storage.objects FOR DELETE
    TO authenticated
    USING ( bucket_id = 'institutions' );
