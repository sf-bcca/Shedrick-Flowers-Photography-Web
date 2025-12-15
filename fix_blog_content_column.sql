-- Add content and excerpt columns to blog table if they don't exist
DO $$
BEGIN
    -- Add content column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'content') THEN
        ALTER TABLE blog ADD COLUMN content TEXT;
    END IF;

    -- Add excerpt column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'excerpt') THEN
        ALTER TABLE blog ADD COLUMN excerpt TEXT;
    END IF;
END $$;
