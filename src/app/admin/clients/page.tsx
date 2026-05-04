'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { createClient } from '@/lib/supabase/client'
import { FolderOpen } from 'lucide-react'

interface ClientRow {
  id: string
  name: string
  owner_name: string
  owner_email: string
  plan_name: string
  billing_status: string
  last_activity: string | null
  avatar_url?: string | null
}

function humanBilling(raw: string): { label: string; css: string } {
  const map: Record<string, { label: string; css: string }> = {
    active:        { label: 'Active',     css: 'bg-green-500/20 text-green-300' },
    active_mock:   { label: 'Active',     css: 'bg-green-500/20 text-green-300' },
    trial:         { label: 'Trial',      css: 'bg-blue-500/20 text-blue-300' },
    past_due:      { label: 'Past Due',   css: 'bg-orange-500/20 text-orange-300' },
    past_due_mock: { label: 'Past Due',   css: 'bg-orange-500/20 text-orange-300' },
    canceled:      { label: 'Canceled',   css: 'bg-gray-500/20 text-gray-400' },
    canceled_mock: { label: 'Canceled',   css: 'bg-gray-500/20 text-gray-400' },
    inactive:      { label: 'No Billing', css: 'bg-white/8 text-white/35' },
  }
  return map[raw] ?? { label: raw ?? 'None', css: 'bg-white/8 text-white/35' }
}

function CompanyAvatar({ name, avatarUrl }: { name: string; avatarUrl?: string | null }) {
  const initial = name?.[0]?.toUpperCase() ?? '?'
  if (avatarUrl) {
    return (
      <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border border-white/10">
        <Image src={avatarUrl} alt={name} width={32} height={32} className="object-cover w-full h-full" unoptimized />
      </div>
    )
  }
  return (
    <div
      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center border border-white/10 text-white text-xs font-bold drop-shadow"
      style={{ background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)' }}
    >
      {initial}
    </div>
  )
}

export default function AdminClientsPage() {
  const router = useRouter()
  const [clients, setClients] = useState<ClientRow[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { loadClients() }, [])

  async function loadClients() {
    setLoading(true)
    const supabase = createClient()
    const { data: companies } = await supabase
      .from('companies')
      .select('id, name, owner_user_id, plan_id, billing_status')
      .order('created_at', { ascending: false })

    if (!companies) { setClients([]); setLoading(false); return }

    const rows: ClientRow[] = await Promise.all(
      companies.map(async (company) => {
        const [{ data: profile }, { data: plan }, { data: lastLog }, { data: brief }] = await Promise.all([
          company.owner_user_id
            ? supabase.from('profiles').select('email, full_name, avatar_url').eq('id', company.owner_user_id).maybeSingle()
            : Promise.resolve({ data: null }),
          company.plan_id
            ? supabase.from('plans').select('name').eq('id', company.plan_id).maybeSingle()
            : Promise.resolve({ data: null }),
          supabase.from('activity_logs').select('created_at').eq('company_id', company.id)
            .order('created_at', { ascending: false }).limit(1).maybeSingle(),
          supabase.from('brand_briefs').select('notes').eq('company_id', company.id).maybeSingle(),
        ])

        const ownerProfile = profile as { email?: string; full_name?: string | null; avatar_url?: string | null } | null
        let brandLogoUrl = null
        if (brief?.notes) {
          try { const n = JSON.parse(brief.notes as string); brandLogoUrl = n.logo_url } catch {}
        }

        return {
          id:             company.id,
          name:           company.name,
          owner_name:     ownerProfile?.full_name || 'No name saved',
          owner_email:    ownerProfile?.email ?? 'No email',
          plan_name:      (plan as { name?: string } | null)?.name ?? 'No Plan',
          billing_status: company.billing_status ?? 'inactive',
          last_activity:  lastLog?.created_at ?? null,
          avatar_url:     brandLogoUrl || ownerProfile?.avatar_url || null,
        }
      })
    )

    setClients(rows)
    setLoading(false)
  }

  const filtered = clients.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.owner_name.toLowerCase().includes(search.toLowerCase()) ||
    c.owner_email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients</h1>
          <p className="text-white/40 text-sm mt-1">{clients.length} total companies</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={loadClients} className="border border-white/10 text-white/60 px-4 py-3 rounded-lg hover:border-[#FF3B1A] hover:text-white transition text-sm">
            Refresh
          </button>
          <input
            type="text"
            placeholder="Search company, owner, or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF3B1A] focus:outline-none w-72"
          />
        </div>
      </div>

      <div className="bg-[#111] border border-white/10 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-white/40 text-sm">Loading clients...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr>
                  <th className="text-white/40 text-xs uppercase font-semibold pb-3 border-b border-white/5 text-left px-6 pt-5">Company</th>
                  <th className="text-white/40 text-xs uppercase font-semibold pb-3 border-b border-white/5 text-left px-4 pt-5">Owner</th>
                  <th className="text-white/40 text-xs uppercase font-semibold pb-3 border-b border-white/5 text-left px-4 pt-5">Plan</th>
                  <th className="text-white/40 text-xs uppercase font-semibold pb-3 border-b border-white/5 text-left px-4 pt-5">Billing</th>
                  <th className="text-white/40 text-xs uppercase font-semibold pb-3 border-b border-white/5 text-left px-4 pt-5">Last Activity</th>
                  <th className="text-white/40 text-xs uppercase font-semibold pb-3 border-b border-white/5 text-left px-6 pt-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={6} className="py-8 text-center text-white/30">No clients found</td></tr>
                )}
                {filtered.map(client => {
                  const billing = humanBilling(client.billing_status)
                  return (
                    <tr key={client.id} className="hover:bg-white/[0.02]">
                      <td className="py-3 border-b border-white/5 px-6">
                        <div className="flex items-center gap-2.5">
                          <CompanyAvatar name={client.name} avatarUrl={client.avatar_url} />
                          <span className="text-white font-medium">{client.name}</span>
                        </div>
                      </td>
                      <td className="py-3 border-b border-white/5 px-4">
                        <p className="text-white/80 text-sm truncate">{client.owner_name}</p>
                        <p className="text-white/40 text-xs truncate">{client.owner_email}</p>
                      </td>
                      <td className="py-3 border-b border-white/5 px-4">
                        <span className="text-white/70 text-sm">{client.plan_name}</span>
                      </td>
                      <td className="py-3 border-b border-white/5 px-4">
                        <span className={`text-xs px-2 py-1 rounded-full ${billing.css}`}>{billing.label}</span>
                      </td>
                      <td className="py-3 border-b border-white/5 text-white/40 px-4 text-xs whitespace-nowrap">
                        {client.last_activity ? new Date(client.last_activity).toLocaleDateString() : '—'}
                      </td>
                      <td className="py-3 border-b border-white/5 px-6">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => router.push(`/admin/clients/${client.id}/studio`)}
                            className="flex items-center gap-1.5 bg-[#FF3B1A] hover:bg-[#e02e10] text-white px-3 py-2 rounded-lg transition text-xs font-semibold"
                          >
                            <FolderOpen size={13} /> Studio Drive
                          </button>
                          <button
                            onClick={() => router.push(`/admin/clients/${client.id}`)}
                            className="border border-white/10 text-white/60 px-3 py-2 rounded-lg hover:border-white/30 hover:text-white transition text-xs"
                          >
                            Profile
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
