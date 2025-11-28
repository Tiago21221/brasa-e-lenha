-- Add ingredients column to products table if it doesn't exist
-- This migration script is safe to run multiple times

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'products' 
        AND column_name = 'ingredients'
    ) THEN
        ALTER TABLE products ADD COLUMN ingredients TEXT;
    END IF;
END $$;

