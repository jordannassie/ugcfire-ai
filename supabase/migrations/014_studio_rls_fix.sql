-- ============================================================
-- 014_studio_rls_fix.sql
-- Fix Studio RLS policies so admins can INSERT/UPDATE/DELETE
-- inside any client workspace, and clients can only access
-- their own company workspace.
--
-- Root cause: the previous combined "FOR ALL USING (is_admin() OR ...)"
-- policy uses a SECURITY DEFINER function that can silently return false
-- in some Supabase contexts, and does not have an explicit WITH CHECK
-- clause for INSERT operations.
--
-- Fix: split each table into two separate PERMISSIVE policies
-- (one for admin, one for client), each with explicit USING +
-- WITH CHECK, using the same inline subquery pattern that works
-- on every other table in the schema (migration 001).
--
-- Run this in Supabase SQL Editor.
-- ============================================================

-- ── Drop old combined policies ─────────────────────────────────────────────

DROP POLICY IF EXISTS "studio_folders_access"  ON public.studio_folders;
DROP POLICY IF EXISTS "studio_files_access"    ON public.studio_files;
DROP POLICY IF EXISTS "studio_comments_access" ON public.studio_comments;

-- Drop the is_admin() function (replaced by inline subqueries)
DROP FUNCTION IF EXISTS public.is_admin();

-- ── Drop old storage policies (recreate with correct logic) ────────────────

DROP POLICY IF EXISTS "studio_assets_upload" ON storage.objects;
DROP POLICY IF EXISTS "studio_assets_read"   ON storage.objects;
DROP POLICY IF EXISTS "studio_assets_delete" ON storage.objects;

-- ── studio_folders ─────────────────────────────────────────────────────────

-- Admin: full access to every company's folders
CREATE POLICY "studio_folders_admin_all" ON public.studio_folders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Client: own company only
CREATE POLICY "studio_folders_owner_all" ON public.studio_folders
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = studio_folders.company_id
        AND companies.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = studio_folders.company_id
        AND companies.owner_user_id = auth.uid()
    )
  );

-- ── studio_files ───────────────────────────────────────────────────────────

-- Admin: full access to every company's files
CREATE POLICY "studio_files_admin_all" ON public.studio_files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Client: own company only
CREATE POLICY "studio_files_owner_all" ON public.studio_files
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = studio_files.company_id
        AND companies.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = studio_files.company_id
        AND companies.owner_user_id = auth.uid()
    )
  );

-- ── studio_comments ────────────────────────────────────────────────────────

-- Admin: full access to every company's comments
CREATE POLICY "studio_comments_admin_all" ON public.studio_comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );

-- Client: own company only
CREATE POLICY "studio_comments_owner_all" ON public.studio_comments
  FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = studio_comments.company_id
        AND companies.owner_user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.companies
      WHERE companies.id = studio_comments.company_id
        AND companies.owner_user_id = auth.uid()
    )
  );

-- ── Storage: studio-assets bucket ──────────────────────────────────────────

-- Any authenticated user (admin or client) can upload to studio-assets
CREATE POLICY "studio_assets_upload" ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'studio-assets'
    AND auth.uid() IS NOT NULL
  );

-- Anyone can read studio-assets (bucket is public)
CREATE POLICY "studio_assets_read" ON storage.objects
  FOR SELECT
  USING (bucket_id = 'studio-assets');

-- Only authenticated users can delete from studio-assets
CREATE POLICY "studio_assets_delete" ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'studio-assets'
    AND auth.uid() IS NOT NULL
  );
