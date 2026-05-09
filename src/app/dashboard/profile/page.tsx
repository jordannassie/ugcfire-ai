'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { isDemoMode, DEMO_COMPANY } from '@/lib/demoData'
import { User, Building2, Mail, Globe, Camera, Check, Zap, ExternalLink } from 'lucide-react'
import type { CreatorSpecialty } from '@/lib/creatorNetwork'

const LIME   = '#a3e635'
const ORANGE = '#FF5C00'
const BG     = '#0d0d0d'
const BORDER = 'rgba(255,255,255,0.08)'

const ALL_SPECIALTIES: CreatorSpecialty[] = [
  'Beauty', 'Fitness', 'Ecommerce', 'Food & Beverage', 'Tech', 'Fashion', 'Lifestyle', 'Gaming', 'Pets', 'Local Business',
]

const inputCls = 'w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:border-[#FF3B1A] text-sm'

export default function ProfilePage() {
  const [fullName, setFullName]         = useState('')
  const [email, setEmail]               = useState('')
  const [companyName, setCompanyName]   = useState('')
  const [website, setWebsite]           = useState('')
  // Creator Network fields
  const [creatorUsername, setCreatorUsername] = useState('demo_creator')
  const [creatorBio,      setCreatorBio]      = useState('')
  const [specialties,     setSpecialties]     = useState<CreatorSpecialty[]>([])
  const [availableForWork, setAvailableForWork] = useState(false)
  const [creatorSaved,    setCreatorSaved]    = useState(false)
  const [avatarUrl, setAvatarUrl]       = useState<string | null>(null)
  const [avatarUploading, setAvatarUploading] = useState(false)
  const [saving, setSaving]             = useState(false)
  const [saved, setSaved]               = useState(false)
  const [userId, setUserId]             = useState<string | null>(null)
  const [companyId, setCompanyId]       = useState<string | null>(null)
  const avatarRef = useRef<HTMLInputElement>(null)

  async function ensureCompanyExists(params: {
    supabase: ReturnType<typeof createClient>
    ownerId: string
    desiredName: string
    desiredWebsite: string
  }) {
    const { supabase, ownerId, desiredName, desiredWebsite } = params
    const existing = await supabase
      .from('companies')
      .select('id, name, website')
      .eq('owner_user_id', ownerId)
      .order('created_at', { ascending: false })
      .limit(1)

    if (existing.data?.[0]?.id) return existing.data[0].id

    const inserted = await supabase
      .from('companies')
      .insert({
        owner_user_id: ownerId,
        name: desiredName || 'My Brand',
        website: desiredWebsite || null,
        onboarding_status: 'needs_plan',
      })
      .select('id')
      .single()

    return inserted.data?.id ?? null
  }

  useEffect(() => {
    if (isDemoMode()) {
      setFullName('Demo User')
      setEmail('demo@ugcfire.com')
      setCompanyName(DEMO_COMPANY.name)
      setWebsite('https://demobrand.com')
      return
    }
    async function load() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      setUserId(user.id)
      setEmail(user.email ?? '')

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle()
      if (profile) {
        setFullName(profile.full_name ?? '')
        setAvatarUrl(profile.avatar_url ?? null)
      }

      const { data: companies } = await supabase
        .from('companies')
        .select('*')
        .eq('owner_user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1)
      const co = companies?.[0]
      if (co) {
        setCompanyId(co.id)
        setCompanyName(co.name ?? '')
        setWebsite(co.website ?? '')
      } else {
        const fallbackName = profile?.full_name ? `${profile.full_name}'s Brand` : 'My Brand'
        const createdCompanyId = await ensureCompanyExists({
          supabase,
          ownerId: user.id,
          desiredName: fallbackName,
          desiredWebsite: '',
        })
        if (createdCompanyId) {
          setCompanyId(createdCompanyId)
          setCompanyName(fallbackName)
        }
      }
    }
    load()
    const handleSync = () => setTimeout(load, 500)
    window.addEventListener('dashboard-sync', handleSync)
    return () => window.removeEventListener('dashboard-sync', handleSync)
  }, [])

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file || !userId) return
    setAvatarUploading(true)
    const supabase = createClient()

    try {
      const ext = file.name.split('.').pop()
      const path = `avatars/${userId}/avatar-${Date.now()}.${ext}`
      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', path)

      const res = await fetch('/api/upload-avatar', {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error('Upload failed')

      const { success, publicUrl, error: apiErr } = await res.json()
      if (!success) throw new Error(apiErr || 'Upload unsuccessful')

      await supabase.from('profiles').update({
        full_name: fullName || null,
        avatar_url: publicUrl,
      }).eq('id', userId)

      setAvatarUrl(publicUrl)
      window.dispatchEvent(new Event('dashboard-sync'))
    } catch (err) {
      console.error('[profile] Avatar upload failed:', err)
    } finally {
      setAvatarUploading(false)
      e.target.value = ''
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    if (isDemoMode()) { setSaved(true); setTimeout(() => setSaved(false), 2000); return }
    setSaving(true)
    const supabase = createClient()
    if (userId) {
      await supabase.from('profiles').update({
        full_name: fullName || null,
        avatar_url: avatarUrl,
      }).eq('id', userId)

      const ensuredCompanyId = await ensureCompanyExists({
        supabase,
        ownerId: userId,
        desiredName: companyName || `${fullName || 'My'} Brand`,
        desiredWebsite: website,
      })

      if (ensuredCompanyId) {
        setCompanyId(ensuredCompanyId)
        const updatedName = companyName || `${fullName || 'My'} Brand`
        const updatedWebsite = website || null

        // Update company
        await supabase.from('companies').update({
          name: updatedName,
          website: updatedWebsite,
        }).eq('id', ensuredCompanyId)

        // Sync to brand_briefs
        await supabase.from('brand_briefs').update({
          company_name: updatedName,
          website: updatedWebsite,
        }).eq('company_id', ensuredCompanyId)
      }
    }
    setSaving(false)
    setSaved(true)
    window.dispatchEvent(new Event('dashboard-sync'))
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <div className="max-w-xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Profile</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account and brand details.</p>
      </div>

      {/* Avatar */}
      <div className="bg-[#111] border border-white/10 rounded-2xl p-6 flex items-center gap-5">
        <div className="relative">
          <div
            onClick={() => avatarRef.current?.click()}
            className="w-20 h-20 rounded-full border-2 border-white/10 overflow-hidden flex items-center justify-center cursor-pointer hover:border-[#FF3B1A]/50 transition relative"
            style={!avatarUrl ? { background: 'linear-gradient(135deg, #2563EB 0%, #38BDF8 100%)' } : {}}
          >
            {avatarUrl
              // eslint-disable-next-line @next/next/no-img-element
              ? <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
              : <User size={32} className="text-white drop-shadow" />
            }
          </div>
          <div
            onClick={() => avatarRef.current?.click()}
            className="absolute bottom-0 right-0 w-6 h-6 bg-[#FF3B1A] rounded-full flex items-center justify-center cursor-pointer shadow"
          >
            {avatarUploading
              ? <span className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin" />
              : <Camera size={11} className="text-white" />}
          </div>
          <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
        </div>
        <div>
          <p className="text-white font-semibold">{fullName || 'Your Name'}</p>
          <p className="text-white/40 text-sm">{email}</p>
          <button onClick={() => avatarRef.current?.click()} className="text-[#FF3B1A] text-xs mt-1 hover:underline">
            Change photo
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSave} className="bg-[#111] border border-white/10 rounded-2xl p-6 space-y-5">
        <p className="text-white font-semibold text-sm">Account Details</p>

        <div>
          <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1.5"><User size={11} /> Full Name</label>
          <input className={inputCls} value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" />
        </div>

        <div>
          <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1.5"><Mail size={11} /> Email</label>
          <input className={inputCls + ' opacity-50 cursor-not-allowed'} value={email} readOnly />
          <p className="text-white/25 text-xs mt-1">Email cannot be changed here.</p>
        </div>

        <div className="border-t border-white/8 pt-5">
          <p className="text-white font-semibold text-sm mb-4">Brand Details</p>

          <div className="space-y-4">
            <div>
              <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1.5"><Building2 size={11} /> Brand Name</label>
              <input className={inputCls} value={companyName} onChange={e => setCompanyName(e.target.value)} placeholder="Your brand or company name" />
            </div>
            <div>
              <label className="text-white/50 text-xs mb-1.5 flex items-center gap-1.5"><Globe size={11} /> Website</label>
              <input className={inputCls} value={website} onChange={e => setWebsite(e.target.value)} placeholder="https://yourbrand.com" />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className={`w-full font-bold py-3 rounded-lg text-sm transition flex items-center justify-center gap-2 ${
            saved ? 'bg-green-500/20 text-green-300 border border-green-500/30' : 'bg-[#FF3B1A] text-white hover:bg-[#e02e10] disabled:opacity-50'
          }`}
        >
          {saved ? <><Check size={15} /> Saved</> : saving ? 'Saving...' : 'Save Changes'}
        </button>
      </form>

      {/* ── Creator Network Section ─────────────────────────────────────── */}
      <div style={{ marginTop: 24, background: '#141414', border: `1px solid ${BORDER}`, borderRadius: 18, overflow: 'hidden' }}>
        {/* Header */}
        <div style={{ padding: '18px 22px 14px', borderBottom: `1px solid ${BORDER}`, background: 'linear-gradient(135deg, rgba(163,230,53,0.05) 0%, transparent 100%)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 32, height: 32, borderRadius: 10, background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={15} color={LIME} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 1 }}>Creator Network</p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)' }}>Build your public portfolio and get discovered by brands.</p>
            </div>
          </div>
        </div>

        <div style={{ padding: 22, display: 'flex', flexDirection: 'column', gap: 18 }}>

          {/* Available for Work toggle — prominent */}
          <div style={{ background: availableForWork ? 'rgba(163,230,53,0.07)' : '#1a1a1a', border: `1px solid ${availableForWork ? 'rgba(163,230,53,0.3)' : BORDER}`, borderRadius: 14, padding: '16px 18px', display: 'flex', alignItems: 'center', gap: 14, cursor: 'pointer', transition: 'all 0.15s' }}
            onClick={() => setAvailableForWork(a => !a)}>
            {/* Toggle pill */}
            <div style={{ width: 44, height: 24, borderRadius: 12, background: availableForWork ? LIME : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.15s' }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: availableForWork ? 23 : 3, transition: 'left 0.15s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)' }} />
            </div>
            <div>
              <p style={{ fontSize: 14, fontWeight: 700, color: availableForWork ? LIME : '#fff', marginBottom: 2 }}>
                {availableForWork ? '✦ Available for Work' : 'Available for Work'}
              </p>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.5 }}>
                Let UGCFire contact me for paid agency opportunities.
              </p>
            </div>
          </div>

          {/* Username */}
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Creator Username</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
              <span style={{ padding: '10px 12px', fontSize: 13, color: 'rgba(255,255,255,0.3)', borderRight: `1px solid ${BORDER}`, flexShrink: 0 }}>ugcfire.ai/creators/</span>
              <input
                value={creatorUsername}
                onChange={e => setCreatorUsername(e.target.value.replace(/[^a-z0-9_]/g, ''))}
                placeholder="your_username"
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', padding: '10px 12px', color: '#fff', fontSize: 13, fontFamily: 'inherit' }}
              />
            </div>
          </div>

          {/* Bio */}
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 6, fontWeight: 600 }}>Creator Bio</label>
            <textarea
              value={creatorBio}
              onChange={e => setCreatorBio(e.target.value)}
              placeholder="I create UGC-style ads for DTC brands using AI. Specialising in beauty, skincare, and lifestyle content."
              rows={3}
              style={{ width: '100%', background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, padding: '10px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Specialties */}
          <div>
            <label style={{ fontSize: 12, color: 'rgba(255,255,255,0.5)', display: 'block', marginBottom: 10, fontWeight: 600 }}>Specialties <span style={{ color: 'rgba(255,255,255,0.25)' }}>(pick up to 4)</span></label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {ALL_SPECIALTIES.map(s => {
                const active = specialties.includes(s)
                return (
                  <button key={s} type="button"
                    onClick={() => setSpecialties(prev => active ? prev.filter(x => x !== s) : prev.length < 4 ? [...prev, s] : prev)}
                    style={{ padding: '5px 13px', borderRadius: 20, border: `1px solid ${active ? LIME : BORDER}`, background: active ? 'rgba(163,230,53,0.12)' : 'transparent', color: active ? LIME : 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.12s' }}>
                    {s}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Portfolio preview link */}
          <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', marginBottom: 2 }}>Public portfolio URL</p>
              <p style={{ fontSize: 13, fontWeight: 600, color: LIME }}>ugcfire.ai/creators/{creatorUsername || 'your_username'}</p>
            </div>
            <Link href={`/creators/${creatorUsername || 'sophiaai'}`} target="_blank"
              style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'rgba(255,255,255,0.45)', textDecoration: 'none', padding: '6px 12px', border: `1px solid ${BORDER}`, borderRadius: 8 }}>
              <ExternalLink size={12} />
              Preview
            </Link>
          </div>

          {/* Save creator profile */}
          <button
            type="button"
            onClick={() => { setCreatorSaved(true); setTimeout(() => setCreatorSaved(false), 2500); }}
            style={{ width: '100%', background: creatorSaved ? 'rgba(163,230,53,0.15)' : LIME, color: creatorSaved ? LIME : '#0d0d0d', border: creatorSaved ? `1px solid rgba(163,230,53,0.3)` : 'none', borderRadius: 10, padding: '12px', fontSize: 14, fontWeight: 700, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.15s' }}>
            {creatorSaved ? <><Check size={15} /> Creator Profile Saved</> : 'Save Creator Profile'}
          </button>
        </div>
      </div>
    </div>
  )
}
