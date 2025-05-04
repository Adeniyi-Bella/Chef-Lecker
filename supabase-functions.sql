-- Function to create the meals table
CREATE OR REPLACE FUNCTION create_meals_table()
RETURNS void AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS meals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    userName TEXT NOT NULL,
    preparation TEXT NOT NULL,
    ingredients JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updatedAt TIMESTAMP WITH TIME ZONE DEFAULT NOW()
  );
  
  -- Add indexes for better performance
  CREATE INDEX IF NOT EXISTS meals_name_idx ON meals (name);
  CREATE INDEX IF NOT EXISTS meals_created_at_idx ON meals (created_at DESC);
END;
$$ LANGUAGE plpgsql;

-- Function to get table columns
CREATE OR REPLACE FUNCTION get_table_columns(table_name TEXT)
RETURNS TABLE(column_name TEXT, data_type TEXT) AS $$
BEGIN
  RETURN QUERY
  SELECT c.column_name::TEXT, c.data_type::TEXT
  FROM information_schema.columns c
  WHERE c.table_name = table_name;
END;
$$ LANGUAGE plpgsql;

-- Function to add ingredients column
CREATE OR REPLACE FUNCTION add_ingredients_column()
RETURNS void AS $$
BEGIN
  ALTER TABLE meals ADD COLUMN IF NOT EXISTS ingredients JSONB DEFAULT '[]'::jsonb;
END;
$$ LANGUAGE plpgsql;
