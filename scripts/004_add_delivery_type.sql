-- Add delivery_type column to orders table if it doesn't exist
-- This migration script is safe to run multiple times

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'orders' 
        AND column_name = 'delivery_type'
    ) THEN
        ALTER TABLE orders ADD COLUMN delivery_type VARCHAR(20) DEFAULT 'delivery';
    END IF;
END $$;

