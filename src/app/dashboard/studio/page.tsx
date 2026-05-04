'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMyCompany } from '@/lib/data'
import StudioDrive from '@/components/studio/StudioDrive'

export default function ClientStudioPage() {
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [actorId,   setActorId]   = useState<string | null>(null)
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function init() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      setActorId(user?.id ?? null)
      const co = await getMyCompany()
      setCompanyId(co?.id ?? null)
      setLoading(false)
    }
    init()
  }, [])

  if (loading) return (
    <div className="space-y-4">
      <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
      <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
    </div>
  )

  if (!companyId || !actorId) return (
    <div className="py-12 text-center">
      <p className="text-white/35 text-sm">No brand profile found. Please set up your brand first.</p>
    </div>
  )

  return <StudioDrive companyId={companyId} actorId={actorId} actorRole="client" />
}
