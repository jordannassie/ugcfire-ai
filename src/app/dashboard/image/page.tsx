'use client'
import { ImageIcon } from 'lucide-react'

export default function ImageStudioPage() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: 32, textAlign: 'center' }}>
      <div style={{ width: 60, height: 60, borderRadius: 16, background: 'rgba(255,92,0,0.1)', border: '1px solid rgba(255,92,0,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 18 }}>
        <ImageIcon size={26} color="#FF5C00" strokeWidth={1.5} />
      </div>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#fff', marginBottom: 8, letterSpacing: '-0.02em' }}>Image Studio</h1>
      <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', lineHeight: 1.7, maxWidth: 360 }}>
        Generate product ad images, UGC-style stills, and on-brand visuals from your product photos.
        <br /><br />
        <span style={{ color: '#FF5C00', fontWeight: 600 }}>Coming soon</span> — this feature is being built as part of the next phase.
      </p>
    </div>
  )
}
