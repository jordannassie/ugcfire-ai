'use client'
import { useEffect, useRef, useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Send, Loader2, MessageCircle, Search, Users } from 'lucide-react'

interface ConvoPreview {
  companyId:      string
  companyName:    string
  avatarUrl:      string | null
  lastMessage:    string
  lastAt:         string | null
  unreadCount:    number
}

interface ChatMessage {
  id: string
  sender_role: 'client' | 'admin'
  sender_name: string | null
  message: string
  created_at: string
  read_at: string | null
}

function formatTime(ts: string | null) {
  if (!ts) return ''
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
}

function formatFull(ts: string) {
  const d = new Date(ts)
  const now = new Date()
  const isToday = d.toDateString() === now.toDateString()
  if (isToday) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  return d.toLocaleDateString([], { month: 'short', day: 'numeric' }) + ' · ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function Avatar({ src, name, size = 8, extraClass = '' }: { src?: string | null; name: string; size?: number; extraClass?: string }) {
  const px = size * 4
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={name} className={`rounded-full object-cover shrink-0 ${extraClass}`} style={{ width: px, height: px }} />
    )
  }
  return (
    <div
      className={`rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-white/10 text-white/60 ${extraClass}`}
      style={{ width: px, height: px }}
    >
      {name?.[0]?.toUpperCase() ?? '?'}
    </div>
  )
}

export default function AdminSupportPage() {
  const [convos,     setConvos]     = useState<ConvoPreview[]>([])
  const [search,     setSearch]     = useState('')
  const [selected,   setSelected]   = useState<ConvoPreview | null>(null)
  const [messages,   setMessages]   = useState<ChatMessage[]>([])
  const [input,      setInput]      = useState('')
  const [sending,    setSending]    = useState(false)
  const [loading,    setLoading]    = useState(true)
  const [msgLoading, setMsgLoading] = useState(false)
  const [adminId,    setAdminId]    = useState<string | null>(null)
  const [fcName,     setFcName]     = useState('UGC Fire Team')
  const [fcAvatar,   setFcAvatar]   = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const pollRef   = useRef<NodeJS.Timeout | null>(null)

  // Fetch brand logo for a company (brand_briefs.notes.logo_url, else profiles.avatar_url)
  async function fetchCompanyAvatar(sb: ReturnType<typeof createClient>, companyId: string, ownerUserId: string | null): Promise<string | null> {
    const { data: brief } = await sb.from('brand_briefs').select('notes').eq('company_id', companyId).maybeSingle()
    if (brief?.notes) {
      try {
        const notes = JSON.parse(brief.notes as string)
        if (notes.logo_url) return notes.logo_url
      } catch {}
    }
    if (ownerUserId) {
      const { data: profile } = await sb.from('profiles').select('avatar_url').eq('id', ownerUserId).maybeSingle()
      const p = profile as { avatar_url?: string | null } | null
      if (p?.avatar_url) return p.avatar_url
    }
    return null
  }

  const loadConvos = useCallback(async () => {
    const sb = createClient()
    const { data: companies } = await sb.from('companies').select('id, name, owner_user_id').order('name')
    if (!companies) return

    const previews: ConvoPreview[] = await Promise.all(
      companies.map(async (c) => {
        const [{ data: latest }, { count }, avatarUrl] = await Promise.all([
          sb.from('messages').select('message, created_at, sender_role')
            .eq('company_id', c.id).is('content_item_id', null)
            .order('created_at', { ascending: false }).limit(1).maybeSingle(),
          sb.from('messages').select('*', { count: 'exact', head: true })
            .eq('company_id', c.id).is('content_item_id', null)
            .eq('sender_role', 'client').is('read_at', null),
          fetchCompanyAvatar(sb, c.id, c.owner_user_id),
        ])
        const msg = latest as { message: string; created_at: string; sender_role: string } | null
        return {
          companyId:   c.id,
          companyName: c.name,
          avatarUrl,
          lastMessage: msg?.message ?? '',
          lastAt:      msg?.created_at ?? null,
          unreadCount: count ?? 0,
        }
      })
    )

    previews.sort((a, b) => {
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount
      if (!a.lastAt && !b.lastAt) return 0
      if (!a.lastAt) return 1
      if (!b.lastAt) return -1
      return new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime()
    })

    setConvos(previews)
    setLoading(false)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const loadThread = useCallback(async (companyId: string) => {
    setMsgLoading(true)
    const sb = createClient()
    const { data } = await sb.from('messages')
      .select('id, sender_role, sender_name, message, created_at, read_at')
      .eq('company_id', companyId).is('content_item_id', null)
      .order('created_at', { ascending: true })
    setMessages((data ?? []) as ChatMessage[])
    setMsgLoading(false)

    // Mark client messages as read
    const unread = (data ?? []).filter(
      (m: ChatMessage) => m.sender_role === 'client' && !m.read_at
    ).map((m: ChatMessage) => m.id)
    if (unread.length > 0) {
      await sb.from('messages').update({ read_at: new Date().toISOString() }).in('id', unread)
      setConvos(prev => prev.map(c => c.companyId === companyId ? { ...c, unreadCount: 0 } : c))
    }
  }, [])

  useEffect(() => {
    async function init() {
      const sb = createClient()
      const { data: { user } } = await sb.auth.getUser()
      if (user) setAdminId(user.id)

      // Fire Creator profile
      const res = await fetch('/api/admin/profile').catch(() => null)
      if (res?.ok) {
        const ap = await res.json()
        if (ap?.display_name) setFcName(ap.display_name)
        if (ap?.avatar_url)   setFcAvatar(ap.avatar_url)
      }

      await loadConvos()
    }
    init()
  }, [loadConvos])

  // Poll thread every 12s when open
  useEffect(() => {
    if (!selected) return
    pollRef.current = setInterval(() => loadThread(selected.companyId), 12000)
    return () => { if (pollRef.current) clearInterval(pollRef.current) }
  }, [selected, loadThread])

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function selectConvo(convo: ConvoPreview) {
    setSelected(convo)
    setMessages([])
    await loadThread(convo.companyId)
  }

  async function handleSend() {
    if (!input.trim() || !selected || !adminId || sending) return
    setSending(true)
    const sb = createClient()
    const { error } = await sb.from('messages').insert({
      company_id:     selected.companyId,
      sender_user_id: adminId,
      sender_role:    'admin',
      sender_name:    fcName,
      message:        input.trim(),
    })
    if (error) { console.error('[admin support] send:', error); setSending(false); return }
    setInput('')
    await loadThread(selected.companyId)
    loadConvos()
    setSending(false)
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  const filtered = convos.filter(c =>
    c.companyName.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex flex-col h-[calc(100vh-96px)]">
      <div className="mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-white">Support Inbox</h1>
        <p className="text-white/40 text-sm mt-1">All client conversations in one place.</p>
      </div>

      <div className="flex flex-1 min-h-0 bg-[#111] border border-white/8 rounded-2xl overflow-hidden">

        {/* Left — conversation list */}
        <div className="w-72 shrink-0 border-r border-white/8 flex flex-col">
          <div className="p-3 border-b border-white/8 shrink-0">
            <div className="relative">
              <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
              <input
                type="text"
                placeholder="Search clients…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-white/6 border border-white/8 rounded-lg pl-8 pr-3 py-2 text-white text-xs placeholder-white/25 focus:outline-none focus:border-[#FF3B1A]/40"
              />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading && (
              <div className="flex items-center justify-center py-10">
                <Loader2 size={18} className="animate-spin text-white/30" />
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <p className="text-white/25 text-xs text-center py-8">No clients found</p>
            )}
            {filtered.map(convo => (
              <button
                key={convo.companyId}
                onClick={() => selectConvo(convo)}
                className={`w-full text-left px-4 py-3.5 border-b border-white/5 transition hover:bg-white/4 ${selected?.companyId === convo.companyId ? 'bg-[#FF3B1A]/8 border-l-2 border-l-[#FF3B1A]' : ''}`}
              >
                <div className="flex items-start gap-2.5">
                  <Avatar src={convo.avatarUrl} name={convo.companyName} size={8} extraClass="mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className={`text-sm font-semibold truncate ${convo.unreadCount > 0 ? 'text-white' : 'text-white/70'}`}>
                        {convo.companyName}
                      </p>
                      <span className="text-white/25 text-[10px] shrink-0">{formatTime(convo.lastAt)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mt-0.5">
                      <p className="text-white/35 text-xs truncate">
                        {convo.lastMessage || 'No messages yet'}
                      </p>
                      {convo.unreadCount > 0 && (
                        <span className="shrink-0 w-4 h-4 bg-[#FF3B1A] rounded-full flex items-center justify-center text-[9px] font-bold text-white">
                          {convo.unreadCount > 9 ? '9+' : convo.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right — thread */}
        <div className="flex-1 flex flex-col min-w-0">
          {!selected ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-center p-8">
              <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                <Users size={24} className="text-white/20" />
              </div>
              <p className="text-white/30 text-sm">Select a client to view their conversation</p>
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="px-5 py-3.5 border-b border-white/8 flex items-center gap-3 shrink-0">
                <Avatar src={selected.avatarUrl} name={selected.companyName} size={9} />
                <div>
                  <p className="text-white font-semibold text-sm">{selected.companyName}</p>
                  <p className="text-white/30 text-xs">Support thread</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                {msgLoading && (
                  <div className="flex justify-center py-6">
                    <Loader2 size={18} className="animate-spin text-white/30" />
                  </div>
                )}
                {!msgLoading && messages.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-full gap-3 text-center py-12">
                    <MessageCircle size={22} className="text-white/15" />
                    <p className="text-white/25 text-sm">No messages yet from this client.</p>
                  </div>
                )}
                {messages.map(msg => {
                  const isAdmin = msg.sender_role === 'admin'
                  return (
                    <div key={msg.id} className={`flex gap-2.5 ${isAdmin ? 'flex-row-reverse' : 'flex-row'}`}>
                      <Avatar
                        src={isAdmin ? fcAvatar : selected.avatarUrl}
                        name={isAdmin ? fcName : selected.companyName}
                        size={7}
                        extraClass="mt-0.5"
                      />
                      <div className={`max-w-[78%] flex flex-col ${isAdmin ? 'items-end' : 'items-start'}`}>
                        <div className={`px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed ${isAdmin ? 'bg-[#FF3B1A] text-white rounded-tr-sm' : 'bg-white/8 text-white/85 rounded-tl-sm'}`}>
                          {msg.message}
                        </div>
                        <p className="text-white/20 text-[10px] mt-1 px-1">
                          {isAdmin ? (msg.sender_name || fcName) : (msg.sender_name || selected.companyName)} · {formatFull(msg.created_at)}
                        </p>
                      </div>
                    </div>
                  )
                })}
                <div ref={bottomRef} />
              </div>

              {/* Input */}
              <div className="px-4 py-3.5 border-t border-white/8 shrink-0">
                {/* Sending as indicator */}
                <div className="flex items-center gap-2 mb-2">
                  <Avatar src={fcAvatar} name={fcName} size={5} />
                  <span className="text-white/25 text-xs">Replying as <span className="text-white/50">{fcName}</span></span>
                </div>
                <div className="flex gap-2.5 items-end">
                  <textarea
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Type a reply… (Enter to send)"
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
            </>
          )}
        </div>
      </div>
    </div>
  )
}
