import { Hono } from 'hono'
import { cors } from 'hono/cors'
import healthRoute from './routes/health'
import assetsRoute from './routes/assets'
import approvalsRoute from './routes/approvals'
import webhooksRoute from './routes/webhooks'

type EnvBindings = {
  SUPABASE_URL: string
  SUPABASE_SERVICE_ROLE_KEY: string
  APP_SHARED_SECRET?: string
  N8N_WEBHOOK_BASE?: string
}

const app = new Hono<{ Bindings: EnvBindings }>()

app.use('/api/*', cors())

app.get('/', (c) => {
  return c.json({
    ok: true,
    app: 'content-creation',
    role: 'content-ops-control-tower',
  })
})

app.route('/api/health', healthRoute)
app.route('/api/assets', assetsRoute)
app.route('/api/approvals', approvalsRoute)
app.route('/api/webhooks', webhooksRoute)

export default app