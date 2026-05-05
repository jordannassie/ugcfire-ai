-- 017_lead_folders.sql
-- Adds lead_folders table and folder_id / archived_at to leads

CREATE TABLE IF NOT EXISTS public.lead_folders (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name         text        NOT NULL,
  description  text,
  search_query text,
  city         text,
  category     text,
  color        text        DEFAULT '#FF3B1A',
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

ALTER TABLE public.leads
  ADD COLUMN IF NOT EXISTS folder_id    uuid        REFERENCES public.lead_folders(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS archived_at  timestamptz NULL;

CREATE INDEX IF NOT EXISTS idx_leads_folder_id       ON public.leads(folder_id);
CREATE INDEX IF NOT EXISTS idx_leads_archived_at     ON public.leads(archived_at);
CREATE INDEX IF NOT EXISTS idx_lead_folders_created  ON public.lead_folders(created_at DESC);
