'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

/**
 * Client-side OAuth / magic-link callback handler.
 *
 * Running the PKCE code exchange here (in the browser) guarantees the
 * code-verifier cookie is available — it was written by document.cookie
 * during signInWithOAuth and is trivially accessible in the same browser.
 *
 * A server Route Handler cannot reliably read that cookie because:
 *  • The SameSite / domain settings of the verifier cookie can change across
 *    redirects (especially when the Netlify staging domain initiates the flow
 *    but the production domain receives the callback).
 *  • The @supabase/ssr browser client and server client use different storage
 *    strategies for the verifier under the hood.
 */
export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'error'>('loading')
  const [errorMsg, setErrorMsg] = useState('')
  const ran = useRef(false)

  useEffect(() => {
    // Guard against StrictMode double-invocation
    if (ran.current) return
    ran.current = true

    async function handle() {
      const params = new URLSearchParams(window.location.search)
      const code  = params.get('code')
      const next  = params.get('next') ?? '/dashboard/studio'

      const supabase = createClient()

      // No code in URL — maybe already authenticated (e.g. magic link clicked twice)
      if (!code) {
        const { data: { session } } = await supabase.auth.getSession()
        if (session) {
          window.location.replace(next)
        } else {
          setStatus('error')
          setErrorMsg('No authentication code found. Please try logging in again.')
          setTimeout(() => { window.location.replace('/signup?error=no_code') }, 2500)
        }
        return
      }

      // Exchange the code for a session — this works because the PKCE
      // code-verifier cookie is readable here via document.cookie.
      const { error } = await supabase.auth.exchangeCodeForSession(code)

      if (error) {
        console.error('[auth/callback] exchangeCodeForSession failed:', error.message)
        setStatus('error')
        setErrorMsg(error.message)
        setTimeout(() => {
          window.location.replace(`/signup?error=${encodeURIComponent(error.message)}`)
        }, 2500)
        return
      }

      // Determine where to send the user based on their role
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        window.location.replace('/signup?error=session_not_established')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle()

      const destination = profile?.role === 'admin' ? '/admin' : next
      window.location.replace(destination)
    }

    handle()
  }, [])

  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-4">
        <div className="text-center space-y-3 max-w-sm">
          <div className="w-10 h-10 rounded-full bg-red-500/15 flex items-center justify-center mx-auto">
            <span className="text-red-400 text-lg">✕</span>
          </div>
          <p className="text-white font-semibold">Login failed</p>
          <p className="text-white/50 text-sm leading-relaxed">{errorMsg}</p>
          <p className="text-white/25 text-xs">Redirecting to login page…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]">
      <div className="text-center space-y-4">
        <div className="w-9 h-9 border-2 border-[#FF3B1A] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-white/50 text-sm">Completing sign in…</p>
      </div>
    </div>
  )
}
