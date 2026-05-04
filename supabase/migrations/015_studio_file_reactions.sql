-- ============================================================
-- 015_studio_file_reactions.sql
-- Add optional client thumbs-up / thumbs-down reaction to files.
-- Run this in Supabase SQL Editor.
-- ============================================================

ALTER TABLE public.studio_files
  ADD COLUMN IF NOT EXISTS client_reaction     text        NULL
    CHECK (client_reaction IN ('liked', 'disliked')),
  ADD COLUMN IF NOT EXISTS client_reaction_by  uuid        NULL
    REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS client_reaction_at  timestamptz NULL;
