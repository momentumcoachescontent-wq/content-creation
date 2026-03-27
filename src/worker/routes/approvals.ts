import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

type EnvBindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  N8N_WEBHOOK_BASE?: string
}

const app = new Hono<{ Bindings: EnvBindings }>()

app.post('/:id/approve', async (c) => {
  const id = c.req.param('id')

  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase
    .from('content_assets')
    .update({ status: 'approved' })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ ok: false, error: error.message }, 500)
  }

  return c.json({
    ok: true,
    action: 'approved',
    item: data,
  })
})

app.post('/:id/reject', async (c) => {
  const id = c.req.param('id')
  const body = await c.req.json().catch(() => ({}))
  const note = typeof body?.review_notes === 'string' ? body.review_notes : null

  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase
    .from('content_assets')
    .update({
      status: 'rejected',
      review_notes: note,
    })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return c.json({ ok: false, error: error.message }, 500)
  }

  return c.json({
    ok: true,
    action: 'rejected',
    item: data,
  })
})

export default app