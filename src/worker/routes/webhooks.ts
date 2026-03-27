import { Hono } from 'hono'

const app = new Hono()

app.post('/run-publish', async (c) => {
  const payload = await c.req.json().catch(() => ({}))

  return c.json({
    ok: true,
    message: 'Webhook placeholder ready',
    payload,
  })
})

export default app