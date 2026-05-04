-- 016_messages_support_chat.sql
-- Add sender_name and per-role read tracking to the existing messages table,
-- enable Realtime, and add indexes for fast inbox queries.

ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS sender_name     text,
  ADD COLUMN IF NOT EXISTS client_read_at  timestamptz;

-- Rename existing read_at to admin_read_at semantically via a new column
-- (we keep read_at in place to avoid breaking existing code and use it as admin_read_at)

-- Enable Realtime so chat updates live
ALTER PUBLICATION supabase_realtime ADD TABLE public.messages;

-- Indexes for inbox + unread queries
CREATE INDEX IF NOT EXISTS messages_company_created
  ON public.messages (company_id, created_at DESC);

CREATE INDEX IF NOT EXISTS messages_company_admin_unread
  ON public.messages (company_id, read_at)
  WHERE read_at IS NULL;

CREATE INDEX IF NOT EXISTS messages_company_client_unread
  ON public.messages (company_id, client_read_at)
  WHERE client_read_at IS NULL;
