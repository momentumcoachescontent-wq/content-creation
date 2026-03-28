import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

type EnvBindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const app = new Hono<{ Bindings: EnvBindings }>()

function getSupabase(c: any) {
  return createClient(c.env.SUPABASE_URL, c.env.SUPABASE_SERVICE_ROLE_KEY)
}

app.get('/pending', async (c) => {
  const supabase = getSupabase(c)

  const { data, error } = await supabase
    .from('content_assets')
    .select('*')
    .in('status', ['pending_review', 'pending_approval'])
    .order('created_at', { ascending: false })

  if (error) {
    return c.json({ ok: false, error: error.message }, 500)
  }

  return c.json({ ok: true, items: data ?? [] })
})

app.get('/summary', async (c) => {
  const supabase = getSupabase(c)

  const { data, error } = await supabase
    .from('content_assets')
    .select('status')

  if (error) {
    return c.json({ ok: false, error: error.message }, 500)
  }

  const summary = {
    pending_review: 0,
    pending_approval: 0,
    approved: 0,
    rejected: 0,
    scheduled: 0,
    publish_error: 0,
  }

  for (const row of data ?? []) {
    if (row.status in summary) {
      summary[row.status as keyof typeof summary]++
    }
  }

  return c.json({
    ok: true,
    summary,
    total: (data ?? []).length,
  })
})

app.get('/', async (c) => {
  const supabase = getSupabase(c)
  const status = c.req.query('status')

  let query = supabase
    .from('content_assets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100)

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query

  if (error) {
    return c.json({ ok: false, error: error.message }, 500)
  }

  return c.json({
    ok: true,
    items: data ?? [],
  })
})

export default app