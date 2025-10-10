-- Ensure users table has required columns for auth
ALTER TABLE IF EXISTS users
  ADD COLUMN IF NOT EXISTS name TEXT,
  ADD COLUMN IF NOT EXISTS password_hash TEXT,
  ADD COLUMN IF NOT EXISTS created_at TIMESTAMPTZ DEFAULT now(),
  ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Ensure email is unique (create index if it doesn't exist)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes WHERE schemaname = 'public' AND indexname = 'users_email_key'
  ) THEN
    EXECUTE 'CREATE UNIQUE INDEX users_email_key ON users(email)';
  END IF;
END$$;
