import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

type Ctx = { params: Promise<{ id: string }> }

// PATCH /api/admin/leads/folders/[id]
export async function PATCH(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const body = await req.json().catch(() => ({}))
    const allowed = ['name', 'description', 'search_query', 'city', 'category', 'color']
    const patch: Record<string, unknown> = { updated_at: new Date().toISOString() }
    for (const k of allowed) {
      if (k in body) patch[k] = body[k]
    }

    const supabase = getSupabase()
    const { data, error } = await supabase
      .from('lead_folders')
      .update(patch)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, folder: data })
  } catch (err) {
    return NextResponse.json({ success: false, error: String((err as Error).message) }, { status: 500 })
  }
}

// DELETE /api/admin/leads/folders/[id]
// ?deleteLeads=true  → delete all leads in folder then delete folder
// default            → set leads.folder_id = null then delete folder
export async function DELETE(req: NextRequest, { params }: Ctx) {
  try {
    const { id } = await params
    const deleteLeads = new URL(req.url).searchParams.get('deleteLeads') === 'true'
    const supabase = getSupabase()

    if (deleteLeads) {
      // Delete related notes and activities first
      const { data: folderLeads } = await supabase
        .from('leads').select('id').eq('folder_id', id)
      const leadIds = (folderLeads ?? []).map(l => l.id)
      if (leadIds.length > 0) {
        await supabase.from('lead_notes').delete().in('lead_id', leadIds)
        await supabase.from('lead_activities').delete().in('lead_id', leadIds)
        await supabase.from('leads').delete().in('id', leadIds)
      }
    } else {
      // Unassign leads from folder
      await supabase.from('leads').update({ folder_id: null }).eq('folder_id', id)
    }

    const { error } = await supabase.from('lead_folders').delete().eq('id', id)
    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: String((err as Error).message) }, { status: 500 })
  }
}
