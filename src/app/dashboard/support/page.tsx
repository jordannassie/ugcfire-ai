'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getMyCompany } from '@/lib/data'
import { Send, Loader2, MessageCircle } from 'lucide-react'

interface ChatMessage {
  id: string
  sender_role: 'client' | 'admin'
  sender_name: string | null
  message: string
  created_at: string
  client_read_at: string | null
}

function formatTime(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export default function ClientSupportPage() {
  const [messages,    setMessages]    = useState<ChatMessage[]>([])
  const [input,       setInput]       = useState('')
  const [sending,     setSending]     = useState(false)
  const [loading,     setLoading]     = useState(true)
  const [companyId,   setCompanyId]   = useState<string | null>(null)
  const [userId,      setUserId]      = useState<string | null>(null)
  const [userName,    setUserName]    = useState('Client')
  const [error,       setError]       = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef   = useRef<NodeJS.Timeout | null>(null)

  const loadMessages = useCallback(async (cid: string) => {
    const sb = createClient()
    const { data, error: err } = await sb
      .from('messages')
      .select('id, sender_role, sender_name, message, created_at, client_read_at')
      .eq('company_id', cid)
      .is('content_item_id', null)
      .order('created_at', { ascending: true })

    if (err) { console.error('[support] load messages:', err); return }
    setMessages((data ?? []) as ChatMessage[])

    // Mark admin messages as read by client
    const unread = (data ?? []).filter(
      (m: ChatMessage) => m.sender_role === 'admin' && !m.client_read_at
    ).map((m: ChatMessage) => m.id)
    if (unread.length > 0) {
      await sb.from('messages').update({ client_read_at: new Date().toISOString() }).in('id', unread)
    }
  }, [])

  useEffect(() => {
    async function init() {
      setLoading(true)
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (!user) { setError('Not signed in'); setLoading(false); return }
      setUserId(user.id)

      const { data: profile } = await sb.from('profiles').select('full_name').eq('id', user.id).maybeSingle()
      setUserName((profile as { full_name?: string | null } | null)?.full_name || user.email?.split('@')[0] || 'Client')

      const company = await getMyCompany()
      if (!company) { setError('No company found for your account.'); setLoading(false); return }
      setCompanyId(company.id)
      await loadMessages(company.id)
      setLoading(false)
    }
    init()
  }, [loadMessages])

  // Poll every 12 seconds for new messages
  useEffect(() => {
    if (!companyId) return
    pollRef.current = setInterval(() => loadMessages(companyId), 12000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [companyId, loadMessages])

  // Scroll to bottom when messages change
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    if (!input.trim() || !companyId || !userId || sending) return
    setSending(true)
    const sb = createClient()
    const { error: err } = await sb.from('messages').insert({
      company_id:     companyId,
      sender_user_id: userId,
      sender_role:    'client',
      sender_name:    userName,
      message:        input.trim(),
    })
    if (err) { console.error('[support] send:', err); setSending(false); return }
    setInput('')
    await loadMessages(companyId)
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={22} className="animate-spin text-white/30" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-white/40 text-sm">{error}</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-160px)] max-h-[760px]">
      {/* Header */}
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white">Support Chat</h1>
        <p className="text-white/40 text-sm mt-1">Message the UGC Fire team anytime. We typically reply within a few hours.</p>
      </div>

      {/* Chat container */}
      <div className="flex flex-col flex-1 min-h-0 bg-[#111] border border-white/8 rounded-2xl overflow-hidden">
        {/* Thread header */}
        <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-full bg-[#FF3B1A]/20 border border-[#FF3B1A]/30 flex items-center justify-center shrink-0">
            <span className="text-[#FF3B1A] text-xs font-bold">🔥</span>
          </div>
          <div>
            <p className="text-white text-sm font-semibold">UGC Fire Team</p>
            <p className="text-white/30 text-xs">Support · hello@ugcfire.com</p>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
              <div className="w-12 h-12 rounded-full bg-[#FF3B1A]/10 flex items-center justify-center">
                <MessageCircle size={22} className="text-[#FF3B1A]" />
              </div>
              <p className="text-white/50 text-sm font-medium">Start a conversation</p>
              <p className="text-white/25 text-xs max-w-xs">Ask us anything about your content plan, deliverables, or account.</p>
            </div>
          )}
          {messages.map(msg => {
            const isClient = msg.sender_role === 'client'
            return (
              <div key={msg.id} className={`flex gap-2.5 ${isClient ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${isClient ? 'bg-blue-500/20 text-blue-300' : 'bg-[#FF3B1A]/20 text-[#FF3B1A]'}`}>
                  {isClient ? (userName[0] ?? 'C').toUpperCase() : '🔥'}
                </div>
                {/* Bubble */}
                <div className={`max-w-[78%] flex flex-col ${isClient ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isClient ? 'bg-[#FF3B1A] text-white rounded-tr-sm' : 'bg-white/8 text-white/85 rounded-tl-sm'}`}>
                    {msg.message}
                  </div>
                  <p className="text-white/20 text-[10px] mt-1 px-1">
                    {isClient ? 'You' : (msg.sender_name || 'UGC Fire Team')} · {formatTime(msg.created_at)}
                  </p>
                </div>
              </div>
            )
          })}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        <div className="px-4 py-3.5 border-t border-white/8 shrink-0">
          <div className="flex gap-2.5 items-end">
            <textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type a message… (Enter to send)"
              rows={1}
              className="flex-1 bg-white/6 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm placeholder-white/25 focus:outline-none focus:border-[#FF3B1A]/50 resize-none leading-relaxed"
              style={{ maxHeight: 120, overflowY: 'auto' }}
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || sending}
              className="flex items-center gap-1.5 bg-[#FF3B1A] hover:bg-[#e02e10] disabled:opacity-40 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition shrink-0"
            >
              {sending ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
