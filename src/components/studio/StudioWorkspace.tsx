'use client'

/**
 * StudioWorkspace — compatibility wrapper
 *
 * Exports the legacy types (FireCreatorProfile, Role, StudioWorkspaceProps) so
 * existing admin pages continue to compile, while internally delegating all
 * rendering to the new StudioDrive component.
 */

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMyCompany } from '@/lib/data'
import { isDemoMode as checkDemoMode, DEMO_COMPANIES } from '@/lib/demoData'
import StudioDrive from '@/components/studio/StudioDrive'

// ─── Exported types (kept for backward compat) ────────────────────────────────

export interface FireCreatorProfile {
  displayName: string
  title: string
  bio?: string
  avatarUrl?: string
}

export type Role = 'client' | 'admin'

export interface StudioWorkspaceProps {
  role: Role
  companyId?: string
  initialClientId?: string
  fireCreatorProfile?: FireCreatorProfile
  demoMode?: boolean
  initialView?: string
  initialPanel?: string
  initialMode?: string
}

// ─── Wrapper component ────────────────────────────────────────────────────────

export default function StudioWorkspace({
  role,
  companyId: propCompanyId,
  initialClientId,
  fireCreatorProfile,
}: StudioWorkspaceProps) {
  const [companyId, setCompanyId] = useState<string | null>(propCompanyId ?? initialClientId ?? null)
  const [actorId,   setActorId]   = useState<string | null>(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function init() {
      // Admin: companyId comes from props
      if (role === 'admin' && (propCompanyId ?? initialClientId)) {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        setActorId(user?.id ?? null)
        setCompanyId(propCompanyId ?? initialClientId ?? null)
        setLoading(false)
        return
      }

      // Client: resolve company from auth
      if (checkDemoMode()) {
        const demo = DEMO_COMPANIES[0]
        setCompanyId(demo?.id ?? null)
        setActorId(demo?.id ?? null)
        setLoading(false)
        return
      }

      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setActorId(user?.id ?? null)
      const co = await getMyCompany()
      setCompanyId(co?.id ?? null)
      setLoading(false)
    }
    init()
  }, [role, propCompanyId, initialClientId])

  if (loading) return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
      {[...Array(6)].map((_, i) => <div key={i} className="h-20 bg-white/4 rounded-xl animate-pulse" />)}
    </div>
  )

  if (!companyId || !actorId) return (
    <p className="text-white/30 text-sm py-8 text-center">Unable to load Studio workspace.</p>
  )

  return (
    <StudioDrive
      companyId={companyId}
      actorId={actorId}
      actorRole={role}
      fireCreatorProfile={fireCreatorProfile}
    />
  )
}
