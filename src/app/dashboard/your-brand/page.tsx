'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMyCompany } from '@/lib/data'
import { isDemoMode, DEMO_COMPANY, DEMO_BRAND_BRIEF } from '@/lib/demoData'
import type { Company } from '@/lib/types'
import { Check, CheckCircle, Upload, X } from 'lucide-react'

const ic = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF3B1A] focus:outline-none placeholder:text-white/25'
const tc = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white text-sm focus:border-[#FF3B1A] focus:outline-none resize-none placeholder:text-white/25'

export default function YourBrandPage() {
  const [company, setCompany]     = useState<Company | null>(null)
  const [loading, setLoading]     = useState(true)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [userId, setUserId]       = useState<string | null>(null)
  const [companyId, setCompanyId] = useState<string | null>(null)
  const [logoUploading, setLogoUploading] = useState(false)
  const logoInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState({
    company_name: '',
    website:      '',
    offer:        '',
    target_customer: '',
    brand_notes:  '',
    logo_url:     '',
  })

  const load = useCallback(async () => {
    if (isDemoMode()) {
      setCompany(DEMO_COMPANY as unknown as Company)
      const b = DEMO_BRAND_BRIEF as unknown as Record<string, unknown>
      setForm({
        company_name:    String(b.company_name ?? ''),
        website:         String(b.website ?? ''),
        offer:           String(b.offer ?? ''),
        target_customer: String(b.target_customer ?? ''),
        brand_notes:     '',
        logo_url:        '',
      })
      setLoading(false)
      return
    }

    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (user) setUserId(user.id)

    let co = await getMyCompany()
    if (!co && user) {
      const { data: created } = await supabase
        .from('companies')
        .insert({ owner_user_id: user.id, name: 'My Brand', onboarding_status: 'needs_plan' })
        .select('id, name, website').single()
      if (created) co = { id: created.id, name: created.name ?? 'My Brand', website: created.website ?? null } as Company
    }

    setCompany(co)
    if (!co) { setLoading(false); return }
    setCompanyId(co.id)

    const { data: brief } = await supabase
      .from('brand_briefs').select('*').eq('company_id', co.id).maybeSingle()

    if (brief) {
      let notes: Record<string, unknown> = {}
      try { notes = JSON.parse(brief.notes as string) } catch {}
      setForm({
        company_name:    brief.company_name ?? co.name ?? '',
        website:         brief.website ?? co.website ?? '',
        offer:           brief.offer ?? '',
        target_customer: brief.target_customer ?? '',
        brand_notes:     (notes.additional_brand_notes as string) ?? (brief.brand_voice ?? ''),
        logo_url:        (notes.logo_url as string) ?? '',
      })
    } else {
      setForm(f => ({ ...f, company_name: co!.name ?? '', website: co!.website ?? '' }))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
    const handleSync = () => setTimeout(load, 300)
    window.addEventListener('dashboard-sync', handleSync)
    return () => window.removeEventListener('dashboard-sync', handleSync)
  }, [load])

  async function handleSave() {
    if (!companyId && !isDemoMode()) return
    setSaving(true)
    try {
      if (isDemoMode()) { setSaved(true); setTimeout(() => setSaved(false), 2500); return }
      const supabase = createClient()

      // Preserve existing notes, only update our fields
      const { data: existing } = await supabase
        .from('brand_briefs').select('notes').eq('company_id', companyId!).maybeSingle()
      let notes: Record<string, unknown> = {}
      try { notes = JSON.parse(existing?.notes as string) } catch {}
      notes.logo_url = form.logo_url
      notes.additional_brand_notes = form.brand_notes

      await supabase.from('brand_briefs').upsert({
        company_id:      companyId!,
        company_name:    form.company_name,
        website:         form.website || null,
        offer:           form.offer || null,
        target_customer: form.target_customer || null,
        brand_voice:     form.brand_notes || null,
        notes:           JSON.stringify(notes),
        completed_at:    new Date().toISOString(),
      }, { onConflict: 'company_id' })

      await supabase.from('companies')
        .update({ name: form.company_name || 'My Brand', website: form.website || null })
        .eq('id', companyId!)

      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
      window.dispatchEvent(new Event('dashboard-sync'))
    } finally {
      setSaving(false)
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setLogoUploading(true)
    try {
      const ext = file.name.split('.').pop()
      const path = `brands/${userId}/logo-${Date.now()}.${ext}`
      const fd = new FormData()
      fd.append('file', file)
      fd.append('path', path)
      const res = await fetch('/api/upload-avatar', { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Upload failed')
      const { success, publicUrl } = await res.json()
      if (success) setForm(f => ({ ...f, logo_url: publicUrl }))
    } finally {
      setLogoUploading(false)
      e.target.value = ''
    }
  }

  if (loading) return (
    <div className="max-w-2xl space-y-4">
      <div className="h-8 w-40 bg-white/5 rounded animate-pulse" />
      <div className="h-48 bg-white/5 rounded-xl animate-pulse" />
      <div className="h-64 bg-white/5 rounded-xl animate-pulse" />
    </div>
  )

  return (
    <div className="max-w-2xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-white">Your Brand</h1>
        <p className="text-white/40 text-sm mt-1">Manage your brand profile and key business details.</p>
      </div>

      {/* Brand Profile card */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-5">
        <p className="text-white font-semibold text-sm">Brand Profile</p>

        {/* Avatar */}
        <div className="flex items-center gap-4">
          <div
            onClick={() => logoInputRef.current?.click()}
            className="relative w-16 h-16 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#FF3B1A]/50 transition shrink-0"
            style={!form.logo_url ? { background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)' } : {}}
          >
            {form.logo_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={form.logo_url} alt="Brand" className="w-full h-full object-cover" />
            ) : (
              <span className="text-xl font-bold text-white">
                {form.company_name?.[0]?.toUpperCase() ?? company?.name?.[0]?.toUpperCase() ?? '?'}
              </span>
            )}
            {logoUploading && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            )}
          </div>
          <div className="min-w-0">
            <p className="text-white font-semibold text-sm">{form.company_name || 'Your Brand'}</p>
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={logoUploading || !userId}
              className="mt-1.5 flex items-center gap-1.5 text-xs text-white/35 hover:text-white/70 transition disabled:opacity-50"
            >
              <Upload size={11} /> Change Brand Image
            </button>
          </div>
          <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>

        <div>
          <label className="block text-white/40 text-xs mb-1.5">Brand Name</label>
          <input
            className={ic}
            value={form.company_name}
            onChange={e => setForm(f => ({ ...f, company_name: e.target.value }))}
            placeholder="Your brand or business name"
          />
        </div>
      </div>

      {/* Brand Details card */}
      <div className="bg-[#111] border border-white/10 rounded-xl p-5 space-y-4">
        <p className="text-white font-semibold text-sm">Brand Details</p>

        <div>
          <label className="block text-white/40 text-xs mb-1.5">Website</label>
          <input
            className={ic}
            value={form.website}
            onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
            placeholder="https://yourbrand.com"
          />
        </div>

        <div>
          <label className="block text-white/40 text-xs mb-1.5">What do you sell?</label>
          <textarea
            className={tc} rows={3}
            value={form.offer}
            onChange={e => setForm(f => ({ ...f, offer: e.target.value }))}
            placeholder="Describe your product or service"
          />
        </div>

        <div>
          <label className="block text-white/40 text-xs mb-1.5">Who is your customer?</label>
          <textarea
            className={tc} rows={3}
            value={form.target_customer}
            onChange={e => setForm(f => ({ ...f, target_customer: e.target.value }))}
            placeholder="Describe your target audience"
          />
        </div>

        <div>
          <label className="block text-white/40 text-xs mb-1.5">Brand Style / Notes</label>
          <textarea
            className={tc} rows={4}
            value={form.brand_notes}
            onChange={e => setForm(f => ({ ...f, brand_notes: e.target.value }))}
            placeholder="Brand voice, colors, tone, things to do or avoid, creative direction…"
          />
        </div>

        {/* Logo upload inline */}
        <div>
          <label className="block text-white/40 text-xs mb-1.5">Brand Image / Logo</label>
          {form.logo_url ? (
            <div className="flex items-center gap-3 p-3 bg-white/4 border border-white/8 rounded-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.logo_url} alt="Logo" className="w-10 h-10 object-cover rounded-lg shrink-0" />
              <p className="text-white/40 text-xs flex-1 truncate">{form.logo_url}</p>
              <button type="button" onClick={() => setForm(f => ({ ...f, logo_url: '' }))}>
                <X size={14} className="text-white/30 hover:text-white" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => logoInputRef.current?.click()}
              disabled={logoUploading || !userId}
              className="flex items-center gap-2 px-4 py-2.5 border border-dashed border-white/15 hover:border-[#FF3B1A]/50 text-white/40 hover:text-white rounded-lg text-sm transition disabled:opacity-50"
            >
              {logoUploading
                ? <span className="w-3.5 h-3.5 border border-white/30 border-t-white rounded-full animate-spin" />
                : <Upload size={14} />
              }
              {logoUploading ? 'Uploading…' : 'Upload brand image or logo'}
            </button>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className={`flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-lg transition ${
          saved
            ? 'bg-green-500/15 text-green-400 border border-green-500/25'
            : 'bg-[#FF3B1A] hover:bg-[#e02e10] text-white disabled:opacity-60'
        }`}
      >
        {saved ? <><Check size={14} /> Saved</> : saving ? 'Saving…' : <><CheckCircle size={14} /> Save Brand</>}
      </button>
    </div>
  )
}
