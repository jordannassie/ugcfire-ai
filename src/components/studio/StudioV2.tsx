'use client';

import React, { useState, useEffect, useRef, Component, ReactNode } from 'react';

// ─── Error boundary so a render exception shows a recoverable UI ──────────────
class StudioErrorBoundary extends Component<{ children: ReactNode }, { error: Error | null }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error: Error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', background: '#0d0d0d', color: '#f0ede8', gap: 12, padding: 32, textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Studio failed to load</div>
          <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', maxWidth: 300 }}>{this.state.error.message}</div>
          <button onClick={() => window.location.reload()} style={{ marginTop: 8, padding: '8px 18px', borderRadius: 8, background: '#a3e635', color: '#0d0d0d', border: 'none', fontWeight: 700, fontSize: 13, cursor: 'pointer' }}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}
import {
  Video, ImageIcon, Sparkles, ChevronRight, Plus, Clock, Eye,
  LayoutGrid, List, Info, Search, Play, Heart, Download,
  Copy, Trash2, RefreshCw, MoreHorizontal, CheckCircle, Cpu,
  User, Briefcase,
} from 'lucide-react';
import HoverVideoPreview from '@/components/shared/HoverVideoPreview';
import AssetPickerModal from '@/components/dashboard/AssetPickerModal';
import {
  PRODUCT_IMAGES, DEMO_VIDEO_GENS, DEMO_IMAGE_GENS,
  LS_VIDEO_GENS, LS_IMAGE_GENS,
  loadFromLS, saveToLS, subtractCredits, formatGenDate,
  type VideoGeneration, type ImageGeneration,
} from '@/lib/demoAssets';

// ─── Tokens (dark-only) ───────────────────────────────────────────────────────
const BG       = '#0d0d0d';
const RAIL     = '#111111';
const SURFACE  = '#161616';
const PANEL    = '#141414';
const BORDER   = 'rgba(255,255,255,0.07)';
const BORDER2  = 'rgba(255,255,255,0.11)';
const TEXT     = '#f0ede8';
const MUTED    = 'rgba(255,255,255,0.44)';
const FAINT    = 'rgba(255,255,255,0.20)';
const LIME     = '#a3e635';
const ORANGE   = '#FF5C00';
const YELLOW   = '#fbbf24';
const CYAN     = '#22d3ee';

// ─── Types ────────────────────────────────────────────────────────────────────
type GenItem =
  | (VideoGeneration & { kind: 'video' })
  | (ImageGeneration & { kind: 'image' });

type CreationMode = 'video' | 'image';
type HistoryTab   = 'all' | 'videos' | 'images' | 'favorites';
type ViewMode     = 'list' | 'grid';

// ─── Static option sets ───────────────────────────────────────────────────────
const VID_DURATIONS = ['6s', '8s', '10s'];
const VID_RES       = ['720p', '1080p'];

type FormatOption = { value: string; label: string; platform: string };

const VID_FORMATS: FormatOption[] = [
  { value: '9:16',  label: 'Vertical',    platform: 'TikTok / Reels'  },
  { value: '16:9',  label: 'Horizontal',  platform: 'YouTube / Web'   },
  { value: '1:1',   label: 'Square',      platform: 'Feed'            },
];

const IMG_FORMATS: FormatOption[] = [
  { value: '1:1',   label: 'Square',      platform: 'Feed'            },
  { value: '4:5',   label: 'Portrait',    platform: 'Instagram'       },
  { value: '9:16',  label: 'Vertical',    platform: 'TikTok / Reels'  },
  { value: '16:9',  label: 'Horizontal',  platform: 'YouTube / Web'   },
];

type ModelDef = {
  id: string;
  label: string;
  credits: string;
  creditNum: number;
  desc: string;
  accent: string;
  logo: string | null;
  logoBg: string;
  badge: string | null;
};

const VID_MODELS: ModelDef[] = [
  {
    id: 'seedance', label: 'Seedance 2.0', credits: '54 cr', creditNum: 54,
    desc: 'Realistic UGC-style videos', accent: CYAN,
    logo: 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/seedance_2_logo_transparent_original_edges.png',
    logoBg: 'linear-gradient(135deg,#0d2233,#061520)', badge: 'NEW',
  },
  {
    id: 'ugcfire2', label: 'UGCFire Video 2.0', credits: 'Incl.', creditNum: 0,
    desc: 'Optimised for UGC ad content', accent: ORANGE,
    logo: null, logoBg: `${ORANGE}18`, badge: null,
  },
  {
    id: 'ugcfire1', label: 'UGCFire Video 1.0', credits: 'Incl.', creditNum: 0,
    desc: 'Stable legacy model', accent: FAINT,
    logo: null, logoBg: 'rgba(255,255,255,0.05)', badge: null,
  },
];

const IMG_MODELS: ModelDef[] = [
  {
    id: 'gpt2', label: 'GPT Image 2.0', credits: '8 cr', creditNum: 8,
    desc: 'Product visuals & lifestyle', accent: LIME,
    logo: 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/GPT%202.0.png',
    logoBg: '#050505', badge: 'NEW',
  },
  {
    id: 'nano2', label: 'Nano Banana 2', credits: '4 cr', creditNum: 4,
    desc: 'Fast mockups & social', accent: YELLOW,
    logo: 'https://bzzioeupoubgwvkgvmne.supabase.co/storage/v1/object/public/UGCFIRE%20AI/logo/Nano.jpg',
    logoBg: 'rgba(250,204,21,0.08)', badge: 'FAST',
  },
  {
    id: 'ugcfireimg', label: 'UGCFire Image', credits: 'Incl.', creditNum: 0,
    desc: 'Platform default', accent: ORANGE,
    logo: null, logoBg: `${ORANGE}15`, badge: null,
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
function normalizeRatio(raw: string | undefined | null): string {
  if (!raw) return '1:1';
  return raw.replace(/\s*\(.*?\)/, '').trim() || '1:1';
}

function ratioParts(ratio: string | undefined | null): { w: number; h: number } {
  const normalized = normalizeRatio(ratio);
  const parts = normalized.split(':');
  const w = parseFloat(parts[0]) || 1;
  const h = parseFloat(parts[1]) || 1;
  return { w, h };
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function RatioBox({ ratio, size = 12 }: { ratio: string; size?: number }) {
  const { w, h } = ratioParts(ratio);
  const scale = size / Math.max(w, h);
  return (
    <div style={{
      width: Math.round(w * scale), height: Math.round(h * scale),
      border: '1.5px solid currentColor', borderRadius: 2, flexShrink: 0,
    }} />
  );
}

function ModelLogo({ model, size = 22 }: { model: ModelDef; size?: number }) {
  return (
    <div style={{
      width: size, height: size,
      borderRadius: Math.round(size * 0.27),
      background: model.logoBg,
      border: `1px solid ${BORDER2}`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0, overflow: 'hidden', padding: model.logo ? 2 : 0,
    }}>
      {model.logo
        ? <img src={model.logo} alt={model.label} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        : <Cpu size={Math.round(size * 0.46)} strokeWidth={1.75} color={model.accent} />}
    </div>
  );
}

function ModelDropdown({ models, value, onChange }: {
  models: ModelDef[];
  value: string;
  onChange: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const active = models.find(m => m.id === value) ?? models[0];

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 4px', background: 'transparent', border: 'none',
          cursor: 'pointer', fontFamily: 'inherit',
        }}
      >
        <ModelLogo model={active} size={22} />
        <span style={{
          flex: 1, fontSize: 12, fontWeight: 700, color: TEXT,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', textAlign: 'left',
        }}>{active.label}</span>
        {active.badge && (
          <span style={{
            fontSize: 7, fontWeight: 800, background: active.accent, color: '#0d0d0d',
            borderRadius: 3, padding: '1.5px 5px', flexShrink: 0,
          }}>{active.badge}</span>
        )}
        <span style={{ fontSize: 10, fontWeight: 700, color: active.accent, flexShrink: 0 }}>
          {active.credits}
        </span>
        <ChevronRight size={12} color={FAINT} strokeWidth={2} style={{ flexShrink: 0 }} />
      </button>

      {open && (
        <div style={{
          position: 'absolute', top: 'calc(100% + 3px)', left: 0, right: 0,
          background: '#1c1c1c', border: `1px solid ${BORDER2}`, borderRadius: 10,
          zIndex: 300, overflow: 'hidden', boxShadow: '0 10px 32px rgba(0,0,0,0.7)',
        }}>
          {models.map(m => (
            <button
              key={m.id}
              onClick={() => { onChange(m.id); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                padding: '9px 11px',
                background: m.id === value ? 'rgba(255,255,255,0.06)' : 'transparent',
                border: 'none', cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              <ModelLogo model={m} size={20} />
              <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
                <div style={{
                  fontSize: 11, fontWeight: 700,
                  color: m.id === value ? m.accent : TEXT,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{m.label}</div>
                <div style={{
                  fontSize: 9, color: FAINT,
                  overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                }}>{m.desc}</div>
              </div>
              {m.badge && (
                <span style={{
                  fontSize: 7, fontWeight: 800, background: m.accent, color: '#0d0d0d',
                  borderRadius: 3, padding: '1.5px 5px', flexShrink: 0,
                }}>{m.badge}</span>
              )}
              <span style={{
                fontSize: 9, fontWeight: 700,
                color: m.id === value ? m.accent : FAINT, flexShrink: 0,
              }}>{m.credits}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function SettingPill({
  icon: Icon, label, options, value, onChange, accent,
}: {
  icon: React.ElementType;
  label: string;
  options: string[];
  value: string;
  onChange: (v: string) => void;
  accent: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const isRatio = label === 'ratio';

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div ref={ref} style={{ position: 'relative', flex: 1 }}>
      <button
        onClick={() => setOpen(v => !v)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
          padding: '7px 4px', borderRadius: 8, cursor: 'pointer', fontFamily: 'inherit',
          border: `1px solid ${open ? accent : BORDER}`,
          background: open ? `${accent}12` : SURFACE,
          color: open ? accent : MUTED, fontSize: 11, fontWeight: 700, transition: 'all 0.12s',
        }}
      >
        {isRatio ? <RatioBox ratio={value} size={10} /> : <Icon size={10} strokeWidth={1.75} />}
        <span>{value}</span>
      </button>
      {open && (
        <div style={{
          position: 'absolute', bottom: 'calc(100% + 5px)', left: '50%',
          transform: 'translateX(-50%)', background: '#1c1c1c',
          border: `1px solid ${BORDER2}`, borderRadius: 9, zIndex: 300,
          overflow: 'hidden', minWidth: 88, boxShadow: '0 8px 28px rgba(0,0,0,0.7)',
        }}>
          {options.map(opt => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false); }}
              style={{
                width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                padding: '8px 14px',
                background: opt === value ? `${accent}18` : 'transparent',
                border: 'none', color: opt === value ? accent : MUTED,
                fontSize: 12, fontWeight: opt === value ? 700 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                borderBottom: `1px solid ${BORDER}`,
              }}
            >
              {isRatio && <RatioBox ratio={opt} size={9} />}
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Right panel ──────────────────────────────────────────────────────────────
function RightPanel({
  item, liked, onLike, onRerun, onDownload, onDelete, onSaveToProfile,
  onSubmitToProject, showToast,
}: {
  item: GenItem | null;
  liked: boolean;
  onLike: () => void;
  onRerun: () => void;
  onDownload: () => void;
  onDelete: () => void;
  onSaveToProfile: () => void;
  onSubmitToProject: () => void;
  showToast: (msg: string) => void;
}) {
  if (!item) {
    return (
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column', gap: 10, padding: 24, textAlign: 'center',
      }}>
        <div style={{
          width: 40, height: 40, borderRadius: 11, background: SURFACE,
          border: `1px solid ${BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Sparkles size={18} color="rgba(255,255,255,0.12)" strokeWidth={1.75} />
        </div>
        <p style={{ fontSize: 12, color: FAINT, lineHeight: 1.5, maxWidth: 160 }}>
          Select a generation to view details
        </p>
      </div>
    );
  }

  const vidItem    = item.kind === 'video' ? (item as VideoGeneration) : null;
  const imgItem    = item.kind === 'image' ? (item as ImageGeneration) : null;
  const allModels  = [...VID_MODELS, ...IMG_MODELS];
  const modelDef   = allModels.find(m =>
    m.label === item.model || item.model.toLowerCase().includes(m.label.toLowerCase().split(' ')[0])
  ) ?? (item.kind === 'video' ? VID_MODELS[0] : IMG_MODELS[0]);
  const ratio      = vidItem ? normalizeRatio(vidItem.aspectRatio) : imgItem?.aspectRatio ?? '1:1';
  const refs: string[] = vidItem?.referenceImages ?? imgItem?.selectedAssets ?? [];

  return (
    <div style={{
      height: '100%', overflowY: 'auto', padding: '16px 14px',
      display: 'flex', flexDirection: 'column', gap: 16,
    }}>

      {/* Preview thumbnail */}
      <div style={{
        width: '100%', borderRadius: 10, overflow: 'hidden',
        background: '#080808', border: `1px solid ${BORDER}`,
        aspectRatio: '16/9', position: 'relative', flexShrink: 0,
      }}>
        {item.kind === 'video'
          ? <HoverVideoPreview
              src={(item as VideoGeneration).videoSrc}
              autoPlay loop
              style={{ height: '100%', width: '100%' }}
            />
          : <img
              src={(item as ImageGeneration).imageSrc}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
            />
        }
      </div>

      {/* Model badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <ModelLogo model={modelDef} size={20} />
        <span style={{
          fontSize: 12, fontWeight: 700, color: modelDef.accent,
          overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1,
        }}>{item.model}</span>
        {modelDef.badge && (
          <span style={{
            fontSize: 7, fontWeight: 800, background: modelDef.accent, color: '#0d0d0d',
            borderRadius: 3, padding: '1.5px 5px', flexShrink: 0,
          }}>{modelDef.badge}</span>
        )}
      </div>

      {/* Prompt */}
      <div>
        <p style={{
          fontSize: 11.5, color: MUTED, lineHeight: 1.65, margin: 0,
        }}>
          {item.prompt || '—'}
        </p>
      </div>

      {/* Reference thumbnails */}
      {refs.length > 0 && (
        <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
          {refs.slice(0, 4).map((src, i) => (
            <div key={i} style={{
              width: 34, height: 34, borderRadius: 7, overflow: 'hidden',
              border: `1px solid ${BORDER2}`, flexShrink: 0,
            }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      )}

      {/* Metadata pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 5, flexWrap: 'wrap' }}>
        {vidItem && (
          <>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5,
              fontWeight: 600, color: FAINT,
              background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: 20, padding: '3px 8px',
            }}>
              <Eye size={9} strokeWidth={1.75} /> {vidItem.resolution}
            </span>
            <span style={{
              display: 'flex', alignItems: 'center', gap: 3, fontSize: 10.5,
              fontWeight: 600, color: FAINT,
              background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: 20, padding: '3px 8px',
            }}>
              <Clock size={9} strokeWidth={1.75} /> {vidItem.duration}
            </span>
          </>
        )}
        <span style={{
          display: 'flex', alignItems: 'center', gap: 4, fontSize: 10.5,
          fontWeight: 600, color: FAINT,
          background: SURFACE, border: `1px solid ${BORDER}`,
          borderRadius: 20, padding: '3px 8px',
        }}>
          <RatioBox ratio={ratio} size={9} /> {ratio}
        </span>
      </div>

      {/* Date */}
      <p style={{ fontSize: 10, color: FAINT, margin: 0 }}>
        {formatGenDate(item.createdAt)}
      </p>

      {/* Divider */}
      <div style={{ height: 1, background: BORDER }} />

      {/* Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
        <button
          onClick={onRerun}
          style={{
            width: '100%', padding: '9px 0', borderRadius: 9, border: `1px solid ${BORDER2}`,
            background: SURFACE, color: TEXT, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
            transition: 'background 0.12s',
          }}
        >
          <RefreshCw size={12} strokeWidth={2} /> Rerun
        </button>

        <div style={{ display: 'flex', gap: 6 }}>
          <button
            onClick={onSaveToProfile}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 9, border: `1px solid ${BORDER}`,
              background: 'transparent', color: MUTED, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
          >
            <User size={11} strokeWidth={1.75} /> Save
          </button>
          <button
            onClick={onDownload}
            style={{
              flex: 1, padding: '8px 0', borderRadius: 9, border: `1px solid ${BORDER}`,
              background: 'transparent', color: MUTED, fontSize: 11, fontWeight: 600,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
            }}
          >
            <Download size={11} strokeWidth={1.75} /> Download
          </button>
          <button
            onClick={onDelete}
            style={{
              width: 36, height: 36, borderRadius: 9, border: `1px solid ${BORDER}`,
              background: 'transparent', color: 'rgba(239,68,68,0.6)', fontSize: 11,
              cursor: 'pointer', fontFamily: 'inherit',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <Trash2 size={12} strokeWidth={1.75} />
          </button>
        </div>

        <button
          onClick={onSubmitToProject}
          style={{
            width: '100%', padding: '9px 0', borderRadius: 9,
            border: `1px solid ${ORANGE}40`, background: `${ORANGE}12`,
            color: ORANGE, fontSize: 12, fontWeight: 700,
            cursor: 'pointer', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
          }}
        >
          <Briefcase size={12} strokeWidth={1.75} /> Submit to Project
        </button>
      </div>
    </div>
  );
}

// ─── Inner implementation (wrapped by error boundary below) ──────────────────
function StudioV2Inner() {
  // Creation form
  const [mode,         setMode]         = useState<CreationMode>('video');
  const [vidModel,     setVidModel]     = useState(VID_MODELS[0].id);
  const [vidPrompt,    setVidPrompt]    = useState('');
  const [vidDuration,  setVidDuration]  = useState('6s');
  const [vidRatio,     setVidRatio]     = useState('9:16');
  const [vidRes,       setVidRes]       = useState('1080p');
  const [vidSound,     setVidSound]     = useState<'On' | 'Off'>('On');
  const [vidAssets,    setVidAssets]    = useState<string[]>([PRODUCT_IMAGES[0], PRODUCT_IMAGES[1]]);
  const [vidGenerating,setVidGenerating]= useState(false);

  const [imgModel,     setImgModel]     = useState(IMG_MODELS[0].id);
  const [imgPrompt,    setImgPrompt]    = useState('');
  const [imgRatio,     setImgRatio]     = useState('1:1');
  const [imgAssets,    setImgAssets]    = useState<string[]>([PRODUCT_IMAGES[0]]);
  const [imgGenerating,setImgGenerating]= useState(false);

  // Feed
  const [items,        setItems]        = useState<GenItem[]>([]);
  const [selectedId,   setSelectedId]   = useState<string | null>(null);
  const [liked,        setLiked]        = useState<Set<string>>(new Set());
  const [historyTab,   setHistoryTab]   = useState<HistoryTab>('all');
  const [viewMode,     setViewMode]     = useState<ViewMode>('list');
  const [search,       setSearch]       = useState('');
  const [openMenuId,   setOpenMenuId]   = useState<string | null>(null);

  // Toast
  const [toast,        setToast]        = useState<string | null>(null);

  // Asset picker
  const [pickerOpen,   setPickerOpen]   = useState(false);

  useEffect(() => {
    try {
      const vids = (loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS) ?? DEMO_VIDEO_GENS)
        .map(g => ({ ...g, kind: 'video' as const }));
      const imgs = (loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS) ?? DEMO_IMAGE_GENS)
        .map(g => ({ ...g, kind: 'image' as const }));
      const merged: GenItem[] = [...vids, ...imgs].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setItems(merged);
      if (merged.length > 0) setSelectedId(merged[0].id);
    } catch {
      setItems(DEMO_VIDEO_GENS.map(g => ({ ...g, kind: 'video' as const })));
    }
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  function toggleLike(id: string) {
    setLiked(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }

  function deleteItem(id: string) {
    setItems(prev => prev.filter(i => i.id !== id));
    if (selectedId === id) setSelectedId(null);
  }

  async function handleGenerateVideo() {
    if (vidGenerating) return;
    const modelDef = VID_MODELS.find(m => m.id === vidModel) ?? VID_MODELS[0];
    subtractCredits(modelDef.creditNum);
    setVidGenerating(true);
    await new Promise(r => setTimeout(r, 2000));
    const base = DEMO_VIDEO_GENS[Math.floor(Math.random() * DEMO_VIDEO_GENS.length)];
    const newGen: VideoGeneration = {
      id: `vid-${Date.now()}`,
      prompt: vidPrompt || 'AI video generation',
      model: modelDef.label,
      duration: vidDuration,
      aspectRatio: vidRatio,
      resolution: vidRes,
      videoSrc: base.videoSrc,
      referenceImages: vidAssets.slice(0, 3),
      createdAt: new Date().toISOString(),
    };
    saveToLS(LS_VIDEO_GENS, [newGen, ...loadFromLS<VideoGeneration>(LS_VIDEO_GENS, DEMO_VIDEO_GENS)]);
    const newItem: GenItem = { ...newGen, kind: 'video' };
    setItems(prev => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setVidGenerating(false);
    showToast('Video generation complete');
  }

  async function handleGenerateImage() {
    if (imgGenerating) return;
    const modelDef = IMG_MODELS.find(m => m.id === imgModel) ?? IMG_MODELS[0];
    subtractCredits(modelDef.creditNum);
    setImgGenerating(true);
    await new Promise(r => setTimeout(r, 1800));
    const base = DEMO_IMAGE_GENS[Math.floor(Math.random() * DEMO_IMAGE_GENS.length)];
    const newGen: ImageGeneration = {
      id: `img-${Date.now()}`,
      prompt: imgPrompt || 'AI image generation',
      model: modelDef.label,
      aspectRatio: imgRatio,
      numImages: 1,
      imageSrc: base.imageSrc,
      selectedAssets: imgAssets.slice(0, 3),
      createdAt: new Date().toISOString(),
    };
    saveToLS(LS_IMAGE_GENS, [newGen, ...loadFromLS<ImageGeneration>(LS_IMAGE_GENS, DEMO_IMAGE_GENS)]);
    const newItem: GenItem = { ...newGen, kind: 'image' };
    setItems(prev => [newItem, ...prev]);
    setSelectedId(newItem.id);
    setImgGenerating(false);
    showToast('Image generation complete');
  }

  const filtered = items.filter(item => {
    if (historyTab === 'videos'    && item.kind !== 'video') return false;
    if (historyTab === 'images'    && item.kind !== 'image') return false;
    if (historyTab === 'favorites' && !liked.has(item.id))   return false;
    if (search && !item.prompt.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const selectedItem = items.find(i => i.id === selectedId) ?? null;
  const generating   = mode === 'video' ? vidGenerating : imgGenerating;
  const activeAssets = mode === 'video' ? vidAssets : imgAssets;

  const vidModelDef = VID_MODELS.find(m => m.id === vidModel) ?? VID_MODELS[0];
  const imgModelDef = IMG_MODELS.find(m => m.id === imgModel) ?? IMG_MODELS[0];

  return (
    <>
      <style>{`
        .sv2-root * { box-sizing: border-box; }
        .sv2-root textarea { resize: none; }
        .sv2-root button { font-family: inherit; }
        .sv2-root ::-webkit-scrollbar { width: 4px; }
        .sv2-root ::-webkit-scrollbar-track { background: transparent; }
        .sv2-root ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.12); border-radius: 2px; }
        @keyframes sv2-spin { to { transform: rotate(360deg); } }
        @keyframes sv2-pulse { 0%,100% { opacity:0.5 } 50% { opacity:1 } }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 28, right: 28, zIndex: 9999,
          background: '#1a1a1a', border: `1px solid ${LIME}30`,
          borderRadius: 10, padding: '9px 14px',
          display: 'flex', alignItems: 'center', gap: 7,
          fontSize: 12.5, fontWeight: 600, color: LIME,
          boxShadow: '0 8px 28px rgba(0,0,0,0.5)',
        }}>
          <CheckCircle size={13} strokeWidth={2.5} /> {toast}
        </div>
      )}

      {/* Asset picker modal */}
      {pickerOpen && (
        <AssetPickerModal
          onClose={() => setPickerOpen(false)}
          onSelect={(urls: string[]) => {
            if (mode === 'video') {
              setVidAssets(urls);
            } else {
              setImgAssets(urls);
            }
          }}
          initialSelected={activeAssets}
        />
      )}

      {/* Workspace root */}
      <div
        className="sv2-root"
        onClick={() => setOpenMenuId(null)}
        style={{
          display: 'grid',
          gridTemplateColumns: '300px minmax(0, 1fr) 260px',
          height: 'calc(100dvh - 52px)',
          background: BG,
          color: TEXT,
          overflow: 'hidden',
          fontFamily: 'inherit',
        }}
      >

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* LEFT RAIL — creation controls                               */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <aside style={{
          borderRight: `1px solid ${BORDER}`,
          background: RAIL,
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden',
        }}>
          {/* Mode tabs */}
          <div style={{ padding: '12px 12px 0', flexShrink: 0 }}>
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${BORDER}`, borderRadius: 10, padding: 3, gap: 2,
            }}>
              {(['video', 'image'] as const).map(m => (
                <button
                  key={m}
                  onClick={() => setMode(m)}
                  style={{
                    flex: 1, padding: '7px 0', borderRadius: 7, border: 'none',
                    cursor: 'pointer', fontSize: 12, fontWeight: mode === m ? 700 : 500,
                    background: mode === m
                      ? (m === 'video' ? `${ORANGE}22` : `${LIME}18`)
                      : 'transparent',
                    color: mode === m ? (m === 'video' ? ORANGE : LIME) : FAINT,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    transition: 'all 0.12s',
                  }}
                >
                  {m === 'video'
                    ? <Video size={12} strokeWidth={1.75} />
                    : <ImageIcon size={12} strokeWidth={1.75} />}
                  Create {m === 'video' ? 'Video' : 'Image'}
                </button>
              ))}
            </div>
          </div>

          {/* Scrollable form body */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '14px 14px 24px' }}>
            {mode === 'video' ? (
              /* ── VIDEO FORM ──────────────────────────────────────── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* 1. Prompt */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 7 }}>Prompt</div>
                  <textarea
                    value={vidPrompt}
                    onChange={e => setVidPrompt(e.target.value)}
                    rows={5}
                    placeholder="Describe your scene. What's happening, who's in it, the mood, setting, and style."
                    style={{
                      width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                      borderRadius: 10, padding: '10px 11px', color: TEXT,
                      fontSize: 12, fontFamily: 'inherit', outline: 'none', lineHeight: 1.65,
                    }}
                  />
                </div>

                {/* 2. Reference Assets */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Reference Assets</div>
                    <button
                      onClick={() => setPickerOpen(true)}
                      style={{ fontSize: 10, fontWeight: 600, color: FAINT, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                    >
                      <Plus size={10} strokeWidth={2} /> Add
                    </button>
                  </div>
                  {vidAssets.length > 0 ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      {vidAssets.slice(0, 4).map((src, i) => (
                        <div key={i} style={{ width: 46, height: 46, borderRadius: 8, overflow: 'hidden', border: `1.5px solid rgba(255,92,0,0.30)`, flexShrink: 0, position: 'relative' }}>
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                      {vidAssets.length < 4 && (
                        <button onClick={() => setPickerOpen(true)} style={{ width: 46, height: 46, borderRadius: 8, flexShrink: 0, border: `1.5px dashed rgba(255,255,255,0.14)`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Plus size={13} strokeWidth={1.75} color={FAINT} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setPickerOpen(true)}
                      style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1.5px dashed rgba(255,255,255,0.12)`, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                    >
                      <Plus size={16} strokeWidth={1.5} color={FAINT} />
                      <span style={{ fontSize: 11, color: FAINT, fontWeight: 500 }}>Add product images or brand assets</span>
                    </button>
                  )}
                </div>

                {/* 3. Model */}
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 6 }}>AI Model</div>
                  <ModelDropdown models={VID_MODELS} value={vidModel} onChange={setVidModel} />
                </div>

                {/* 4. Output settings */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 12 }}>Output</div>

                  {/* Duration */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: FAINT, marginBottom: 6, fontWeight: 500 }}>Duration</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {VID_DURATIONS.map(d => (
                        <button key={d} onClick={() => setVidDuration(d)}
                          style={{
                            flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${vidDuration === d ? ORANGE : BORDER}`,
                            background: vidDuration === d ? `${ORANGE}16` : SURFACE,
                            color: vidDuration === d ? ORANGE : FAINT,
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s',
                          }}>{d}</button>
                      ))}
                    </div>
                  </div>

                  {/* Format */}
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 10, color: FAINT, marginBottom: 6, fontWeight: 500 }}>Format</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      {VID_FORMATS.map(fmt => {
                        const { w, h } = ratioParts(fmt.value);
                        const scale = 11 / Math.max(w, h);
                        const active = vidRatio === fmt.value;
                        return (
                          <button key={fmt.value} onClick={() => setVidRatio(fmt.value)}
                            style={{
                              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                              gap: 5, padding: '10px 4px', borderRadius: 9,
                              border: `1px solid ${active ? LIME : BORDER}`,
                              background: active ? `${LIME}10` : SURFACE,
                              cursor: 'pointer', transition: 'all 0.12s',
                            }}
                          >
                            <div style={{
                              width: Math.round(w * scale), height: Math.round(h * scale),
                              border: `1.5px solid ${active ? LIME : 'rgba(255,255,255,0.25)'}`,
                              borderRadius: 2, background: active ? `${LIME}18` : 'transparent', flexShrink: 0,
                            }} />
                            <div style={{ textAlign: 'center' }}>
                              <div style={{ fontSize: 10, fontWeight: 700, color: active ? LIME : MUTED, lineHeight: 1.2 }}>{fmt.label}</div>
                              <div style={{ fontSize: 8.5, color: FAINT, marginTop: 1 }}>{fmt.platform}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Resolution */}
                  <div>
                    <div style={{ fontSize: 10, color: FAINT, marginBottom: 6, fontWeight: 500 }}>Resolution</div>
                    <div style={{ display: 'flex', gap: 5 }}>
                      {VID_RES.map(r => (
                        <button key={r} onClick={() => setVidRes(r)}
                          style={{
                            flex: 1, padding: '7px 0', borderRadius: 8, border: `1px solid ${vidRes === r ? LIME : BORDER}`,
                            background: vidRes === r ? `${LIME}12` : SURFACE,
                            color: vidRes === r ? LIME : FAINT,
                            fontSize: 12, fontWeight: 700, cursor: 'pointer', transition: 'all 0.12s',
                          }}>{r}</button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 5. Generate */}
                <button
                  onClick={handleGenerateVideo}
                  disabled={vidGenerating}
                  style={{
                    width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                    cursor: vidGenerating ? 'default' : 'pointer',
                    background: vidGenerating ? `${LIME}22` : LIME,
                    color: vidGenerating ? LIME : '#0a0a0a',
                    fontSize: 13, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    transition: 'opacity 0.15s', marginTop: 2,
                  }}
                >
                  {vidGenerating ? (
                    <><Sparkles size={13} strokeWidth={2} style={{ animation: 'sv2-spin 1s linear infinite' }} /> Generating...</>
                  ) : (
                    <>Generate Video <span style={{ opacity: 0.55, fontWeight: 500, fontSize: 12 }}>· {vidModelDef.credits}</span></>
                  )}
                </button>

              </div>
            ) : (
              /* ── IMAGE FORM ──────────────────────────────────────── */
              <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

                {/* 1. Prompt */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 7 }}>Prompt</div>
                  <textarea
                    value={imgPrompt}
                    onChange={e => setImgPrompt(e.target.value)}
                    rows={5}
                    placeholder="Describe your scene. Product, setting, mood, lighting, and style."
                    style={{
                      width: '100%', background: SURFACE, border: `1px solid ${BORDER}`,
                      borderRadius: 10, padding: '10px 11px', color: TEXT,
                      fontSize: 12, fontFamily: 'inherit', outline: 'none', lineHeight: 1.65,
                    }}
                  />
                </div>

                {/* 2. Reference Assets */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: MUTED }}>Reference Assets</div>
                    <button
                      onClick={() => setPickerOpen(true)}
                      style={{ fontSize: 10, fontWeight: 600, color: FAINT, background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 3 }}
                    >
                      <Plus size={10} strokeWidth={2} /> Add
                    </button>
                  </div>
                  {imgAssets.length > 0 ? (
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                      {imgAssets.slice(0, 4).map((src, i) => (
                        <div key={i} style={{ width: 46, height: 46, borderRadius: 8, overflow: 'hidden', border: `1.5px solid rgba(163,230,53,0.28)`, flexShrink: 0 }}>
                          <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        </div>
                      ))}
                      {imgAssets.length < 4 && (
                        <button onClick={() => setPickerOpen(true)} style={{ width: 46, height: 46, borderRadius: 8, flexShrink: 0, border: `1.5px dashed rgba(255,255,255,0.14)`, background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                          <Plus size={13} strokeWidth={1.75} color={FAINT} />
                        </button>
                      )}
                    </div>
                  ) : (
                    <button
                      onClick={() => setPickerOpen(true)}
                      style={{ width: '100%', padding: '12px', borderRadius: 10, border: `1.5px dashed rgba(255,255,255,0.12)`, background: 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}
                    >
                      <Plus size={16} strokeWidth={1.5} color={FAINT} />
                      <span style={{ fontSize: 11, color: FAINT, fontWeight: 500 }}>Add product images or brand assets</span>
                    </button>
                  )}
                </div>

                {/* 3. Model */}
                <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 16 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 6 }}>AI Model</div>
                  <ModelDropdown models={IMG_MODELS} value={imgModel} onChange={setImgModel} />
                </div>

                {/* 4. Format */}
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: MUTED, marginBottom: 8 }}>Format</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 5 }}>
                    {IMG_FORMATS.map(fmt => {
                      const { w, h } = ratioParts(fmt.value);
                      const scale = 10 / Math.max(w, h);
                      const active = imgRatio === fmt.value;
                      return (
                        <button key={fmt.value} onClick={() => setImgRatio(fmt.value)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: 5, padding: '9px 4px', borderRadius: 9,
                            border: `1px solid ${active ? LIME : BORDER}`,
                            background: active ? `${LIME}10` : SURFACE,
                            cursor: 'pointer', transition: 'all 0.12s',
                          }}
                        >
                          <div style={{
                            width: Math.round(w * scale), height: Math.round(h * scale),
                            border: `1.5px solid ${active ? LIME : 'rgba(255,255,255,0.22)'}`,
                            borderRadius: 2, background: active ? `${LIME}18` : 'transparent', flexShrink: 0,
                          }} />
                          <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: 9, fontWeight: 700, color: active ? LIME : MUTED, lineHeight: 1.2 }}>{fmt.label}</div>
                            <div style={{ fontSize: 7.5, color: FAINT, marginTop: 1 }}>{fmt.value}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 5. Generate */}
                <button
                  onClick={handleGenerateImage}
                  disabled={imgGenerating}
                  style={{
                    width: '100%', padding: '13px 0', borderRadius: 10, border: 'none',
                    cursor: imgGenerating ? 'default' : 'pointer',
                    background: imgGenerating ? `${LIME}22` : LIME,
                    color: imgGenerating ? LIME : '#0a0a0a',
                    fontSize: 13, fontWeight: 800,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
                    marginTop: 2,
                  }}
                >
                  {imgGenerating ? (
                    <><Sparkles size={13} strokeWidth={2} style={{ animation: 'sv2-spin 1s linear infinite' }} /> Generating...</>
                  ) : (
                    <>Generate Image <span style={{ opacity: 0.55, fontWeight: 500, fontSize: 12 }}>· {imgModelDef.credits}</span></>
                  )}
                </button>

              </div>
            )}
          </div>
        </aside>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* CENTER — history toolbar + vertical generation feed         */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <main style={{
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', background: BG,
        }}>

          {/* Center toolbar */}
          <div style={{
            padding: '8px 18px', borderBottom: `1px solid ${BORDER}`,
            display: 'flex', alignItems: 'center', gap: 8,
            flexShrink: 0, background: RAIL,
          }}>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 11px', borderRadius: 7, border: `1px solid ${BORDER2}`,
              background: 'rgba(255,255,255,0.07)', color: TEXT,
              fontSize: 12, fontWeight: 700, cursor: 'pointer',
            }}>
              <List size={12} strokeWidth={2} /> History
            </button>
            <button style={{
              display: 'flex', alignItems: 'center', gap: 5,
              padding: '5px 10px', borderRadius: 7, border: '1px solid transparent',
              background: 'transparent', color: FAINT, fontSize: 12, fontWeight: 500, cursor: 'pointer',
            }}>
              <Info size={12} strokeWidth={1.75} /> How it works
            </button>

            {/* Filter tabs */}
            <div style={{
              display: 'flex', background: 'rgba(255,255,255,0.03)',
              border: `1px solid ${BORDER}`, borderRadius: 7, padding: 2, gap: 1,
            }}>
              {(['all', 'videos', 'images', 'favorites'] as const).map(t => (
                <button
                  key={t}
                  onClick={() => setHistoryTab(t)}
                  style={{
                    padding: '3px 9px', borderRadius: 5, border: 'none', cursor: 'pointer',
                    fontSize: 11, fontWeight: historyTab === t ? 700 : 400,
                    background: historyTab === t ? 'rgba(255,255,255,0.09)' : 'transparent',
                    color: historyTab === t ? TEXT : FAINT,
                    whiteSpace: 'nowrap', transition: 'all 0.1s',
                  }}
                >
                  {t.charAt(0).toUpperCase() + t.slice(1)}
                </button>
              ))}
            </div>

            <div style={{ flex: 1 }} />

            {/* Search */}
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: 7, padding: '4px 9px',
            }}>
              <Search size={11} color={FAINT} strokeWidth={1.75} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search prompts..."
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  fontSize: 11, color: MUTED, width: 120, fontFamily: 'inherit',
                }}
              />
            </div>

            {/* View toggle */}
            <div style={{
              display: 'flex', background: SURFACE, border: `1px solid ${BORDER}`,
              borderRadius: 7, padding: 2, gap: 1,
            }}>
              {(['list', 'grid'] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setViewMode(v)}
                  style={{
                    width: 26, height: 26, borderRadius: 5, border: 'none', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: viewMode === v ? 'rgba(255,255,255,0.09)' : 'transparent',
                  }}
                >
                  {v === 'list'
                    ? <List size={12} color={viewMode === v ? TEXT : FAINT} strokeWidth={1.75} />
                    : <LayoutGrid size={12} color={viewMode === v ? TEXT : FAINT} strokeWidth={1.75} />}
                </button>
              ))}
            </div>
          </div>

          {/* Generating banner */}
          {generating && (
            <div style={{
              margin: '12px 18px 0', flexShrink: 0,
              background: 'rgba(163,230,53,0.05)', border: `1px solid ${LIME}20`,
              borderRadius: 10, padding: '10px 14px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <Sparkles
                size={13} color={LIME} strokeWidth={2}
                style={{ animation: 'sv2-spin 1s linear infinite', flexShrink: 0 }}
              />
              <span style={{ fontSize: 12, color: TEXT, fontWeight: 600 }}>
                {mode === 'image' ? 'Generating image' : 'Generating video'}
                <span style={{ fontWeight: 400, color: MUTED }}>
                  {' '}&mdash;{' '}
                  {mode === 'video'
                    ? (VID_MODELS.find(m => m.id === vidModel)?.label ?? '')
                    : (IMG_MODELS.find(m => m.id === imgModel)?.label ?? '')}
                </span>
              </span>
            </div>
          )}

          {/* Feed */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 18px 32px' }}>
            {filtered.length === 0 ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center',
                justifyContent: 'center', minHeight: 360, gap: 12, textAlign: 'center',
              }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 13, background: SURFACE,
                  border: `1px solid ${BORDER}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Sparkles size={20} color="rgba(255,255,255,0.10)" strokeWidth={1.75} />
                </div>
                <p style={{ fontSize: 14, fontWeight: 600, color: FAINT }}>No generations yet.</p>
                <p style={{ fontSize: 12, color: FAINT, maxWidth: 220, lineHeight: 1.5 }}>
                  Use the creation rail to generate your first video or image.
                </p>
              </div>

            ) : viewMode === 'list' ? (

              /* ── Vertical feed ───────────────────────────────────── */
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {filtered.map((item, idx) => {
                  const isSelected = selectedId === item.id;
                  const vidItem    = item.kind === 'video' ? (item as VideoGeneration) : null;
                  const rawRatio   = vidItem
                    ? (vidItem.aspectRatio ?? '9:16')
                    : ((item as ImageGeneration).aspectRatio ?? '1:1');
                  const ratio      = normalizeRatio(rawRatio);
                  const { w, h }   = ratioParts(ratio);

                  // We use a fixed height for the feed item media area to keep the feed
                  // consistent. 9:16 gets ~400px, others scale proportionally.
                  const MEDIA_H    = 440;
                  const mediaW     = Math.round(MEDIA_H * (w / h));

                  return (
                    <div key={item.id}>
                      {idx > 0 && (
                        <div style={{ height: 1, background: BORDER }} />
                      )}

                      <div
                        onClick={() => setSelectedId(item.id)}
                        style={{
                          padding: '20px 0',
                          cursor: 'pointer',
                          display: 'flex', flexDirection: 'column',
                        }}
                      >
                        {/* Row: [dark gutter] [media] [dark gutter with icons] */}
                        <div style={{
                          display: 'flex', justifyContent: 'center',
                          alignItems: 'flex-start', gap: 0, position: 'relative',
                        }}>

                          {/* Selection circle — top left of media */}
                          <div style={{
                            position: 'absolute',
                            left: `calc(50% - ${Math.round(mediaW / 2)}px + 10px)`,
                            top: 10, zIndex: 2,
                          }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: '50%',
                              border: `2px solid ${isSelected ? LIME : 'rgba(255,255,255,0.35)'}`,
                              background: isSelected ? LIME : 'rgba(0,0,0,0.4)',
                              backdropFilter: 'blur(4px)',
                              transition: 'all 0.12s',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {isSelected && <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#0a0a0a' }} />}
                            </div>
                          </div>

                          {/* Quick-action icons — right of media */}
                          <div style={{
                            position: 'absolute',
                            left: `calc(50% + ${Math.round(mediaW / 2)}px + 6px)`,
                            top: 8, zIndex: 2,
                            display: 'flex', flexDirection: 'column', gap: 5,
                          }}
                            onClick={e => e.stopPropagation()}
                          >
                            {/* Heart */}
                            <button
                              onClick={() => { toggleLike(item.id); showToast(liked.has(item.id) ? 'Removed from favorites' : 'Added to favorites'); }}
                              style={{
                                width: 30, height: 30, borderRadius: 8, border: `1px solid ${liked.has(item.id) ? 'rgba(239,68,68,0.35)' : BORDER}`,
                                background: liked.has(item.id) ? 'rgba(239,68,68,0.12)' : SURFACE,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                transition: 'all 0.12s',
                              }}
                            >
                              <Heart size={13} strokeWidth={1.75}
                                color={liked.has(item.id) ? '#ef4444' : MUTED}
                                fill={liked.has(item.id) ? '#ef4444' : 'none'}
                              />
                            </button>
                            {/* Copy */}
                            <button
                              onClick={() => showToast('Prompt copied')}
                              style={{
                                width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`,
                                background: SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                              }}
                            >
                              <Copy size={13} strokeWidth={1.75} color={MUTED} />
                            </button>
                            {/* Download */}
                            <button
                              onClick={() => showToast('Downloading...')}
                              style={{
                                width: 30, height: 30, borderRadius: 8, border: `1px solid ${BORDER}`,
                                background: SURFACE, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                              }}
                            >
                              <Download size={13} strokeWidth={1.75} color={MUTED} />
                            </button>
                            {/* More */}
                            <div style={{ position: 'relative' }}>
                              <button
                                onClick={() => setOpenMenuId(openMenuId === item.id ? null : item.id)}
                                style={{
                                  width: 30, height: 30, borderRadius: 8,
                                  border: `1px solid ${openMenuId === item.id ? BORDER2 : BORDER}`,
                                  background: openMenuId === item.id ? 'rgba(255,255,255,0.09)' : SURFACE,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                                }}
                              >
                                <MoreHorizontal size={13} color={MUTED} />
                              </button>
                              {openMenuId === item.id && (
                                <div
                                  onClick={e => e.stopPropagation()}
                                  style={{
                                    position: 'absolute', top: 0, left: 'calc(100% + 5px)',
                                    background: '#1e1e1e', border: `1px solid ${BORDER2}`,
                                    borderRadius: 10, zIndex: 200, overflow: 'hidden', minWidth: 160,
                                    boxShadow: '0 8px 28px rgba(0,0,0,0.7)',
                                  }}
                                >
                                  {[
                                    { label: 'Rerun',           icon: RefreshCw, action: () => { showToast('Rerunning...'); setOpenMenuId(null); } },
                                    { label: 'Save to Profile', icon: User,      action: () => { showToast('Saved to Profile'); setOpenMenuId(null); } },
                                    { label: 'Copy Prompt',     icon: Copy,      action: () => { showToast('Prompt copied'); setOpenMenuId(null); } },
                                    { label: 'Download',        icon: Download,  action: () => { showToast('Downloading...'); setOpenMenuId(null); } },
                                    { label: liked.has(item.id) ? 'Unfavorite' : 'Favorite', icon: Heart, action: () => { toggleLike(item.id); setOpenMenuId(null); } },
                                    { label: 'Delete',          icon: Trash2,    action: () => { deleteItem(item.id); setOpenMenuId(null); } },
                                  ].map(({ label, icon: Icon, action }) => (
                                    <button
                                      key={label}
                                      onClick={action}
                                      style={{
                                        width: '100%', display: 'flex', alignItems: 'center', gap: 8,
                                        padding: '8px 13px', background: 'transparent', border: 'none',
                                        color: label === 'Delete' ? '#ef4444' : MUTED,
                                        fontSize: 12, fontWeight: 500, cursor: 'pointer',
                                        borderBottom: `1px solid ${BORDER}`,
                                      }}
                                    >
                                      <Icon size={12} strokeWidth={1.75} /> {label}
                                    </button>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Media */}
                          <div style={{
                            width: mediaW, height: MEDIA_H, flexShrink: 0,
                            borderRadius: 12, overflow: 'hidden',
                            background: '#060606',
                            outline: isSelected ? `2px solid ${LIME}40` : '2px solid transparent',
                            outlineOffset: 1,
                            transition: 'outline-color 0.15s',
                            position: 'relative',
                          }}>
                            {item.kind === 'video' ? (
                              <HoverVideoPreview
                                src={(item as VideoGeneration).videoSrc}
                                autoPlay loop
                                style={{ width: '100%', height: '100%' }}
                              />
                            ) : (
                              <img
                                src={(item as ImageGeneration).imageSrc}
                                alt=""
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            )}

                            {/* Play icon for videos */}
                            {item.kind === 'video' && (
                              <div style={{
                                position: 'absolute', inset: 0,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                pointerEvents: 'none',
                              }}>
                                <div style={{
                                  width: 40, height: 40, borderRadius: '50%',
                                  background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(4px)',
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: 0.8,
                                }}>
                                  <Play size={14} color="#fff" fill="#fff" />
                                </div>
                              </div>
                            )}

                            {/* Type badge */}
                            <div style={{
                              position: 'absolute', bottom: 10, left: 10,
                              display: 'flex', alignItems: 'center', gap: 5,
                            }}>
                              <span style={{
                                fontSize: 8, fontWeight: 800,
                                background: item.kind === 'video' ? `${ORANGE}cc` : 'rgba(163,230,53,0.88)',
                                color: item.kind === 'video' ? '#fff' : '#0a0a0a',
                                borderRadius: 4, padding: '2px 6px',
                                textTransform: 'uppercase',
                              }}>
                                {item.kind === 'video' ? 'Video' : 'Image'}
                              </span>
                            </div>
                          </div>

                        </div>

                        {/* Caption row below media */}
                        <div style={{
                          display: 'flex', justifyContent: 'center',
                          marginTop: 10,
                        }}>
                          <div style={{
                            width: mediaW, display: 'flex', alignItems: 'center', gap: 8,
                          }}>
                            <span style={{ fontSize: 10.5, color: FAINT, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              {item.prompt || '—'}
                            </span>
                            <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.18)', flexShrink: 0 }}>
                              {formatGenDate(item.createdAt)}
                            </span>
                          </div>
                        </div>

                      </div>
                    </div>
                  );
                })}
              </div>

            ) : (

              /* ── Grid view ───────────────────────────────────────── */
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: 8, paddingTop: 14,
              }}>
                {filtered.map(item => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedId(item.id)}
                      style={{
                        background: SURFACE,
                        border: `1px solid ${isSelected ? `${LIME}50` : BORDER}`,
                        borderRadius: 10, overflow: 'hidden', cursor: 'pointer',
                        transition: 'border-color 0.15s',
                      }}
                    >
                      <div style={{ position: 'relative', height: 190 }}>
                        {item.kind === 'video' ? (
                          <HoverVideoPreview src={(item as VideoGeneration).videoSrc} autoPlay loop style={{ height: 190 }} />
                        ) : (
                          <img
                            src={(item as ImageGeneration).imageSrc}
                            alt=""
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />
                        )}
                        <span style={{
                          position: 'absolute', top: 7, left: 7,
                          fontSize: 8, fontWeight: 800,
                          background: item.kind === 'video' ? `${ORANGE}cc` : 'rgba(163,230,53,0.9)',
                          color: item.kind === 'video' ? '#fff' : '#0a0a0a',
                          borderRadius: 4, padding: '2px 6px', textTransform: 'uppercase',
                        }}>
                          {item.kind}
                        </span>
                      </div>
                      <div style={{ padding: '7px 10px' }}>
                        <div style={{ fontSize: 9.5, fontWeight: 600, color: FAINT, marginBottom: 2 }}>{item.model}</div>
                        <div style={{ fontSize: 10.5, color: MUTED, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.prompt || '—'}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            )}
          </div>
        </main>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* RIGHT PANEL — selected generation details                   */}
        {/* ═══════════════════════════════════════════════════════════ */}
        <aside style={{
          borderLeft: `1px solid ${BORDER}`,
          background: PANEL,
          overflow: 'hidden',
        }}>
          <RightPanel
            item={selectedItem}
            liked={selectedItem ? liked.has(selectedItem.id) : false}
            onLike={() => selectedItem && toggleLike(selectedItem.id)}
            onRerun={() => showToast('Rerunning generation...')}
            onDownload={() => showToast('Downloading...')}
            onDelete={() => selectedItem && deleteItem(selectedItem.id)}
            onSaveToProfile={() => showToast('Saved to Profile')}
            onSubmitToProject={() => showToast('Submitted to Project')}
            showToast={showToast}
          />
        </aside>

      </div>
    </>
  );
}

// ─── Main export — wrapped in error boundary ──────────────────────────────────
export default function StudioV2() {
  return (
    <StudioErrorBoundary>
      <StudioV2Inner />
    </StudioErrorBoundary>
  );
}
