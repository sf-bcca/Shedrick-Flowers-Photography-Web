-- Add status and tags columns to blog table if they don't exist
DO $$
BEGIN
    -- Add status column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'status') THEN
        ALTER TABLE blog ADD COLUMN status TEXT DEFAULT 'Draft';
    END IF;

    -- Add tags column
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'blog' AND column_name = 'tags') THEN
        ALTER TABLE blog ADD COLUMN tags TEXT[] DEFAULT '{}';
    END IF;
END $$;
