-- ============================================================
-- 013_studio_drive.sql
-- Studio Drive: folders + files for the Google Drive-style workspace
-- Run this in the Supabase SQL Editor
-- ============================================================

-- ── Tables ───────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS studio_folders (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  parent_folder_id uuid        REFERENCES studio_folders(id) ON DELETE CASCADE,
  name             text        NOT NULL,
  created_by       uuid        REFERENCES auth.users ON DELETE SET NULL,
  created_at       timestamptz DEFAULT now(),
  updated_at       timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS studio_files (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid        NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  folder_id    uuid        REFERENCES studio_folders(id) ON DELETE SET NULL,
  name         text        NOT NULL,
  file_url     text        NOT NULL,
  file_path    text,
  file_type    text,
  file_size    bigint,
  uploaded_by  uuid        REFERENCES auth.users ON DELETE SET NULL,
  created_at   timestamptz DEFAULT now(),
  updated_at   timestamptz DEFAULT now()
);

-- ── Indexes ───────────────────────────────────────────────────────────────────

CREATE INDEX IF NOT EXISTS idx_studio_folders_user_id          ON studio_folders(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_folders_parent_folder_id ON studio_folders(parent_folder_id);
CREATE INDEX IF NOT EXISTS idx_studio_files_user_id            ON studio_files(user_id);
CREATE INDEX IF NOT EXISTS idx_studio_files_folder_id          ON studio_files(folder_id);

-- ── Row Level Security ────────────────────────────────────────────────────────

ALTER TABLE studio_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE studio_files   ENABLE ROW LEVEL SECURITY;

-- Studio Folders: users see/manage their own; admins (profiles.role = 'admin') see all
CREATE POLICY "Users manage own studio_folders" ON studio_folders
  FOR ALL USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Studio Files: users see/manage their own; admins see all
CREATE POLICY "Users manage own studio_files" ON studio_files
  FOR ALL USING (
    auth.uid() = user_id
    OR EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- ── Storage bucket ────────────────────────────────────────────────────────────

INSERT INTO storage.buckets (id, name, public)
VALUES ('studio-assets', 'studio-assets', true)
ON CONFLICT (id) DO NOTHING;

-- Storage: users upload to their own path; admins can upload anywhere
CREATE POLICY "Users upload studio assets" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'studio-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );

CREATE POLICY "Public read studio assets" ON storage.objects
  FOR SELECT USING (bucket_id = 'studio-assets');

CREATE POLICY "Users delete own studio assets" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'studio-assets'
    AND (
      auth.uid()::text = (storage.foldername(name))[1]
      OR EXISTS (
        SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
      )
    )
  );
