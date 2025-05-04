-- Check if the meals table exists
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  userName TEXT NOT NULL,
  preparation TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add the ingredients column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'meals' AND column_name = 'ingredients'
  ) THEN
    ALTER TABLE meals ADD COLUMN ingredients JSONB DEFAULT '[]'::jsonb;
  END IF;
END $$;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS meals_name_idx ON meals (name);
CREATE INDEX IF NOT EXISTS meals_created_at_idx ON meals (created_at DESC);
