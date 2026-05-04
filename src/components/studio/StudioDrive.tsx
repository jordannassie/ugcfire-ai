'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { FireCreatorProfile } from '@/components/studio/StudioWorkspace'
import {
  Folder, FolderOpen, FolderPlus, Upload, MoreHorizontal, Trash2,
  Pencil, MoveRight, Download, File, Image as ImageIcon, Video,
  FileText, ChevronRight, Home, X, Check, Loader2, AlertCircle,
  Search, ArrowUpDown, Send, MessageCircle, CheckCircle2, RotateCcw,
  Truck, Archive, Eye, Plus,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileStatus =
  | 'uploaded'
  | 'ready_for_review'
  | 'approved'
  | 'revision_requested'
  | 'delivered'
  | 'archived'

interface StudioFolder {
  id: string
  company_id: string
  name: string
  parent_folder_id: string | null
  created_at: string
}

interface StudioFile {
  id: string
  company_id: string
  folder_id: string | null
  name: string
  storage_path: string
  file_url: string | null
  mime_type: string | null
  file_size: number | null
  status: FileStatus
  created_at: string
}

interface StudioComment {
  id: string
  file_id: string | null
  sender_role: 'client' | 'admin'
  sender_name: string | null
  message: string
  created_at: string
}

interface Crumb { id: string | null; name: string }

type ModalType =
  | 'new-folder' | 'upload' | 'rename-folder' | 'rename-file'
  | 'move-folder' | 'move-file' | 'delete-folder' | 'delete-file'
  | null

// ─── Status config ────────────────────────────────────────────────────────────

const STATUS_MAP: Record<FileStatus, { label: string; classes: string }> = {
  uploaded:           { label: 'Uploaded',           classes: 'text-white/50 bg-white/6 border-white/10' },
  ready_for_review:   { label: 'Needs Review',        classes: 'text-blue-400 bg-blue-500/10 border-blue-500/20' },
  approved:           { label: 'Approved',             classes: 'text-green-400 bg-green-500/10 border-green-500/20' },
  revision_requested: { label: 'Revision Requested',  classes: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
  delivered:          { label: 'Delivered',            classes: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
  archived:           { label: 'Archived',             classes: 'text-white/20 bg-white/3 border-white/6' },
}

function StatusChip({ status }: { status: FileStatus }) {
  const cfg = STATUS_MAP[status] ?? STATUS_MAP.uploaded
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.classes}`}>
      {cfg.label}
    </span>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(n: number | null) {
  if (!n) return ''
  if (n < 1024) return `${n} B`
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`
  return `${(n / (1024 * 1024)).toFixed(1)} MB`
}

function formatDate(s: string) {
  return new Date(s).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function formatTime(s: string) {
  return new Date(s).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
}

function FileIcon({ mime, size = 28 }: { mime: string | null; size?: number }) {
  if (!mime) return <File size={size} className="text-white/25" />
  if (mime.startsWith('image/')) return <ImageIcon size={size} className="text-blue-400" />
  if (mime.startsWith('video/')) return <Video size={size} className="text-purple-400" />
  if (mime === 'application/pdf') return <FileText size={size} className="text-red-400" />
  return <File size={size} className="text-white/25" />
}

function safeName(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, '_').replace(/_{2,}/g, '_')
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function Modal({ title, onClose, children, wide }: {
  title: string; onClose: () => void; children: React.ReactNode; wide?: boolean
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75" onClick={onClose}>
      <div
        className={`bg-[#111] border border-white/12 rounded-2xl p-6 w-full shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}`}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-semibold">{title}</p>
          <button onClick={onClose} className="text-white/30 hover:text-white transition"><X size={16} /></button>
        </div>
        {children}
      </div>
    </div>
  )
}

// ─── Three-dot menu ───────────────────────────────────────────────────────────

function ItemMenu({ items }: { items: { label: string; icon: React.ReactNode; onClick: () => void; danger?: boolean }[] }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    function close(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [open])
  return (
    <div ref={ref} className="relative" onClick={e => e.stopPropagation()}>
      <button onClick={() => setOpen(p => !p)} className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white/80 transition">
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#1c1c1c] border border-white/12 rounded-xl shadow-2xl py-1 min-w-[152px] z-50">
          {items.map(item => (
            <button key={item.label} onClick={() => { item.onClick(); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition hover:bg-white/6 ${item.danger ? 'text-red-400 hover:text-red-300' : 'text-white/70 hover:text-white'}`}>
              {item.icon}{item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Starter folders ─────────────────────────────────────────────────────────

const STARTER_FOLDERS = ['Brand Assets', 'Client Uploads', 'Week 1', 'Week 2', 'Approved Content', 'Revisions']

// ─── Main StudioDrive ─────────────────────────────────────────────────────────

export interface StudioDriveProps {
  companyId: string
  actorId: string
  actorRole: 'client' | 'admin'
  fireCreatorProfile?: FireCreatorProfile
}

export default function StudioDrive({ companyId, actorId, actorRole, fireCreatorProfile }: StudioDriveProps) {

  // ── Navigation ────────────────────────────────────────────────────────────
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: 'Studio' }])
  const currentFolderId = crumbs[crumbs.length - 1].id

  // ── Data ──────────────────────────────────────────────────────────────────
  const [folders, setFolders] = useState<StudioFolder[]>([])
  const [files,   setFiles]   = useState<StudioFile[]>([])
  const [loading, setLoading] = useState(true)
  const [dbError, setDbError] = useState<string | null>(null)

  // ── Selected file detail ──────────────────────────────────────────────────
  const [selectedFile,     setSelectedFile]     = useState<StudioFile | null>(null)
  const [comments,         setComments]         = useState<StudioComment[]>([])
  const [commentsLoading,  setCommentsLoading]  = useState(false)
  const [newComment,       setNewComment]       = useState('')
  const [sendingComment,   setSendingComment]   = useState(false)
  const [statusUpdating,   setStatusUpdating]   = useState(false)

  // ── Search / sort ─────────────────────────────────────────────────────────
  const [search,  setSearch]  = useState('')
  const [sortBy,  setSortBy]  = useState<'name' | 'date'>('date')

  // ── Modal ─────────────────────────────────────────────────────────────────
  const [modal,         setModal]         = useState<ModalType>(null)
  const [modalInput,    setModalInput]    = useState('')
  const [modalWorking,  setModalWorking]  = useState(false)
  const [modalError,    setModalError]    = useState('')
  const [targetFolder,  setTargetFolder]  = useState<StudioFolder | null>(null)
  const [targetFile,    setTargetFile]    = useState<StudioFile | null>(null)

  // ── Move ──────────────────────────────────────────────────────────────────
  const [allFolders,  setAllFolders]  = useState<StudioFolder[]>([])
  const [moveDest,    setMoveDest]    = useState<string | null>('ROOT')

  // ── Upload ────────────────────────────────────────────────────────────────
  const [uploadFileList, setUploadFileList] = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'uploading' | 'done' | 'error'>>({})
  const [uploadErrors,   setUploadErrors]   = useState<Record<string, string>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Load studio ───────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    setDbError(null)
    try {
      const sb = createClient()

      // Always capture the return value of each filter so the query is built correctly
      const folderQ = currentFolderId === null
        ? sb
            .from('studio_folders')
            .select('id, company_id, name, parent_folder_id, created_at')
            .eq('company_id', companyId)
            .is('deleted_at', null)
            .is('parent_folder_id', null)
            .order('name')
        : sb
            .from('studio_folders')
            .select('id, company_id, name, parent_folder_id, created_at')
            .eq('company_id', companyId)
            .is('deleted_at', null)
            .eq('parent_folder_id', currentFolderId)
            .order('name')

      const fileQ = currentFolderId === null
        ? sb
            .from('studio_files')
            .select('id, company_id, folder_id, name, storage_path, file_url, mime_type, file_size, status, created_at')
            .eq('company_id', companyId)
            .is('deleted_at', null)
            .is('folder_id', null)
            .order('created_at', { ascending: false })
        : sb
            .from('studio_files')
            .select('id, company_id, folder_id, name, storage_path, file_url, mime_type, file_size, status, created_at')
            .eq('company_id', companyId)
            .is('deleted_at', null)
            .eq('folder_id', currentFolderId)
            .order('created_at', { ascending: false })

      const [{ data: fData, error: fErr }, { data: fiData, error: fiErr }] = await Promise.all([folderQ, fileQ])

      if (fErr?.code === '42P01' || fiErr?.code === '42P01') {
        setDbError('Studio tables not set up. Please run supabase/migrations/013_studio_drive.sql in your Supabase SQL Editor.')
        return
      }
      if (fErr) throw fErr
      if (fiErr) throw fiErr

      setFolders((fData ?? []) as StudioFolder[])
      setFiles((fiData ?? []) as StudioFile[])
    } catch (err) {
      setDbError(err instanceof Error ? err.message : 'Failed to load studio')
    } finally {
      setLoading(false)
    }
  }, [companyId, currentFolderId])

  useEffect(() => { load() }, [load])

  // ── Load comments for selected file ───────────────────────────────────────
  const loadComments = useCallback(async (fileId: string) => {
    setCommentsLoading(true)
    const sb = createClient()
    const { data } = await sb
      .from('studio_comments')
      .select('id, file_id, sender_role, sender_name, message, created_at')
      .eq('file_id', fileId)
      .order('created_at')
    setComments((data ?? []) as StudioComment[])
    setCommentsLoading(false)
  }, [])

  useEffect(() => {
    if (selectedFile) loadComments(selectedFile.id)
    else setComments([])
  }, [selectedFile, loadComments])

  // ── Load all folders for move modal ───────────────────────────────────────
  async function loadAllFolders() {
    const sb = createClient()
    const { data } = await sb
      .from('studio_folders')
      .select('id, name, parent_folder_id, company_id, created_at')
      .eq('company_id', companyId)
      .is('deleted_at', null)
      .order('name')
    setAllFolders((data ?? []) as StudioFolder[])
  }

  // ── Modal helpers ─────────────────────────────────────────────────────────
  function openModal(type: ModalType) {
    setModal(type); setModalInput(''); setModalError(''); setModalWorking(false)
  }
  function closeModal() {
    setModal(null); setTargetFolder(null); setTargetFile(null)
    setUploadFileList([]); setUploadProgress({}); setUploadErrors({})
  }

  // ── Create folder ─────────────────────────────────────────────────────────
  async function handleCreateFolder(name?: string) {
    const folderName = (name ?? modalInput).trim()
    if (!folderName) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const { error } = await sb.from('studio_folders').insert({
      company_id:       companyId,
      parent_folder_id: currentFolderId,
      name:             folderName,
      created_by:       actorId,
    })
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Rename folder ─────────────────────────────────────────────────────────
  async function handleRenameFolder() {
    if (!modalInput.trim() || !targetFolder) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const { error } = await sb.from('studio_folders')
      .update({ name: modalInput.trim(), updated_at: new Date().toISOString() })
      .eq('id', targetFolder.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Soft-delete folder ────────────────────────────────────────────────────
  async function handleDeleteFolder() {
    if (!targetFolder) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const now = new Date().toISOString()
    const { data: childF }  = await sb.from('studio_folders').select('id').eq('parent_folder_id', targetFolder.id).is('deleted_at', null).limit(1)
    const { data: childFi } = await sb.from('studio_files').select('id').eq('folder_id', targetFolder.id).is('deleted_at', null).limit(1)
    if ((childF?.length ?? 0) > 0 || (childFi?.length ?? 0) > 0) {
      setModalError('Move or delete the items inside this folder first.')
      setModalWorking(false); return
    }
    const { error } = await sb.from('studio_folders').update({ deleted_at: now }).eq('id', targetFolder.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Rename file ───────────────────────────────────────────────────────────
  async function handleRenameFile() {
    if (!modalInput.trim() || !targetFile) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const { error } = await sb.from('studio_files')
      .update({ name: modalInput.trim(), updated_at: new Date().toISOString() })
      .eq('id', targetFile.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    if (selectedFile?.id === targetFile.id) setSelectedFile(f => f ? { ...f, name: modalInput.trim() } : null)
    closeModal(); load()
  }

  // ── Soft-delete file ──────────────────────────────────────────────────────
  async function handleDeleteFile() {
    if (!targetFile) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const { error } = await sb.from('studio_files')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', targetFile.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    if (selectedFile?.id === targetFile.id) setSelectedFile(null)
    closeModal(); load()
  }

  // ── Move folder ───────────────────────────────────────────────────────────
  async function handleMoveFolder() {
    if (!targetFolder) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const destId = moveDest === 'ROOT' ? null : moveDest
    const { error } = await sb.from('studio_folders')
      .update({ parent_folder_id: destId, updated_at: new Date().toISOString() })
      .eq('id', targetFolder.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Move file ─────────────────────────────────────────────────────────────
  async function handleMoveFile() {
    if (!targetFile) return
    setModalWorking(true); setModalError('')
    const sb = createClient()
    const destId = moveDest === 'ROOT' ? null : moveDest
    const { error } = await sb.from('studio_files')
      .update({ folder_id: destId, updated_at: new Date().toISOString() })
      .eq('id', targetFile.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Upload files ──────────────────────────────────────────────────────────
  async function handleUpload() {
    if (!uploadFileList.length) return
    setModalWorking(true)
    const prog: Record<string, 'pending' | 'uploading' | 'done' | 'error'> = {}
    const errs: Record<string, string> = {}
    uploadFileList.forEach(f => { prog[f.name] = 'pending' })
    setUploadProgress({ ...prog })

    const sb = createClient()

    for (const file of uploadFileList) {
      prog[file.name] = 'uploading'
      setUploadProgress({ ...prog })
      try {
        const ts = Date.now()
        const sn = safeName(file.name)
        const folderSegment = currentFolderId ?? 'root'
        const path = `${companyId}/${folderSegment}/${ts}-${sn}`

        const { error: storageErr } = await sb.storage
          .from('studio-assets')
          .upload(path, file, { upsert: false, cacheControl: '3600' })
        if (storageErr) throw new Error(`Storage: ${storageErr.message}`)

        const { data: urlData } = sb.storage.from('studio-assets').getPublicUrl(path)
        const publicUrl = urlData?.publicUrl
        if (!publicUrl) throw new Error('Could not get public URL after upload')

        // Admin uploads default to ready_for_review, clients to uploaded
        const defaultStatus: FileStatus = actorRole === 'admin' ? 'ready_for_review' : 'uploaded'

        const { error: dbErr } = await sb.from('studio_files').insert({
          company_id:   companyId,
          folder_id:    currentFolderId,
          name:         file.name,
          storage_path: path,
          file_url:     publicUrl,
          mime_type:    file.type || null,
          file_size:    file.size || null,
          status:       defaultStatus,
          uploaded_by:  actorId,
        })
        if (dbErr) throw new Error(`Database: ${dbErr.message}`)

        prog[file.name] = 'done'
      } catch (err) {
        prog[file.name] = 'error'
        errs[file.name] = err instanceof Error ? err.message : 'Upload failed'
      }
      setUploadProgress({ ...prog })
      setUploadErrors({ ...errs })
    }

    setModalWorking(false)
    const anyDone = Object.values(prog).some(v => v === 'done')
    if (anyDone) load()

    // Auto-close only if all succeeded
    if (!Object.values(prog).some(v => v === 'error')) {
      setTimeout(closeModal, 800)
    }
  }

  // ── Update file status ────────────────────────────────────────────────────
  async function handleUpdateStatus(file: StudioFile, status: FileStatus) {
    setStatusUpdating(true)
    const sb = createClient()
    const { error } = await sb.from('studio_files')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', file.id)
    setStatusUpdating(false)
    if (!error) {
      setSelectedFile(f => f ? { ...f, status } : null)
      setFiles(prev => prev.map(fi => fi.id === file.id ? { ...fi, status } : fi))
    }
  }

  // ── Add comment ───────────────────────────────────────────────────────────
  async function handleAddComment() {
    if (!newComment.trim() || !selectedFile) return
    setSendingComment(true)
    const sb = createClient()
    const senderName = actorRole === 'admin'
      ? (fireCreatorProfile?.displayName ?? 'UGC Fire Team')
      : 'Client'
    const { data, error } = await sb.from('studio_comments').insert({
      company_id:     companyId,
      file_id:        selectedFile.id,
      sender_user_id: actorId,
      sender_role:    actorRole,
      sender_name:    senderName,
      message:        newComment.trim(),
    }).select('id, file_id, sender_role, sender_name, message, created_at').single()
    setSendingComment(false)
    if (!error && data) {
      setComments(c => [...c, data as StudioComment])
      setNewComment('')
    }
  }

  // ── Navigation ────────────────────────────────────────────────────────────
  function openFolder(folder: StudioFolder) {
    setCrumbs(c => [...c, { id: folder.id, name: folder.name }])
    setSearch('')
    setSelectedFile(null)
  }
  function navigateToCrumb(idx: number) {
    setCrumbs(c => c.slice(0, idx + 1))
    setSearch('')
    setSelectedFile(null)
  }

  // ── Filtered / sorted ─────────────────────────────────────────────────────
  const filteredFolders = folders
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const filteredFiles = files
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const isEmpty = !loading && !dbError && filteredFolders.length === 0 && filteredFiles.length === 0
  const isRootEmpty = !loading && !dbError && crumbs.length === 1 && folders.length === 0 && files.length === 0

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Studio</h1>
          <p className="text-white/40 text-sm mt-0.5">Upload, organise, review, and deliver your content.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => openModal('new-folder')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/6 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white rounded-lg text-sm transition"
          >
            <FolderPlus size={15} /> New Folder
          </button>
          <button
            onClick={() => { openModal('upload'); setUploadFileList([]) }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FF3B1A] hover:bg-[#e02e10] text-white rounded-lg text-sm font-semibold transition"
          >
            <Upload size={15} /> Upload Files
          </button>
        </div>
      </div>

      {/* Search + sort */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            className="w-full bg-white/4 border border-white/8 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF3B1A]/60"
            placeholder="Search files and folders…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setSortBy(s => s === 'name' ? 'date' : 'name')}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/4 border border-white/8 rounded-lg text-white/40 hover:text-white text-sm transition"
        >
          <ArrowUpDown size={13} /> {sortBy === 'name' ? 'Name' : 'Newest'}
        </button>
      </div>

      {/* Breadcrumbs */}
      {crumbs.length > 0 && (
        <div className="flex items-center gap-0.5 flex-wrap text-sm">
          {crumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-0.5">
              {idx > 0 && <ChevronRight size={13} className="text-white/20" />}
              <button
                onClick={() => navigateToCrumb(idx)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${idx === crumbs.length - 1 ? 'text-white font-semibold' : 'text-white/40 hover:text-white'}`}
              >
                {idx === 0 && <Home size={12} />}
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Error state */}
      {dbError && (
        <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-4">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-semibold mb-1">Studio not ready</p>
            <p className="text-red-400/70 text-xs leading-relaxed">{dbError}</p>
          </div>
        </div>
      )}

      {/* Loading skeleton */}
      {loading && !dbError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-20 bg-white/4 rounded-xl animate-pulse" />)}
        </div>
      )}

      {/* Starter folders — shown only on empty root */}
      {isRootEmpty && !search && (
        <div className="bg-white/3 border border-white/8 rounded-xl p-6 space-y-4">
          <div>
            <p className="text-white font-semibold text-sm">Get Started</p>
            <p className="text-white/35 text-xs mt-0.5">Create your first folders to organise your content.</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {STARTER_FOLDERS.map(name => (
              <button
                key={name}
                onClick={() => handleCreateFolder(name)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-[#FF3B1A]/40 text-white/60 hover:text-white rounded-lg text-sm transition"
              >
                <Plus size={12} /> {name}
              </button>
            ))}
          </div>
          <p className="text-white/20 text-xs">Or click <span className="text-white/40">New Folder</span> above to create your own.</p>
        </div>
      )}

      {/* Empty (in sub-folder) */}
      {isEmpty && !isRootEmpty && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
          <FolderOpen size={36} className="text-white/12" />
          <p className="text-white/35 text-sm">No files yet.</p>
          <p className="text-white/20 text-xs">Create a folder or upload your first asset.</p>
        </div>
      )}

      {/* Folders */}
      {!loading && !dbError && filteredFolders.length > 0 && (
        <div>
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Folders</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredFolders.map(folder => (
              <div
                key={folder.id}
                onClick={() => openFolder(folder)}
                className="group flex items-center gap-3 bg-white/4 hover:bg-white/7 border border-white/7 hover:border-white/15 rounded-xl px-4 py-3 cursor-pointer transition"
              >
                <Folder size={20} className="text-[#FF3B1A] shrink-0" />
                <p className="text-white/80 text-sm font-medium truncate flex-1">{folder.name}</p>
                <ItemMenu items={[
                  { label: 'Rename', icon: <Pencil size={13} />, onClick: () => { setTargetFolder(folder); setModalInput(folder.name); openModal('rename-folder') } },
                  { label: 'Move',   icon: <MoveRight size={13} />, onClick: () => { setTargetFolder(folder); setMoveDest('ROOT'); loadAllFolders(); openModal('move-folder') } },
                  { label: 'Delete', icon: <Trash2 size={13} />, danger: true, onClick: () => { setTargetFolder(folder); openModal('delete-folder') } },
                ]} />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Files */}
      {!loading && !dbError && filteredFiles.length > 0 && (
        <div>
          <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-2">Files</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                onClick={() => setSelectedFile(file)}
                className="group bg-white/4 border border-white/7 hover:border-white/15 rounded-xl overflow-hidden cursor-pointer transition"
              >
                {/* Thumbnail */}
                <div className="h-32 bg-white/3 flex items-center justify-center overflow-hidden relative">
                  {file.mime_type?.startsWith('image/') && file.file_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.file_url} alt={file.name} className="w-full h-full object-cover" />
                  ) : file.mime_type?.startsWith('video/') && file.file_url ? (
                    <video src={file.file_url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <FileIcon mime={file.mime_type} size={32} />
                  )}
                </div>
                {/* Meta */}
                <div className="px-3 py-2 flex items-start justify-between gap-2">
                  <div className="min-w-0 space-y-1">
                    <p className="text-white/80 text-xs font-medium truncate">{file.name}</p>
                    <StatusChip status={file.status as FileStatus} />
                    <p className="text-white/25 text-[10px]">{formatDate(file.created_at)}</p>
                  </div>
                  <ItemMenu items={[
                    { label: 'Open',     icon: <Eye size={13} />,       onClick: () => setSelectedFile(file) },
                    { label: 'Download', icon: <Download size={13} />,  onClick: () => file.file_url && window.open(file.file_url, '_blank') },
                    { label: 'Rename',   icon: <Pencil size={13} />,    onClick: () => { setTargetFile(file); setModalInput(file.name); openModal('rename-file') } },
                    { label: 'Move',     icon: <MoveRight size={13} />, onClick: () => { setTargetFile(file); setMoveDest('ROOT'); loadAllFolders(); openModal('move-file') } },
                    { label: 'Delete',   icon: <Trash2 size={13} />, danger: true, onClick: () => { setTargetFile(file); openModal('delete-file') } },
                  ]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── File Detail Modal ─────────────────────────────────────────────── */}
      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80" onClick={() => setSelectedFile(null)}>
          <div
            className="bg-[#0f0f0f] border border-white/10 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl"
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-white/8 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <FileIcon mime={selectedFile.mime_type} size={18} />
                <p className="text-white font-semibold text-sm truncate">{selectedFile.name}</p>
                <StatusChip status={selectedFile.status as FileStatus} />
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {selectedFile.file_url && (
                  <a href={selectedFile.file_url} download target="_blank" rel="noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-white/6 hover:bg-white/10 text-white/60 hover:text-white rounded-lg text-xs transition">
                    <Download size={13} /> Download
                  </a>
                )}
                <button onClick={() => setSelectedFile(null)} className="text-white/30 hover:text-white transition p-1">
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row overflow-auto lg:overflow-hidden flex-1 min-h-0">
              {/* Left: preview */}
              <div className="lg:w-1/2 bg-black/40 flex items-center justify-center p-4 shrink-0 min-h-[200px] lg:min-h-0">
                {selectedFile.mime_type?.startsWith('image/') && selectedFile.file_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={selectedFile.file_url} alt={selectedFile.name} className="max-w-full max-h-[400px] lg:max-h-full object-contain rounded-lg" />
                ) : selectedFile.mime_type?.startsWith('video/') && selectedFile.file_url ? (
                  <video src={selectedFile.file_url} controls className="max-w-full max-h-[400px] lg:max-h-full rounded-lg" />
                ) : (
                  <div className="flex flex-col items-center gap-3 text-center">
                    <FileIcon mime={selectedFile.mime_type} size={56} />
                    <p className="text-white/40 text-sm">{selectedFile.name}</p>
                    {selectedFile.file_url && (
                      <a href={selectedFile.file_url} target="_blank" rel="noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] transition">
                        <Eye size={14} /> Open File
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Right: info + status + comments */}
              <div className="lg:w-1/2 flex flex-col overflow-hidden border-t lg:border-t-0 lg:border-l border-white/8">
                {/* File info */}
                <div className="px-5 py-4 space-y-1 border-b border-white/6 shrink-0">
                  <p className="text-white/30 text-xs">Uploaded {formatDate(selectedFile.created_at)}</p>
                  {selectedFile.file_size && <p className="text-white/25 text-xs">{formatBytes(selectedFile.file_size)}</p>}
                </div>

                {/* Status actions */}
                <div className="px-5 py-4 border-b border-white/6 shrink-0 space-y-2.5">
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-wider">Status</p>
                  <div className="flex flex-wrap gap-2">
                    {actorRole === 'client' && (
                      <>
                        <button
                          disabled={statusUpdating || selectedFile.status === 'approved'}
                          onClick={() => handleUpdateStatus(selectedFile, 'approved')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-green-500/15 text-green-400 border border-green-500/25 hover:bg-green-500/25 transition disabled:opacity-40"
                        >
                          <CheckCircle2 size={12} /> Approve
                        </button>
                        <button
                          disabled={statusUpdating || selectedFile.status === 'revision_requested'}
                          onClick={() => handleUpdateStatus(selectedFile, 'revision_requested')}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-orange-500/15 text-orange-400 border border-orange-500/25 hover:bg-orange-500/25 transition disabled:opacity-40"
                        >
                          <RotateCcw size={12} /> Request Revision
                        </button>
                      </>
                    )}
                    {actorRole === 'admin' && (
                      <>
                        {(['ready_for_review', 'approved', 'revision_requested', 'delivered', 'archived'] as FileStatus[]).map(s => (
                          <button
                            key={s}
                            disabled={statusUpdating || selectedFile.status === s}
                            onClick={() => handleUpdateStatus(selectedFile, s)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border transition disabled:opacity-40 ${STATUS_MAP[s].classes}`}
                          >
                            {s === 'ready_for_review' && <Eye size={11} />}
                            {s === 'approved' && <CheckCircle2 size={11} />}
                            {s === 'revision_requested' && <RotateCcw size={11} />}
                            {s === 'delivered' && <Truck size={11} />}
                            {s === 'archived' && <Archive size={11} />}
                            {STATUS_MAP[s].label}
                          </button>
                        ))}
                      </>
                    )}
                    {statusUpdating && <Loader2 size={14} className="animate-spin text-white/30 self-center" />}
                  </div>
                </div>

                {/* Comments */}
                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
                  <p className="text-white/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                    <MessageCircle size={11} /> Comments
                  </p>
                  {commentsLoading && <Loader2 size={16} className="animate-spin text-white/30" />}
                  {!commentsLoading && comments.length === 0 && (
                    <p className="text-white/20 text-xs">No comments yet.</p>
                  )}
                  {comments.map(c => (
                    <div key={c.id} className={`flex gap-2.5 ${c.sender_role === 'admin' ? 'flex-row' : 'flex-row-reverse'}`}>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 ${c.sender_role === 'admin' ? 'bg-[#FF3B1A]/20 text-[#FF3B1A]' : 'bg-white/10 text-white/60'}`}>
                        {(c.sender_name?.[0] ?? '?').toUpperCase()}
                      </div>
                      <div className={`max-w-[80%] ${c.sender_role === 'admin' ? '' : 'items-end flex flex-col'}`}>
                        <div className={`px-3 py-2 rounded-xl text-xs leading-relaxed ${c.sender_role === 'admin' ? 'bg-[#FF3B1A]/10 text-white/80 rounded-tl-sm' : 'bg-white/8 text-white/70 rounded-tr-sm'}`}>
                          {c.message}
                        </div>
                        <p className="text-white/20 text-[10px] mt-1 px-1">{c.sender_name} · {formatTime(c.created_at)}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment input */}
                <div className="px-5 py-3 border-t border-white/6 shrink-0">
                  <div className="flex gap-2">
                    <input
                      className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-white text-xs placeholder:text-white/25 focus:outline-none focus:border-[#FF3B1A]/50"
                      placeholder="Add a comment…"
                      value={newComment}
                      onChange={e => setNewComment(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && !e.shiftKey && handleAddComment()}
                    />
                    <button
                      onClick={handleAddComment}
                      disabled={sendingComment || !newComment.trim()}
                      className="px-3 py-2 bg-[#FF3B1A] text-white rounded-lg hover:bg-[#e02e10] transition disabled:opacity-40"
                    >
                      {sendingComment ? <Loader2 size={13} className="animate-spin" /> : <Send size={13} />}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {/* New Folder */}
      {modal === 'new-folder' && (
        <Modal title="New Folder" onClose={closeModal}>
          <input className="w-full bg-white/5 border border-white/12 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF3B1A] mb-4"
            placeholder="Folder name" value={modalInput} onChange={e => setModalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()} autoFocus />
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button onClick={() => handleCreateFolder()} disabled={modalWorking || !modalInput.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50 transition">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Create Folder
            </button>
          </div>
        </Modal>
      )}

      {/* Upload */}
      {modal === 'upload' && (
        <Modal title="Upload Files" onClose={closeModal}>
          <div
            onDragOver={e => e.preventDefault()}
            onDrop={e => { e.preventDefault(); setUploadFileList(Array.from(e.dataTransfer.files)) }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/12 hover:border-[#FF3B1A]/40 rounded-xl p-8 text-center cursor-pointer transition mb-4"
          >
            <Upload size={24} className="text-white/20 mx-auto mb-2" />
            <p className="text-white/45 text-sm">Drag files here or click to browse</p>
            <p className="text-white/20 text-xs mt-1">Images, videos, PDFs and more</p>
            <input ref={fileInputRef} type="file" multiple className="hidden"
              onChange={e => setUploadFileList(Array.from(e.target.files ?? []))} />
          </div>

          {uploadFileList.length > 0 && (
            <div className="space-y-1.5 mb-4 max-h-44 overflow-y-auto">
              {uploadFileList.map(f => {
                const prog = uploadProgress[f.name]
                const err = uploadErrors[f.name]
                return (
                  <div key={f.name} className="flex items-center gap-2 px-3 py-2 bg-white/4 rounded-lg text-xs">
                    <FileIcon mime={f.type} size={14} />
                    <span className="text-white/65 flex-1 truncate">{f.name}</span>
                    <span className="text-white/25 shrink-0">{formatBytes(f.size)}</span>
                    {prog === 'uploading' && <Loader2 size={12} className="animate-spin text-white/40 shrink-0" />}
                    {prog === 'done'      && <Check size={12} className="text-green-400 shrink-0" />}
                    {prog === 'error'     && <span title={err} className="shrink-0"><AlertCircle size={12} className="text-red-400" /></span>}
                  </div>
                )
              })}
            </div>
          )}

          {Object.entries(uploadErrors).map(([name, err]) => (
            <p key={name} className="text-red-400 text-xs mb-1">{name}: {err}</p>
          ))}

          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button onClick={handleUpload} disabled={modalWorking || !uploadFileList.length}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50 transition">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {modalWorking ? 'Uploading…' : `Upload ${uploadFileList.length > 0 ? `(${uploadFileList.length})` : ''}`}
            </button>
          </div>
        </Modal>
      )}

      {/* Rename Folder */}
      {modal === 'rename-folder' && (
        <Modal title="Rename Folder" onClose={closeModal}>
          <input className="w-full bg-white/5 border border-white/12 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B1A] mb-4"
            value={modalInput} onChange={e => setModalInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameFolder()} autoFocus />
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button onClick={handleRenameFolder} disabled={modalWorking}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
            </button>
          </div>
        </Modal>
      )}

      {/* Rename File */}
      {modal === 'rename-file' && (
        <Modal title="Rename File" onClose={closeModal}>
          <input className="w-full bg-white/5 border border-white/12 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B1A] mb-4"
            value={modalInput} onChange={e => setModalInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameFile()} autoFocus />
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button onClick={handleRenameFile} disabled={modalWorking}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
            </button>
          </div>
        </Modal>
      )}

      {/* Delete Folder */}
      {modal === 'delete-folder' && (
        <Modal title="Delete Folder?" onClose={closeModal}>
          <p className="text-white/55 text-sm mb-5">
            Are you sure you want to delete <span className="text-white font-semibold">{targetFolder?.name}</span>?
            This cannot be undone.
          </p>
          {modalError && <p className="text-orange-400 text-xs mb-3 bg-orange-500/8 border border-orange-500/20 rounded-lg px-3 py-2">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button onClick={handleDeleteFolder} disabled={modalWorking}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Delete File */}
      {modal === 'delete-file' && (
        <Modal title="Delete File?" onClose={closeModal}>
          <p className="text-white/55 text-sm mb-5">
            Are you sure you want to delete <span className="text-white font-semibold">{targetFile?.name}</span>?
          </p>
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button onClick={handleDeleteFile} disabled={modalWorking}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Move Folder / Move File */}
      {(modal === 'move-folder' || modal === 'move-file') && (
        <Modal title={`Move "${targetFolder?.name ?? targetFile?.name}"`} onClose={closeModal}>
          <p className="text-white/35 text-xs mb-3">Choose destination:</p>
          <div className="bg-white/4 border border-white/8 rounded-xl max-h-52 overflow-y-auto mb-4">
            <button onClick={() => setMoveDest('ROOT')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-white/5 ${moveDest === 'ROOT' ? 'text-white bg-[#FF3B1A]/10' : 'text-white/55'}`}>
              <Home size={13} /> Studio (root)
            </button>
            {allFolders.filter(f => f.id !== targetFolder?.id).map(f => (
              <button key={f.id} onClick={() => setMoveDest(f.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-white/5 ${moveDest === f.id ? 'text-white bg-[#FF3B1A]/10' : 'text-white/55'}`}>
                <Folder size={13} className="text-[#FF3B1A]" /> {f.name}
              </button>
            ))}
          </div>
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/45 hover:text-white">Cancel</button>
            <button
              onClick={modal === 'move-folder' ? handleMoveFolder : handleMoveFile}
              disabled={modalWorking}
              className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <MoveRight size={14} />} Move
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
