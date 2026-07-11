-- Enable RLS on prices table (created outside of migrations)
-- This table likely stores market data (stock/bond prices) for missions

-- Enable RLS if table exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'prices') THEN
    ALTER TABLE prices ENABLE ROW LEVEL SECURITY;

    -- Allow anon read for demo/reference price data
    DROP POLICY IF EXISTS "anon_read_prices" ON prices;
    CREATE POLICY "anon_read_prices"
      ON prices
      FOR SELECT
      TO anon
      USING (true);

    -- Allow authenticated users to read prices
    DROP POLICY IF EXISTS "auth_read_prices" ON prices;
    CREATE POLICY "auth_read_prices"
      ON prices
      FOR SELECT
      TO authenticated
      USING (true);

    -- Block anon writes explicitly (defense in depth)
    REVOKE ALL ON prices FROM anon;
    GRANT SELECT ON prices TO anon;
  END IF;
END $$;