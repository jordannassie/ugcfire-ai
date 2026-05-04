'use client'

import { use, useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode, DEMO_COMPANIES } from '@/lib/demoData'
import StudioDrive from '@/components/studio/StudioDrive'
import { ArrowLeft, ChevronDown } from 'lucide-react'

function ClientStudioDrive({ clientId }: { clientId: string }) {
  const router = useRouter()
  const [adminId, setAdminId]     = useState<string | null>(null)
  const [clientName, setClientName] = useState('')
  const [allClients, setAllClients] = useState<{ id: string; name: string }[]>([])
  const [switchOpen, setSwitchOpen] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => setAdminId(user?.id ?? null))

    const isDemo = isDemoMode()
    if (isDemo) {
      const match = DEMO_COMPANIES.find(c => c.id === clientId)
      setClientName(match?.name ?? 'Client')
      setAllClients(DEMO_COMPANIES.map(c => ({ id: c.id, name: c.name })))
      return
    }
    supabase.from('companies').select('id, name').order('name').then(({ data }) => {
      if (data) {
        setAllClients(data as { id: string; name: string }[])
        const match = (data as { id: string; name: string }[]).find(c => c.id === clientId)
        if (match) setClientName(match.name)
      }
    })
  }, [clientId])

  return (
    <div>
      {/* Admin context bar */}
      <div className="flex flex-wrap items-center gap-3 bg-[#FF3B1A]/8 border border-[#FF3B1A]/20 rounded-xl px-4 py-3 mb-5">
        <span className="text-[#FF3B1A] text-xs font-bold uppercase tracking-wide">Admin Mode</span>
        <span className="text-white/25 text-xs hidden sm:block">·</span>
        <span className="text-white/60 text-sm">
          Managing <span className="text-white font-semibold">{clientName || '...'}</span>&apos;s Studio
        </span>
        <div className="flex-1" />
        {allClients.length > 1 && (
          <div className="relative">
            <button
              onClick={() => setSwitchOpen(p => !p)}
              className="flex items-center gap-1.5 bg-white/8 hover:bg-white/12 text-white/60 hover:text-white text-xs px-3 py-1.5 rounded-lg transition"
            >
              Switch Client <ChevronDown size={11} />
            </button>
            {switchOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSwitchOpen(false)} />
                <div className="absolute right-0 top-full mt-1 bg-[#1a1a1a] border border-white/12 rounded-xl shadow-2xl py-1.5 min-w-[180px] z-50">
                  {allClients.map(c => (
                    <button
                      key={c.id}
                      onClick={() => { setSwitchOpen(false); router.push(`/admin/clients/${c.id}/studio`) }}
                      className={`w-full text-left px-4 py-2 text-sm transition ${c.id === clientId ? 'text-white bg-[#FF3B1A]/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
        <button
          onClick={() => router.push('/admin/studios')}
          className="flex items-center gap-1.5 bg-white/5 hover:bg-white/8 text-white/50 hover:text-white text-xs px-3 py-1.5 rounded-lg transition"
        >
          <ArrowLeft size={11} /> All Studios
        </button>
      </div>

      {adminId && (
        <StudioDrive
          userId={clientId}
          actorId={adminId}
          isAdmin
        />
      )}
    </div>
  )
}

export default function AdminClientStudioPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-white">Client Studio</h1>
        <p className="text-white/40 text-sm mt-1">Manage content for this client&apos;s workspace.</p>
      </div>
      <Suspense>
        <ClientStudioDrive clientId={id} />
      </Suspense>
    </div>
  )
}
