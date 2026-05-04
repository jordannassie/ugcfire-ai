-- ============================================================
-- 013_studio_drive.sql
-- Studio Drive: folders, files, comments for client workspaces
-- Run this in Supabase SQL Editor
-- ============================================================

-- Drop old tables if they exist (from previous simpler migration)
DROP TABLE IF EXISTS studio_files   CASCADE;
DROP TABLE IF EXISTS studio_folders CASCADE;

-- ── studio_folders ────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS studio_folders (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id       uuid        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  parent_folder_id uuid        REFERENCES public.studio_folders(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  position         integer     NOT NULL DEFAULT 0,
  created_by       uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at       timestamptz,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

-- ── studio_files ──────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS studio_files (
  id             uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id     uuid        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  folder_id      uuid        REFERENCES public.studio_folders(id) ON DELETE SET NULL,
  name           text        NOT NULL,
  storage_bucket text        NOT NULL DEFAULT 'studio-assets',
  storage_path   text        NOT NULL,
  file_url       text,
  mime_type      text,
  file_size      bigint,
  status         text        NOT NULL DEFAULT 'uploaded'
                             CHECK (status IN ('uploaded','ready_for_review','approved','revision_requested','delivered','archived')),
  uploaded_by    uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  deleted_at     timestamptz,
  created_at     timestamptz DEFAULT now(),
  updated_at     timestamptz DEFAULT now()
);

-- ── studio_comments ───────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS studio_comments (
  id              uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id      uuid        NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  file_id         uuid        REFERENCES public.studio_files(id) ON DELETE CASCADE,
  folder_id       uuid        REFERENCES public.studio_folders(id) ON DELETE CASCADE,
  sender_user_id  uuid        REFERENCES auth.users(id) ON DELETE SET NULL,
  sender_role     text        NOT NULL CHECK (sender_role IN ('client', 'admin')),
  sender_name     text,
  message         text        NOT NULL,
  created_at      timestamptz DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_studio_folders_company_id        ON studio_folders(company_id);
CREATE INDEX IF NOT EXISTS idx_studio_folders_parent_folder_id  ON studio_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_studio_folders_deleted_at        ON studio_folders(deleted_at);
CREATE INDEX IF NOT EXISTS idx_studio_files_company_id          ON studio_files(company_id);
CREATE INDEX IF NOT EXISTS idx_studio_files_folder_id           ON studio_files(folder_id);
CREATE INDEX IF NOT EXISTS idx_studio_files_deleted_at          ON studio_files(deleted_at);
CREATE INDEX IF NOT EXISTS idx_studio_comments_file_id          ON studio_comments(file_id);
CREATE INDEX IF NOT EXISTS idx_studio_comments_company_id       ON studio_comments(company_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE studio_folders  ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_files    ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_comments ENABLE ROW LEVEL SECURITY;

-- Helper: check if current user is admin
-- (assumes profiles table with role column)
CREATE OR REPLACE FUNCTION is_admin()
RETURNS boolean LANGUAGE sql SECURITY DEFINER AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
  )
$$;

-- studio_folders RLS
CREATE POLICY "studio_folders_access" ON studio_folders
  FOR ALL USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = studio_folders.company_id
        AND companies.owner_user_id = auth.uid()
    )
  );

-- studio_files RLS
CREATE POLICY "studio_files_access" ON studio_files
  FOR ALL USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = studio_files.company_id
        AND companies.owner_user_id = auth.uid()
    )
  );

-- studio_comments RLS
CREATE POLICY "studio_comments_access" ON studio_comments
  FOR ALL USING (
    is_admin()
    OR EXISTS (
      SELECT 1 FROM companies
      WHERE companies.id = studio_comments.company_id
        AND companies.owner_user_id = auth.uid()
    )
  );

-- ── Storage bucket ────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('studio-assets', 'studio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Allow upload for owners and admins
CREATE POLICY "studio_assets_upload" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'studio-assets'
    AND (
      is_admin()
      OR auth.uid() IS NOT NULL
    )
  );

CREATE POLICY "studio_assets_read" ON storage.objects
  FOR SELECT USING (bucket_id = 'studio-assets');

CREATE POLICY "studio_assets_delete" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'studio-assets'
    AND (
      is_admin()
      OR auth.uid() IS NOT NULL
    )
  );
