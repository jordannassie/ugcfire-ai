import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

function getSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || ''
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || ''
  return createClient(url, key)
}

// GET /api/admin/leads
// ?folder_id=<uuid>       filter by folder
// ?folder_id=unassigned   show leads with no folder
// ?folder_id=all (default) show all non-archived leads
// ?status=<status>        filter by status
// ?search=<text>          ilike business_name
// ?limit=<n>              max results (default 200, max 500)
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const status     = searchParams.get('status')
    const search     = searchParams.get('search')
    const folderId   = searchParams.get('folder_id')
    const limit      = Math.min(parseInt(searchParams.get('limit') ?? '200'), 500)

    const supabase = getSupabase()
    let query = supabase
      .from('leads')
      .select('*')
      .is('archived_at', null)
      .order('lead_score', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(limit)

    if (status && status !== 'All')  query = query.eq('status', status)
    if (search)                       query = query.ilike('business_name', `%${search}%`)
    if (folderId && folderId !== 'all') {
      if (folderId === 'unassigned')  query = query.is('folder_id', null)
      else                            query = query.eq('folder_id', folderId)
    }

    const { data, error } = await query
    if (error) throw error

    return NextResponse.json({ success: true, leads: data ?? [] })
  } catch (err) {
    console.error('[leads GET]', err)
    return NextResponse.json({ success: false, error: String((err as Error).message) }, { status: 500 })
  }
}

// DELETE /api/admin/leads
// ?all=true             delete all leads (notes + activities first)
// ?deleteFolders=true   also delete all lead_folders
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const all           = searchParams.get('all') === 'true'
    const deleteFolders = searchParams.get('deleteFolders') === 'true'

    if (!all) {
      return NextResponse.json({ success: false, error: 'Pass ?all=true to confirm.' }, { status: 400 })
    }

    const supabase = getSupabase()

    // Delete in safe dependency order
    await supabase.from('lead_notes').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    await supabase.from('lead_activities').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    const { count } = await supabase.from('leads').delete({ count: 'exact' }).neq('id', '00000000-0000-0000-0000-000000000000')

    if (deleteFolders) {
      await supabase.from('lead_folders').delete().neq('id', '00000000-0000-0000-0000-000000000000')
    }

    return NextResponse.json({ success: true, deleted: count ?? 0 })
  } catch (err) {
    console.error('[leads DELETE]', err)
    return NextResponse.json({ success: false, error: String((err as Error).message) }, { status: 500 })
  }
}
