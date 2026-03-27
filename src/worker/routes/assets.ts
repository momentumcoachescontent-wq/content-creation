import { Hono } from 'hono'
import { createClient } from '@supabase/supabase-js'

type EnvBindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
}

const app = new Hono<{ Bindings: EnvBindings }>()

app.get('/pending', async (c) => {
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase
    .from('content_assets')
    .select('*')
    .in('status', ['pending_review', 'pending_approval'])
    .order('created_at', { ascending: false })

  if (error) {
    return c.json(
      {
        ok: false,
        error: error.message,
      },
      500
    )
  }

  return c.json({
    ok: true,
    items: data ?? [],
  })
})

app.get('/', async (c) => {
  const supabase = createClient(
    c.env.SUPABASE_URL,
    c.env.SUPABASE_SERVICE_ROLE_KEY
  )

  const { data, error } = await supabase
    .from('content_assets')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50)

  if (error) {
    return c.json({ ok: false, error: error.message }, 500)
  }

  return c.json({
    ok: true,
    items: data ?? [],
  })
})

export default app