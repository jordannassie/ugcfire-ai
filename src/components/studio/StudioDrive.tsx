'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  Folder, FolderOpen, FolderPlus, Upload, MoreHorizontal,
  Trash2, Pencil, MoveRight, Download, File, Image as ImageIcon,
  Video, ChevronRight, Home, X, Check, Loader2, AlertCircle,
  Search, ArrowUpDown,
} from 'lucide-react'

// ─── Types ────────────────────────────────────────────────────────────────────

interface StudioFolder {
  id: string
  name: string
  user_id: string
  parent_folder_id: string | null
  created_at: string
  _item_count?: number
}

interface StudioFile {
  id: string
  name: string
  user_id: string
  folder_id: string | null
  file_url: string
  file_path: string | null
  file_type: string | null
  file_size: number | null
  created_at: string
}

type ModalType = 'new-folder' | 'upload' | 'rename-folder' | 'rename-file' | 'move' | 'delete-folder' | 'delete-file' | null

interface Crumb { id: string | null; name: string }

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

function fileIcon(type: string | null) {
  if (!type) return <File size={28} className="text-white/30" />
  if (type.startsWith('image/')) return <ImageIcon size={28} className="text-blue-400" />
  if (type.startsWith('video/')) return <Video size={28} className="text-purple-400" />
  return <File size={28} className="text-white/30" />
}

// ─── Modal shell ──────────────────────────────────────────────────────────────

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70" onClick={onClose}>
      <div
        className="bg-[#111] border border-white/12 rounded-2xl p-6 w-full max-w-md shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <p className="text-white font-semibold text-base">{title}</p>
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
      <button
        onClick={() => setOpen(p => !p)}
        className="p-1.5 rounded-lg hover:bg-white/10 text-white/30 hover:text-white transition"
      >
        <MoreHorizontal size={14} />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-[#1c1c1c] border border-white/12 rounded-xl shadow-2xl py-1 min-w-[148px] z-50">
          {items.map(item => (
            <button
              key={item.label}
              onClick={() => { item.onClick(); setOpen(false) }}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2 text-sm transition hover:bg-white/6 ${item.danger ? 'text-red-400 hover:text-red-300' : 'text-white/70 hover:text-white'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

// ─── Main StudioDrive ─────────────────────────────────────────────────────────

export interface StudioDriveProps {
  /** The workspace owner's user_id. For clients = their own id. For admins = the selected client's id. */
  userId: string
  /** The actor performing actions (for created_by / uploaded_by fields). */
  actorId?: string
  isAdmin?: boolean
}

export default function StudioDrive({ userId, actorId, isAdmin = false }: StudioDriveProps) {
  const supabase = createClient()

  // ── Navigation state ──────────────────────────────────────────────────────
  const [crumbs, setCrumbs] = useState<Crumb[]>([{ id: null, name: 'Studio' }])
  const currentFolderId = crumbs[crumbs.length - 1].id

  // ── Data ──────────────────────────────────────────────────────────────────
  const [folders, setFolders]   = useState<StudioFolder[]>([])
  const [files, setFiles]       = useState<StudioFile[]>([])
  const [loading, setLoading]   = useState(true)
  const [dbError, setDbError]   = useState<string | null>(null)

  // ── Search / sort ─────────────────────────────────────────────────────────
  const [search, setSearch]     = useState('')
  const [sortBy, setSortBy]     = useState<'name' | 'date'>('date')

  // ── Modal state ───────────────────────────────────────────────────────────
  const [modal, setModal]       = useState<ModalType>(null)
  const [modalInput, setModalInput] = useState('')
  const [modalWorking, setModalWorking] = useState(false)
  const [modalError, setModalError]   = useState('')
  const [targetFolder, setTargetFolder] = useState<StudioFolder | null>(null)
  const [targetFile, setTargetFile]   = useState<StudioFile | null>(null)
  const [allFolders, setAllFolders]   = useState<StudioFolder[]>([])
  const [moveDest, setMoveDest]       = useState<string | null>('ROOT')

  // ── Upload state ──────────────────────────────────────────────────────────
  const [uploadFiles, setUploadFiles]   = useState<File[]>([])
  const [uploadProgress, setUploadProgress] = useState<Record<string, 'pending' | 'done' | 'error'>>({})
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Load ──────────────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true)
    setDbError(null)
    try {
      const folderQ = supabase
        .from('studio_folders')
        .select('*')
        .eq('user_id', userId)
        .order('name')

      if (currentFolderId === null) {
        folderQ.is('parent_folder_id', null)
      } else {
        folderQ.eq('parent_folder_id', currentFolderId)
      }

      const fileQ = supabase
        .from('studio_files')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

      if (currentFolderId === null) {
        fileQ.is('folder_id', null)
      } else {
        fileQ.eq('folder_id', currentFolderId)
      }

      const [{ data: fData, error: fErr }, { data: fiData, error: fiErr }] = await Promise.all([folderQ, fileQ])

      if (fErr?.code === '42P01' || fiErr?.code === '42P01') {
        setDbError('Studio tables not set up yet. Please run the migration in Supabase SQL Editor.')
        return
      }
      if (fErr) throw fErr
      if (fiErr) throw fiErr

      setFolders(fData ?? [])
      setFiles(fiData ?? [])
    } catch (err) {
      setDbError(err instanceof Error ? err.message : 'Failed to load studio')
    } finally {
      setLoading(false)
    }
  }, [userId, currentFolderId])

  useEffect(() => { load() }, [load])

  // ── Load all folders for Move modal ───────────────────────────────────────
  async function loadAllFolders() {
    const { data } = await supabase.from('studio_folders').select('id, name, parent_folder_id').eq('user_id', userId).order('name')
    setAllFolders((data ?? []) as unknown as StudioFolder[])
  }

  function openModal(type: ModalType) {
    setModal(type)
    setModalInput('')
    setModalError('')
    setModalWorking(false)
  }

  function closeModal() {
    setModal(null)
    setTargetFolder(null)
    setTargetFile(null)
    setUploadFiles([])
    setUploadProgress({})
  }

  // ── Create folder ─────────────────────────────────────────────────────────
  async function handleCreateFolder() {
    if (!modalInput.trim()) return
    setModalWorking(true); setModalError('')
    const { error } = await supabase.from('studio_folders').insert({
      user_id:          userId,
      parent_folder_id: currentFolderId,
      name:             modalInput.trim(),
      created_by:       actorId ?? userId,
    })
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Rename folder ─────────────────────────────────────────────────────────
  async function handleRenameFolder() {
    if (!modalInput.trim() || !targetFolder) return
    setModalWorking(true); setModalError('')
    const { error } = await supabase.from('studio_folders')
      .update({ name: modalInput.trim(), updated_at: new Date().toISOString() })
      .eq('id', targetFolder.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Delete folder ─────────────────────────────────────────────────────────
  async function handleDeleteFolder() {
    if (!targetFolder) return
    setModalWorking(true); setModalError('')
    // Check for nested content
    const { data: childFolders } = await supabase.from('studio_folders').select('id').eq('parent_folder_id', targetFolder.id).limit(1)
    const { data: childFiles }   = await supabase.from('studio_files').select('id').eq('folder_id', targetFolder.id).limit(1)
    if ((childFolders?.length ?? 0) > 0 || (childFiles?.length ?? 0) > 0) {
      setModalError('This folder has contents. Please delete all files and sub-folders inside it first.')
      setModalWorking(false); return
    }
    const { error } = await supabase.from('studio_folders').delete().eq('id', targetFolder.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Rename file ───────────────────────────────────────────────────────────
  async function handleRenameFile() {
    if (!modalInput.trim() || !targetFile) return
    setModalWorking(true); setModalError('')
    const { error } = await supabase.from('studio_files')
      .update({ name: modalInput.trim(), updated_at: new Date().toISOString() })
      .eq('id', targetFile.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Delete file ───────────────────────────────────────────────────────────
  async function handleDeleteFile() {
    if (!targetFile) return
    setModalWorking(true); setModalError('')
    if (targetFile.file_path) {
      await supabase.storage.from('studio-assets').remove([targetFile.file_path])
    }
    const { error } = await supabase.from('studio_files').delete().eq('id', targetFile.id)
    setModalWorking(false)
    if (error) { setModalError(error.message); return }
    closeModal(); load()
  }

  // ── Move ──────────────────────────────────────────────────────────────────
  async function handleMove() {
    setModalWorking(true); setModalError('')
    const destId = moveDest === 'ROOT' ? null : moveDest
    if (targetFolder) {
      const { error } = await supabase.from('studio_folders')
        .update({ parent_folder_id: destId, updated_at: new Date().toISOString() })
        .eq('id', targetFolder.id)
      if (error) { setModalError(error.message); setModalWorking(false); return }
    } else if (targetFile) {
      const { error } = await supabase.from('studio_files')
        .update({ folder_id: destId, updated_at: new Date().toISOString() })
        .eq('id', targetFile.id)
      if (error) { setModalError(error.message); setModalWorking(false); return }
    }
    setModalWorking(false)
    closeModal(); load()
  }

  // ── Upload ────────────────────────────────────────────────────────────────
  async function handleUpload() {
    if (!uploadFiles.length) return
    setModalWorking(true)
    const prog: Record<string, 'pending' | 'done' | 'error'> = {}
    uploadFiles.forEach(f => { prog[f.name] = 'pending' })
    setUploadProgress({ ...prog })

    for (const file of uploadFiles) {
      try {
        const safeName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
        const folderSegment = currentFolderId ?? 'root'
        const path = `${userId}/${folderSegment}/${safeName}`

        const { error: storageErr } = await supabase.storage
          .from('studio-assets')
          .upload(path, file, { upsert: false })

        if (storageErr) throw storageErr

        const { data: { publicUrl } } = supabase.storage.from('studio-assets').getPublicUrl(path)

        const { error: dbErr } = await supabase.from('studio_files').insert({
          user_id:     userId,
          folder_id:   currentFolderId,
          name:        file.name,
          file_url:    publicUrl,
          file_path:   path,
          file_type:   file.type || null,
          file_size:   file.size || null,
          uploaded_by: actorId ?? userId,
        })
        if (dbErr) throw dbErr

        prog[file.name] = 'done'
      } catch {
        prog[file.name] = 'error'
      }
      setUploadProgress({ ...prog })
    }

    setModalWorking(false)
    const anyError = Object.values(prog).some(v => v === 'error')
    if (!anyError) { closeModal(); load() }
    else { load() }
  }

  // ── Navigate ──────────────────────────────────────────────────────────────
  function openFolder(folder: StudioFolder) {
    setCrumbs(c => [...c, { id: folder.id, name: folder.name }])
    setSearch('')
  }

  function navigateToCrumb(idx: number) {
    setCrumbs(c => c.slice(0, idx + 1))
    setSearch('')
  }

  // ── Filtered/sorted ───────────────────────────────────────────────────────
  const filteredFolders = folders
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const filteredFiles = files
    .filter(f => !search || f.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => sortBy === 'name' ? a.name.localeCompare(b.name) : new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

  const isEmpty = !loading && !dbError && filteredFolders.length === 0 && filteredFiles.length === 0

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-5">

      {/* Top bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-white">Studio</h1>
          <p className="text-white/40 text-sm mt-0.5">Upload, organise, and manage your brand content.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => openModal('new-folder')}
            className="flex items-center gap-2 px-3.5 py-2 bg-white/8 hover:bg-white/12 border border-white/10 text-white/70 hover:text-white rounded-lg text-sm transition"
          >
            <FolderPlus size={15} /> New Folder
          </button>
          <button
            onClick={() => { openModal('upload'); setUploadFiles([]) }}
            className="flex items-center gap-2 px-3.5 py-2 bg-[#FF3B1A] hover:bg-[#e02e10] text-white rounded-lg text-sm font-semibold transition"
          >
            <Upload size={15} /> Upload Files
          </button>
        </div>
      </div>

      {/* Search + sort */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/25 pointer-events-none" />
          <input
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF3B1A]"
            placeholder="Search files and folders…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <button
          onClick={() => setSortBy(s => s === 'name' ? 'date' : 'name')}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/50 hover:text-white text-sm transition"
        >
          <ArrowUpDown size={13} /> {sortBy === 'name' ? 'Name' : 'Newest'}
        </button>
      </div>

      {/* Breadcrumbs */}
      {crumbs.length > 1 && (
        <div className="flex items-center gap-1 flex-wrap text-sm">
          {crumbs.map((crumb, idx) => (
            <span key={idx} className="flex items-center gap-1">
              {idx > 0 && <ChevronRight size={13} className="text-white/20" />}
              <button
                onClick={() => navigateToCrumb(idx)}
                className={`flex items-center gap-1 px-2 py-0.5 rounded transition ${
                  idx === crumbs.length - 1
                    ? 'text-white font-semibold'
                    : 'text-white/45 hover:text-white'
                }`}
              >
                {idx === 0 && <Home size={12} />}
                {crumb.name}
              </button>
            </span>
          ))}
        </div>
      )}

      {/* Error */}
      {dbError && (
        <div className="flex items-start gap-3 bg-red-500/8 border border-red-500/20 rounded-xl p-4">
          <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-red-400 text-sm font-semibold mb-1">Studio not ready</p>
            <p className="text-red-400/70 text-xs leading-relaxed">{dbError}</p>
            {dbError.includes('migration') && (
              <p className="text-white/40 text-xs mt-2">Run the SQL migration in your Supabase dashboard to enable Studio.</p>
            )}
          </div>
        </div>
      )}

      {/* Loading */}
      {loading && !dbError && (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-24 bg-white/4 rounded-xl animate-pulse" />
          ))}
        </div>
      )}

      {/* Empty */}
      {isEmpty && (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-3">
          <FolderOpen size={40} className="text-white/15" />
          <p className="text-white/40 text-sm font-medium">No files yet</p>
          <p className="text-white/25 text-xs">Create a folder or upload your first asset.</p>
        </div>
      )}

      {/* Folders */}
      {!loading && !dbError && filteredFolders.length > 0 && (
        <div>
          <p className="text-white/25 text-xs font-semibold uppercase tracking-wider mb-2">Folders</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredFolders.map(folder => (
              <div
                key={folder.id}
                onClick={() => openFolder(folder)}
                className="group flex items-center gap-3 bg-white/4 hover:bg-white/8 border border-white/8 hover:border-white/15 rounded-xl px-4 py-3.5 cursor-pointer transition"
              >
                <Folder size={22} className="text-[#FF3B1A] shrink-0" />
                <p className="text-white/80 text-sm font-medium truncate flex-1">{folder.name}</p>
                <ItemMenu items={[
                  { label: 'Rename', icon: <Pencil size={13} />, onClick: () => { setTargetFolder(folder); setModalInput(folder.name); openModal('rename-folder') } },
                  { label: 'Move',   icon: <MoveRight size={13} />, onClick: () => { setTargetFolder(folder); setMoveDest('ROOT'); loadAllFolders(); openModal('move') } },
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
          <p className="text-white/25 text-xs font-semibold uppercase tracking-wider mb-2">Files</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {filteredFiles.map(file => (
              <div
                key={file.id}
                className="group bg-white/4 border border-white/8 hover:border-white/15 rounded-xl overflow-hidden transition"
              >
                {/* Preview */}
                <div className="h-36 bg-white/3 flex items-center justify-center overflow-hidden relative">
                  {file.file_type?.startsWith('image/') ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={file.file_url} alt={file.name} className="w-full h-full object-cover" />
                  ) : file.file_type?.startsWith('video/') ? (
                    <video src={file.file_url} className="w-full h-full object-cover" muted playsInline />
                  ) : (
                    <div className="flex flex-col items-center gap-1">
                      {fileIcon(file.file_type)}
                    </div>
                  )}
                </div>
                {/* Info */}
                <div className="px-3 py-2.5 flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white/80 text-xs font-medium truncate">{file.name}</p>
                    <p className="text-white/30 text-[10px] mt-0.5">
                      {formatDate(file.created_at)}{file.file_size ? ` · ${formatBytes(file.file_size)}` : ''}
                    </p>
                  </div>
                  <ItemMenu items={[
                    { label: 'Download', icon: <Download size={13} />, onClick: () => window.open(file.file_url, '_blank') },
                    { label: 'Rename',   icon: <Pencil size={13} />,   onClick: () => { setTargetFile(file); setModalInput(file.name); openModal('rename-file') } },
                    { label: 'Move',     icon: <MoveRight size={13} />, onClick: () => { setTargetFile(file); setMoveDest('ROOT'); loadAllFolders(); openModal('move') } },
                    { label: 'Delete',   icon: <Trash2 size={13} />, danger: true, onClick: () => { setTargetFile(file); openModal('delete-file') } },
                  ]} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Modals ─────────────────────────────────────────────────────────── */}

      {/* New folder */}
      {modal === 'new-folder' && (
        <Modal title="New Folder" onClose={closeModal}>
          <input
            className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm placeholder:text-white/25 focus:outline-none focus:border-[#FF3B1A] mb-4"
            placeholder="Folder name"
            value={modalInput}
            onChange={e => setModalInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCreateFolder()}
            autoFocus
          />
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white transition">Cancel</button>
            <button onClick={handleCreateFolder} disabled={modalWorking || !modalInput.trim()} className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg transition hover:bg-[#e02e10] disabled:opacity-50">
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
            onDrop={e => { e.preventDefault(); setUploadFiles(Array.from(e.dataTransfer.files)) }}
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-white/15 hover:border-[#FF3B1A]/40 rounded-xl p-8 text-center cursor-pointer transition mb-4"
          >
            <Upload size={24} className="text-white/25 mx-auto mb-2" />
            <p className="text-white/50 text-sm">Drag files here or click to browse</p>
            <input ref={fileInputRef} type="file" multiple className="hidden"
              onChange={e => setUploadFiles(Array.from(e.target.files ?? []))} />
          </div>

          {uploadFiles.length > 0 && (
            <div className="space-y-1.5 mb-4 max-h-48 overflow-y-auto">
              {uploadFiles.map(f => (
                <div key={f.name} className="flex items-center gap-2 px-3 py-2 bg-white/4 rounded-lg text-xs">
                  {fileIcon(f.type)}
                  <span className="text-white/70 flex-1 truncate">{f.name}</span>
                  <span className="text-white/30 shrink-0">{formatBytes(f.size)}</span>
                  {uploadProgress[f.name] === 'done' && <Check size={12} className="text-green-400 shrink-0" />}
                  {uploadProgress[f.name] === 'error' && <AlertCircle size={12} className="text-red-400 shrink-0" />}
                  {uploadProgress[f.name] === 'pending' && modalWorking && <Loader2 size={12} className="animate-spin text-white/40 shrink-0" />}
                </div>
              ))}
            </div>
          )}

          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white transition">Cancel</button>
            <button onClick={handleUpload} disabled={modalWorking || !uploadFiles.length} className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] transition disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
              {modalWorking ? 'Uploading…' : 'Upload'}
            </button>
          </div>
        </Modal>
      )}

      {/* Rename folder */}
      {modal === 'rename-folder' && (
        <Modal title="Rename Folder" onClose={closeModal}>
          <input className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B1A] mb-4" value={modalInput} onChange={e => setModalInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameFolder()} autoFocus />
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
            <button onClick={handleRenameFolder} disabled={modalWorking} className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
            </button>
          </div>
        </Modal>
      )}

      {/* Rename file */}
      {modal === 'rename-file' && (
        <Modal title="Rename File" onClose={closeModal}>
          <input className="w-full bg-white/5 border border-white/15 rounded-lg px-4 py-3 text-white text-sm focus:outline-none focus:border-[#FF3B1A] mb-4" value={modalInput} onChange={e => setModalInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleRenameFile()} autoFocus />
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
            <button onClick={handleRenameFile} disabled={modalWorking} className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />} Save
            </button>
          </div>
        </Modal>
      )}

      {/* Delete folder */}
      {modal === 'delete-folder' && (
        <Modal title="Delete Folder?" onClose={closeModal}>
          <p className="text-white/60 text-sm mb-5">Are you sure you want to delete <span className="text-white font-semibold">{targetFolder?.name}</span>? This cannot be undone.</p>
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
            <button onClick={handleDeleteFolder} disabled={modalWorking} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Delete file */}
      {modal === 'delete-file' && (
        <Modal title="Delete File?" onClose={closeModal}>
          <p className="text-white/60 text-sm mb-5">Are you sure you want to delete <span className="text-white font-semibold">{targetFile?.name}</span>?</p>
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
            <button onClick={handleDeleteFile} disabled={modalWorking} className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-sm rounded-lg hover:bg-red-600 disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />} Delete
            </button>
          </div>
        </Modal>
      )}

      {/* Move */}
      {modal === 'move' && (
        <Modal title={`Move "${targetFolder?.name ?? targetFile?.name}"`} onClose={closeModal}>
          <p className="text-white/40 text-xs mb-3">Choose destination folder:</p>
          <div className="bg-white/4 border border-white/10 rounded-xl max-h-56 overflow-y-auto mb-4">
            <button
              onClick={() => setMoveDest('ROOT')}
              className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-white/5 ${moveDest === 'ROOT' ? 'text-white bg-[#FF3B1A]/10' : 'text-white/60'}`}
            >
              <Home size={14} /> Studio (root)
            </button>
            {allFolders
              .filter(f => f.id !== targetFolder?.id)
              .map(f => (
                <button
                  key={f.id}
                  onClick={() => setMoveDest(f.id)}
                  className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition hover:bg-white/5 ${moveDest === f.id ? 'text-white bg-[#FF3B1A]/10' : 'text-white/60'}`}
                >
                  <Folder size={14} className="text-[#FF3B1A]" /> {f.name}
                </button>
              ))}
          </div>
          {modalError && <p className="text-red-400 text-xs mb-3">{modalError}</p>}
          <div className="flex gap-2 justify-end">
            <button onClick={closeModal} className="px-4 py-2 text-sm text-white/50 hover:text-white">Cancel</button>
            <button onClick={handleMove} disabled={modalWorking} className="flex items-center gap-2 px-4 py-2 bg-[#FF3B1A] text-white text-sm rounded-lg hover:bg-[#e02e10] disabled:opacity-50">
              {modalWorking ? <Loader2 size={14} className="animate-spin" /> : <MoveRight size={14} />} Move
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}
