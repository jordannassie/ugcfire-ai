'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Send, X, ExternalLink, DollarSign, Calendar, CheckCircle, ChevronRight } from 'lucide-react';
import { MOCK_PROJECTS } from '@/lib/demoData';

const ORANGE = '#FF5C00';
const LIME   = '#a3e635';
const PANEL  = '#141414';
const PANEL2 = '#111111';
const BORDER = 'rgba(255,255,255,0.07)';

const CONVERSATIONS = [
  { id: 1, name: 'GlowCo Beauty',  projectId: 'proj-1', last: 'Great work on the first draft!',         time: '5m ago',  unread: 1, initials: 'GC', color: '#f472b6' },
  { id: 2, name: 'CoreFit App',    projectId: 'proj-3', last: 'Can you do a 9:16 version too?',          time: '1h ago',  unread: 2, initials: 'CF', color: LIME      },
  { id: 3, name: 'ToolHive',       projectId: 'proj-6', last: 'Payment released — thank you!',          time: '1d ago',  unread: 0, initials: 'TH', color: '#22d3ee' },
  { id: 4, name: 'Harvest Table',  projectId: 'proj-5', last: 'Looking forward to seeing the drafts.',  time: '2d ago',  unread: 0, initials: 'HT', color: '#f97316' },
];

const DEMO_MESSAGES: Record<number, { id: number; from: 'client' | 'creator'; text: string; time: string }[]> = {
  1: [
    { id: 1, from: 'client',  text: 'Hi! We love your work. We\'re running a summer skincare campaign — interested?', time: '9:00 AM' },
    { id: 2, from: 'creator', text: 'Yes, absolutely! I checked the brief and I can deliver exactly what you need.', time: '9:12 AM' },
    { id: 3, from: 'client',  text: 'Amazing. 3 short UGC-style videos, 30–60 seconds each.', time: '9:15 AM' },
    { id: 4, from: 'creator', text: 'Got it. I\'ll start with a test piece so you can confirm direction before I finish all three.', time: '9:18 AM' },
    { id: 5, from: 'client',  text: 'Great work on the first draft!', time: '10:30 AM' },
  ],
  2: [
    { id: 1, from: 'client',  text: 'Hey, we saw your fitness content — really solid.', time: '10:00 AM' },
    { id: 2, from: 'creator', text: 'Thanks! Fitness is one of my strongest categories.', time: '10:05 AM' },
    { id: 3, from: 'client',  text: 'Can you do a 9:16 version too?', time: '11:20 AM' },
  ],
  3: [
    { id: 1, from: 'client',  text: 'All 3 explainer videos look great.', time: '2:00 PM' },
    { id: 2, from: 'creator', text: 'Glad you\'re happy with them! Great project to work on.', time: '2:10 PM' },
    { id: 3, from: 'client',  text: 'Payment released — thank you!', time: '3:00 PM' },
  ],
  4: [
    { id: 1, from: 'client',  text: 'We\'re excited to see what you create for us.', time: '9:00 AM' },
    { id: 2, from: 'creator', text: 'Likewise! Warm lifestyle content is my specialty.', time: '9:30 AM' },
    { id: 3, from: 'client',  text: 'Looking forward to seeing the drafts.', time: '10:00 AM' },
  ],
};

export default function CreatorMessagesPage() {
  const [selected,     setSelected]     = useState(CONVERSATIONS[0]);
  const [input,        setInput]        = useState('');
  const [messages,     setMessages]     = useState(DEMO_MESSAGES);
  const [rightOpen,    setRightOpen]    = useState(true);

  const project = MOCK_PROJECTS.find(p => p.id === selected.projectId);

  function sendMessage() {
    if (!input.trim()) return;
    const msg = { id: Date.now(), from: 'creator' as const, text: input.trim(), time: 'Just now' };
    setMessages(prev => ({ ...prev, [selected.id]: [...(prev[selected.id] ?? []), msg] }));
    setInput('');
  }

  const thread = messages[selected.id] ?? [];

  return (
    <>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        .msg-wrap { display: flex; height: calc(100dvh - 52px); overflow: hidden; }
        @media (max-width: 700px) { .msg-wrap { flex-direction: column; height: auto; min-height: calc(100dvh - 52px); } .context-panel { display: none !important; } }
      `}</style>

      <div className="msg-wrap">

        {/* ── 1. CONVERSATION LIST ─────────────────────────────────────────── */}
        <aside style={{ width: 240, borderRight: `1px solid ${BORDER}`, background: PANEL2, display: 'flex', flexDirection: 'column', flexShrink: 0, overflowY: 'auto' }}>
          <div style={{ padding: '14px 14px 10px', borderBottom: `1px solid ${BORDER}` }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>Messages</span>
          </div>
          {CONVERSATIONS.map(conv => (
            <button key={conv.id} onClick={() => setSelected(conv)}
              style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '12px 14px', border: 'none', background: selected.id === conv.id ? 'rgba(255,255,255,0.05)' : 'transparent', borderLeft: selected.id === conv.id ? `3px solid ${ORANGE}` : '3px solid transparent', cursor: 'pointer', textAlign: 'left', fontFamily: 'inherit', width: '100%' }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${conv.color}25`, border: `1.5px solid ${conv.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, color: conv.color, flexShrink: 0 }}>
                {conv.initials}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 2 }}>
                  <span style={{ fontSize: 12, fontWeight: 700, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.name}</span>
                  <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.3)', flexShrink: 0, marginLeft: 4 }}>{conv.time}</span>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.last}</div>
              </div>
              {conv.unread > 0 && (
                <span style={{ width: 16, height: 16, borderRadius: '50%', background: ORANGE, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, fontWeight: 800, color: '#fff', flexShrink: 0, marginTop: 2 }}>{conv.unread}</span>
              )}
            </button>
          ))}
        </aside>

        {/* ── 2. CHAT THREAD ───────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0, background: '#0d0d0d' }}>

          {/* Thread header */}
          <div style={{ padding: '12px 16px', borderBottom: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: `${selected.color}25`, border: `1.5px solid ${selected.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 800, color: selected.color, flexShrink: 0 }}>
              {selected.initials}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{selected.name}</div>
              {project && <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.38)' }}>{project.title}</div>}
            </div>
            <button onClick={() => setRightOpen(v => !v)}
              style={{ fontSize: 11, fontWeight: 600, padding: '5px 10px', borderRadius: 7, background: rightOpen ? 'rgba(255,255,255,0.07)' : 'transparent', border: `1px solid ${BORDER}`, color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: 5 }}>
              Project <ChevronRight size={11} strokeWidth={2} style={{ transform: rightOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
            </button>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
            {thread.map(msg => (
              <div key={msg.id} style={{ display: 'flex', justifyContent: msg.from === 'creator' ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
                <div style={{ maxWidth: '72%' }}>
                  <div style={{
                    padding: '9px 13px', borderRadius: msg.from === 'creator' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: msg.from === 'creator' ? ORANGE : PANEL,
                    border: msg.from === 'creator' ? 'none' : `1px solid ${BORDER}`,
                    fontSize: 13, color: '#fff', lineHeight: 1.55,
                  }}>
                    {msg.text}
                  </div>
                  <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', marginTop: 3, textAlign: msg.from === 'creator' ? 'right' : 'left', paddingInline: 4 }}>{msg.time}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: `1px solid ${BORDER}`, display: 'flex', gap: 8, flexShrink: 0 }}>
            <input value={input} onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
              placeholder="Type a message..."
              style={{ flex: 1, background: PANEL, border: `1px solid ${BORDER}`, borderRadius: 10, padding: '9px 14px', color: '#fff', fontSize: 13, fontFamily: 'inherit', outline: 'none' }} />
            <button onClick={sendMessage}
              style={{ width: 38, height: 38, borderRadius: 10, background: ORANGE, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Send size={14} color="#fff" strokeWidth={2} />
            </button>
          </div>
        </div>

        {/* ── 3. PROJECT CONTEXT PANEL ─────────────────────────────────────── */}
        {rightOpen && project && (
          <aside className="context-panel" style={{ width: 220, borderLeft: `1px solid ${BORDER}`, background: PANEL2, overflowY: 'auto', flexShrink: 0, padding: '16px 14px' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 12 }}>Project</div>

            {/* Project name */}
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4, lineHeight: 1.4 }}>{project.title}</div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.4)', marginBottom: 14 }}>{project.brandName}</div>

            {/* Status */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: LIME, background: 'rgba(163,230,53,0.1)', border: '1px solid rgba(163,230,53,0.25)', padding: '2px 9px', borderRadius: 20 }}>
                {project.status}
              </span>
            </div>

            {/* Details */}
            {[
              { icon: DollarSign, label: 'Budget',   value: `$${project.budget}` },
              { icon: DollarSign, label: 'Your Payout', value: `$${project.creatorPayMin}–$${project.creatorPayMax}`, color: LIME },
              { icon: Calendar,   label: 'Deadline',  value: project.deadline },
              { icon: CheckCircle,label: 'Deliverables', value: `${project.deliverables.length} items` },
            ].map(d => (
              <div key={d.label} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
                <d.icon size={12} color="rgba(255,255,255,0.3)" strokeWidth={1.75} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{d.label}</div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: (d as { color?: string }).color ?? 'rgba(255,255,255,0.7)' }}>{d.value}</div>
                </div>
              </div>
            ))}

            <div style={{ marginTop: 14, borderTop: `1px solid ${BORDER}`, paddingTop: 14 }}>
              <Link href={`/dashboard/projects/${project.id}`}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, width: '100%', padding: '9px', borderRadius: 9, background: `${ORANGE}18`, border: `1px solid ${ORANGE}30`, color: ORANGE, textDecoration: 'none', fontSize: 12, fontWeight: 700 }}>
                <ExternalLink size={12} strokeWidth={2} /> View Project
              </Link>
            </div>
          </aside>
        )}
      </div>
    </>
  );
}
