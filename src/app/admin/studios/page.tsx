'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode, DEMO_COMPANIES } from '@/lib/demoData'
import { FolderOpen, Search, Users } from 'lucide-react'

interface Client {
  id: string
  name: string
  website: string | null
  owner_user_id: string
}

export default function AdminStudiosPage() {
  const router = useRouter()
  const [clients, setClients] = useState<Client[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    if (isDemoMode()) {
      setClients(DEMO_COMPANIES.map(c => ({ id: c.id, name: c.name, website: null, owner_user_id: c.id })))
      setLoading(false)
      return
    }
    const supabase = createClient()
    supabase.from('companies').select('id, name, website, owner_user_id').order('name').then(({ data }) => {
      setClients((data ?? []) as Client[])
      setLoading(false)
    })
  }, [])

  const filtered = clients.filter(c =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || (c.website ?? '').toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Client Studios</h1>
        <p className="text-white/40 text-sm mt-1">Select a client to open and manage their Studio workspace.</p>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
        <input
          className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2.5 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF3B1A]"
          placeholder="Search clients…"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {loading && (
        <div className="space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-16 bg-white/4 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="flex flex-col items-center py-16 text-center space-y-3">
          <Users size={36} className="text-white/15" />
          <p className="text-white/40 text-sm">No clients found</p>
        </div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="space-y-2">
          {filtered.map(client => (
            <div
              key={client.id}
              className="flex items-center justify-between gap-4 bg-white/4 hover:bg-white/7 border border-white/8 hover:border-white/15 rounded-xl px-5 py-4 transition group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-[#FF3B1A]/15 border border-[#FF3B1A]/25 flex items-center justify-center shrink-0">
                  <span className="text-[#FF3B1A] text-sm font-bold">{client.name[0]?.toUpperCase()}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-white font-semibold text-sm truncate">{client.name}</p>
                  {client.website && <p className="text-white/35 text-xs truncate">{client.website}</p>}
                </div>
              </div>
              <button
                onClick={() => router.push(`/admin/clients/${client.id}/studio`)}
                className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] hover:bg-[#e02e10] text-white text-sm font-semibold rounded-lg transition shrink-0"
              >
                <FolderOpen size={14} /> Open Studio
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
