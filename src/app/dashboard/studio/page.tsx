'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import StudioDrive from '@/components/studio/StudioDrive'

export default function ClientStudioPage() {
  const [userId, setUserId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUserId(user?.id ?? null)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-32 bg-white/5 rounded animate-pulse" />
        <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!userId) return null

  return <StudioDrive userId={userId} actorId={userId} />
}
