'use client'
import React, { useState } from 'react'
import { ChevronDown, Lock, Cpu, Clock, Maximize2, Monitor, Sparkles } from 'lucide-react'
import Image from 'next/image'

const PRODUCT_IMAGES = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/be7f70f4-139f-4cb1-bcaa-964d79dc6a9e.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/a9a7a9fd-e332-4750-bdd9-859ab5f45948.png',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/images/5e1cf241-a837-4b51-a46c-f0fb5d643f1f.png',
]

const UGC_VIDEOS = [
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugc-style-ve_2891981897.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-energetic-ugc-fitne_2891987468.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-casual-ugcstyle-tes_2892041483.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_make-ugc-video-with-this-_2892034073.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-cinematic-ugc-testi_2892073891.mp4',
  'https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/Brands/Home%20UGC/magnific_style-ugcstyle-vertical-s_2892334025.mp4',
]

const SETTING_ROWS = [
  { icon: Cpu,       label: 'Model',        key: 'model'       as const, options: ['Seedance 2.0', 'Seedance 1.0'] },
  { icon: Clock,     label: 'Duration',     key: 'duration'    as const, options: ['4s', '6s', '8s', '12s'] },
  { icon: Maximize2, label: 'Aspect Ratio', key: 'aspectRatio' as const, options: ['9:16', '16:9', '1:1'] },
  { icon: Monitor,   label: 'Resolution',   key: 'resolution'  as const, options: ['720p', '1080p'] },
]

const ORANGE = '#FF5C00'
const LIME   = '#a3e635'
const PANEL  = '#141414'
const BORDER = 'rgba(255,255,255,0.07)'

export default function VideoStudioPage() {
  const [activeTab,    setActiveTab]    = useState<'create' | 'edit' | 'motion'>('create')
  const [prompt,       setPrompt]       = useState('A young woman in a city at night holding a LED skincare device. Neon lights, cinematic bokeh, UGC style, natural look.')
  const [settings,     setSettings]     = useState({ model: 'Seedance 2.0', duration: '6s', aspectRatio: '9:16', resolution: '1080p' })
  const [openSetting,  setOpenSetting]  = useState<string | null>(null)
  const [selectedImg,  setSelectedImg]  = useState(0)
  const [generating,   setGenerating]   = useState(false)
  const [genDone,      setGenDone]      = useState(false)
  const [genVideoIdx,  setGenVideoIdx]  = useState(0)

  function setSetting(key: keyof typeof settings, value: string) {
    setSettings(s => ({ ...s, [key]: value }))
    setOpenSetting(null)
  }

  function handleGenerate() {
    setGenerating(true)
    setGenDone(false)
    const idx = Math.floor(Math.random() * UGC_VIDEOS.length)
    setGenVideoIdx(idx)
    setTimeout(() => {
      setGenerating(false)
      setGenDone(true)
    }, 3000)
  }

  return (
    <div style={{ display: 'flex', gap: 20, padding: '24px', minHeight: '100%', background: '#0d0d0d' }} onClick={() => setOpenSetting(null)}>

      {/* Left Panel */}
      <div style={{ width: 284, flexShrink: 0 }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: '#fff', marginBottom: 14, letterSpacing: '-0.02em' }}>Video Studio</h1>
        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16 }}>

          {/* Tabs */}
          <div style={{ display: 'flex', borderBottom: `1px solid ${BORDER}` }}>
            {(['Create Video', 'Edit Video', 'Motion Control'] as const).map((tab, i) => {
              const key = (['create', 'edit', 'motion'] as const)[i]
              return (
                <button key={tab} onClick={e => { e.stopPropagation(); setActiveTab(key) }}
                  style={{ flex: 1, padding: '11px 4px', fontSize: 11, fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', color: activeTab === key ? '#fff' : 'rgba(255,255,255,0.3)', borderBottom: activeTab === key ? `2px solid ${ORANGE}` : '2px solid transparent', transition: 'color 0.15s', fontFamily: 'inherit' }}>
                  {tab}
                </button>
              )
            })}
          </div>

          <div style={{ padding: 14 }}>
            {/* Reference Image */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)' }}>Reference Image</span>
              </div>
              <div style={{ display: 'flex', gap: 7, alignItems: 'center' }}>
                <div style={{ width: 50, height: 50, border: '1.5px dashed rgba(255,255,255,0.18)', borderRadius: 8, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: 'rgba(255,255,255,0.02)' }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                  </svg>
                  <span style={{ fontSize: 8, color: 'rgba(255,255,255,0.22)', marginTop: 3, textAlign: 'center', lineHeight: 1.3 }}>Upload</span>
                </div>
                {PRODUCT_IMAGES.map((src, i) => (
                  <div key={i} onClick={e => { e.stopPropagation(); setSelectedImg(i) }}
                    style={{ width: 50, height: 50, borderRadius: 8, overflow: 'hidden', cursor: 'pointer', border: selectedImg === i ? `2px solid ${ORANGE}` : '2px solid transparent', flexShrink: 0, position: 'relative' }}>
                    <Image src={src} alt="" fill style={{ objectFit: 'cover' }} unoptimized />
                  </div>
                ))}
              </div>
            </div>

            {/* Prompt */}
            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.65)', marginBottom: 8 }}>Prompt</div>
              <div style={{ background: '#1a1a1a', border: `1px solid ${BORDER}`, borderRadius: 10, overflow: 'hidden' }}>
                <textarea
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  maxLength={500}
                  rows={4}
                  onClick={e => e.stopPropagation()}
                  style={{ width: '100%', background: 'none', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.75)', fontSize: 12, lineHeight: 1.65, padding: '10px 12px', resize: 'none', fontFamily: 'inherit' }}
                />
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 10px 8px', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)' }}>{prompt.length}/500</span>
                  <button style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'none', border: 'none', cursor: 'pointer', color: ORANGE, fontSize: 11, fontWeight: 600, fontFamily: 'inherit' }}>
                    ✦ Enhance Prompt
                  </button>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 4, marginBottom: 14 }}>
              {SETTING_ROWS.map(row => (
                <div key={row.key} style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', alignItems: 'center', padding: '9px 0', cursor: 'pointer', gap: 8, borderBottom: '1px solid rgba(255,255,255,0.04)' }}
                    onClick={e => { e.stopPropagation(); setOpenSetting(openSetting === row.key ? null : row.key) }}>
                    <row.icon size={13} color="rgba(255,255,255,0.3)" strokeWidth={1.5} />
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', flex: 1 }}>{row.label}</span>
                    <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500 }}>{settings[row.key]}</span>
                    <ChevronDown size={13} color="rgba(255,255,255,0.3)" style={{ transform: openSetting === row.key ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.15s' }} />
                  </div>
                  {openSetting === row.key && (
                    <div style={{ position: 'absolute', right: 0, top: 'calc(100% + 4px)', background: '#1e1e1e', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 10, overflow: 'hidden', zIndex: 20, minWidth: 140, boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }} onClick={e => e.stopPropagation()}>
                      {row.options.map(opt => (
                        <div key={opt}
                          style={{ padding: '10px 14px', fontSize: 13, color: settings[row.key] === opt ? ORANGE : 'rgba(255,255,255,0.6)', cursor: 'pointer', fontFamily: 'inherit' }}
                          onMouseEnter={e => { if (settings[row.key] !== opt) (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.06)' }}
                          onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'transparent' }}
                          onClick={() => setSetting(row.key, opt)}>
                          {opt}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Generate */}
            <button
              onClick={e => { e.stopPropagation(); handleGenerate() }}
              disabled={generating}
              style={{ width: '100%', background: generating ? '#7aaa28' : LIME, color: '#0d0d0d', border: 'none', borderRadius: 10, padding: '13px', fontSize: 15, fontWeight: 700, cursor: generating ? 'default' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, fontFamily: 'inherit', marginBottom: 10, transition: 'background 0.15s' }}>
              {generating ? (
                <>
                  <Sparkles size={16} />
                  Generating…
                </>
              ) : '✦ Generate'}
            </button>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
              <Lock size={11} color="rgba(255,255,255,0.2)" style={{ marginTop: 1, flexShrink: 0 }} />
              <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.2)', lineHeight: 1.5 }}>
                Generation runs in demo mode. Connect AI in the next build step.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Preview Area */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.55)', letterSpacing: '-0.01em' }}>Output Preview</h2>
          {genDone && (
            <button style={{ background: 'rgba(163,230,53,0.12)', border: '1px solid rgba(163,230,53,0.3)', color: LIME, fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit' }}>
              ↓ Download
            </button>
          )}
        </div>

        <div style={{ background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 16, overflow: 'hidden', minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {generating ? (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: `${ORANGE}18`, border: `2px solid ${ORANGE}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', animation: 'spin 1.5s linear infinite' }}>
                <Sparkles size={24} color={ORANGE} />
              </div>
              <div style={{ fontSize: 16, fontWeight: 600, color: '#fff', marginBottom: 6 }}>Generating your video…</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.38)' }}>This takes a few seconds</div>
              <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
            </div>
          ) : genDone ? (
            <div style={{ width: '100%', display: 'flex', justifyContent: 'center', padding: 24 }}>
              <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', maxWidth: 320, width: '100%', boxShadow: '0 16px 64px rgba(0,0,0,0.5)' }}>
                <video src={UGC_VIDEOS[genVideoIdx]} autoPlay muted loop playsInline style={{ width: '100%', display: 'block' }} />
                <div style={{ position: 'absolute', top: 10, left: 10, background: LIME, color: '#0d0d0d', fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 }}>GENERATED</div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 14px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
                </svg>
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.4)', marginBottom: 6 }}>Your video will appear here</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.22)' }}>Configure your settings and click Generate</div>
            </div>
          )}
        </div>

        {/* Recent generations */}
        {genDone && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.38)', marginBottom: 12 }}>Recent Generations</div>
            <div style={{ display: 'flex', gap: 10, overflowX: 'auto' }}>
              {UGC_VIDEOS.slice(0, 4).map((src, i) => (
                <div key={i} style={{ width: 110, flexShrink: 0, borderRadius: 12, overflow: 'hidden', border: `1px solid ${BORDER}`, opacity: i === 0 ? 1 : 0.5 }}>
                  <video src={src} autoPlay muted loop playsInline style={{ width: '100%', height: 185, objectFit: 'cover', display: 'block' }} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
