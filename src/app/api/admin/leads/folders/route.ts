import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

// GET /api/admin/leads/folders — list all folders with lead count
export async function GET() {
  try {
    const supabase = getSupabase()

    const { data: folders, error } = await supabase
      .from('lead_folders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    // Attach lead counts
    const { data: counts } = await supabase
      .from('leads')
      .select('folder_id')
      .not('folder_id', 'is', null)

    const countMap: Record<string, number> = {}
    for (const row of (counts ?? [])) {
      if (row.folder_id) countMap[row.folder_id] = (countMap[row.folder_id] ?? 0) + 1
    }

    const foldersWithCount = (folders ?? []).map(f => ({
      ...f,
      lead_count: countMap[f.id] ?? 0,
    }))

    return NextResponse.json({ success: true, folders: foldersWithCount })
  } catch (err) {
    console.error('[folders GET]', err)
    return NextResponse.json({ success: false, error: String((err as Error).message) }, { status: 500 })
  }
}

// POST /api/admin/leads/folders — create a folder
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}))
    const { name, description, search_query, city, category, color } = body

    if (!name?.trim()) {
      return NextResponse.json({ success: false, error: 'name is required' }, { status: 400 })
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('lead_folders')
      .insert({
        name: name.trim(),
        description: description?.trim() || null,
        search_query: search_query?.trim() || null,
        city: city?.trim() || null,
        category: category?.trim() || null,
        color: color || '#FF3B1A',
      })
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, folder: { ...data, lead_count: 0 } })
  } catch (err) {
    console.error('[folders POST]', err)
    return NextResponse.json({ success: false, error: String((err as Error).message) }, { status: 500 })
  }
}
