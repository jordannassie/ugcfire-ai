'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode, DEMO_COMPANIES } from '@/lib/demoData'
import { FolderOpen, ArrowRight, Users } from 'lucide-react'

interface ClientCard {
  id: string
  name: string
  owner_email: string
}

export default function AdminStudioPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientCard[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isDemoMode()) {
      setClients(DEMO_COMPANIES.map(c => ({
        id: c.id,
        name: c.name,
        owner_email: c.owner_email,
      })))
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase.from('companies').select('id, name').order('name').then(({ data }) => {
      if (data) setClients(data as ClientCard[])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-8 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Open Client Studio Drive</h1>
        <p className="text-white/40 text-sm mt-1">
          Choose a client workspace to manage as Fire Creator.
        </p>
      </div>

      {/* Context callout */}
      <div className="flex items-start gap-3 bg-[#FF3B1A]/8 border border-[#FF3B1A]/20 rounded-xl px-4 py-3">
        <FolderOpen size={15} className="text-[#FF3B1A] mt-0.5 shrink-0" />
        <p className="text-white/70 text-sm leading-relaxed">
          When you open a client Studio Drive, you enter their workspace as{' '}
          <span className="text-white font-semibold">Fire Creator</span>. You can upload files, manage folders,
          change statuses, leave comments, and review content — exactly as the client sees it.
        </p>
      </div>

      {/* Client cards */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-28 bg-white/5 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {clients.map(client => (
              <div key={client.id} className="bg-[#111] border border-white/8 rounded-xl p-5 flex flex-col gap-3 hover:border-white/18 transition">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#FF3B1A]/15 flex items-center justify-center shrink-0">
                  <Users size={16} className="text-[#FF3B1A]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold text-sm">{client.name}</p>
                  {client.owner_email && (
                    <p className="text-white/35 text-xs mt-0.5 truncate">{client.owner_email}</p>
                  )}
                </div>
              </div>
              <button
                onClick={() => router.push(`/admin/clients/${client.id}/studio`)}
                className="w-full flex items-center justify-center gap-2 bg-[#FF3B1A] hover:bg-[#e02e10] text-white text-sm font-semibold py-2.5 rounded-lg transition"
              >
                <FolderOpen size={14} /> Open Studio Drive <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Quick access link */}
      <p className="text-white/25 text-xs">
        You can also open a Studio Drive from the{' '}
        <button onClick={() => router.push('/admin/clients')} className="text-white/50 hover:text-white underline transition">
          Clients page
        </button>.
      </p>
    </div>
  )
}
