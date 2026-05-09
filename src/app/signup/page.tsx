'use client'
import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { enterDemoMode } from '@/lib/demoData'

const LOGO_URL = 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/UGCfirelog.png'

export default function SignupPage() {
  const router = useRouter()
  const [entering, setEntering] = useState<'user' | 'admin' | null>(null)

  function handleDemo(role: 'client' | 'admin') {
    const display = role === 'admin' ? 'admin' : 'user'
    setEntering(display)
    enterDemoMode(role)
    // Small delay so the cookie is written before navigation
    setTimeout(() => {
      router.push(role === 'admin' ? '/admin' : '/dashboard/video')
    }, 120)
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">

      {/* Background video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
        style={{ opacity: 0.45 }}
        src="https://yawgvntvhpgittvntihx.supabase.co/storage/v1/object/public/UGC%20Fire/brands/Fire%20Images/Videos/hf_20260429_020651_1d9ae862-a0c1-498e-9296-651fb43dc88c%20(1).mp4"
      />
      {/* Orange glow overlay */}
      <div className="absolute inset-0 z-0" style={{ background: 'radial-gradient(ellipse 60% 55% at 65% 40%, rgba(255,92,0,0.18) 0%, transparent 70%)' }} />
      {/* Dark gradient overlay */}
      <div className="absolute inset-0 z-0" style={{ background: 'linear-gradient(135deg, rgba(8,8,8,0.55) 0%, rgba(8,8,8,0.45) 100%)' }} />

      <div className="w-full max-w-md relative z-10">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <Image
              src={LOGO_URL}
              alt="UGCFire.ai"
              width={140}
              height={48}
              className="mx-auto"
              style={{ objectFit: 'contain' }}
              loading="eager"
              unoptimized
            />
          </Link>
          <p className="text-white/40 text-sm mt-3">
            Demo access is enabled while the UGCFire.ai backend is being prepared.
          </p>
        </div>

        {/* Card */}
        <div className="bg-[#0f0f0f]/85 backdrop-blur-sm border border-white/10 rounded-2xl p-8 space-y-5">

          {/* Heading */}
          <div className="text-center space-y-1 pb-2">
            <h1 className="text-white font-bold text-xl tracking-tight">Try UGCFire.ai</h1>
            <p className="text-white/40 text-sm">Select a demo account to explore the platform.</p>
          </div>

          {/* Demo User button */}
          <button
            onClick={() => handleDemo('client')}
            disabled={entering !== null}
            className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl px-5 py-4 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF5C00]/15 border border-[#FF5C00]/30 flex items-center justify-center shrink-0 text-lg">
              👤
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm group-hover:text-[#FF5C00] transition-colors">
                {entering === 'user' ? 'Entering…' : 'Demo User'}
              </div>
              <div className="text-white/35 text-xs mt-0.5">Explore the client dashboard</div>
            </div>
            <svg className="ml-auto w-4 h-4 text-white/20 group-hover:text-[#FF5C00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Demo Admin button */}
          <button
            onClick={() => handleDemo('admin')}
            disabled={entering !== null}
            className="w-full flex items-center gap-4 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF5C00]/40 rounded-xl px-5 py-4 transition-all group disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <div className="w-10 h-10 rounded-full bg-[#FF5C00]/10 border border-[#FF5C00]/25 flex items-center justify-center shrink-0 text-lg">
              ⚡
            </div>
            <div className="text-left">
              <div className="text-white font-semibold text-sm group-hover:text-[#FF5C00] transition-colors">
                {entering === 'admin' ? 'Entering…' : 'Demo Admin'}
              </div>
              <div className="text-white/35 text-xs mt-0.5">Explore the admin command center</div>
            </div>
            <svg className="ml-auto w-4 h-4 text-white/20 group-hover:text-[#FF5C00] transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 pt-1">
            <div className="flex-1 h-px bg-white/8" />
            <span className="text-white/20 text-xs">real login coming soon</span>
            <div className="flex-1 h-px bg-white/8" />
          </div>

          {/* Disabled real login note */}
          <div className="bg-white/3 border border-white/6 rounded-xl px-4 py-3 text-center">
            <p className="text-white/30 text-xs leading-relaxed">
              Real login will be enabled once the UGCFire.ai Supabase project is connected.
              <br />Use demo access above to explore the platform.
            </p>
          </div>

        </div>

        {/* Footer links */}
        <p className="text-center text-white/20 text-xs mt-6">
          <Link href="/terms" className="hover:text-white/50 transition underline underline-offset-2">Terms of Service</Link>
          {' · '}
          <Link href="/privacy" className="hover:text-white/50 transition underline underline-offset-2">Privacy Policy</Link>
        </p>
      </div>
    </div>
  )
}
