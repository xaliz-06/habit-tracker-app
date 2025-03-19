import { Hono } from 'hono'
import { trpcServer } from '@hono/trpc-server'
import {cors} from 'hono/cors'
import { appRouter } from './routes/router'
import { auth } from './lib/auth'

const app = new Hono()

app.use(
  cors({
    origin: ["http://localhost:3000"],
  })
)
app.get('/health', (c) => {
  return c.text("hello hono!");
})

app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

app.use(
  '/trpc/*',
  trpcServer({
    router: appRouter,
    createContext: (_opts, c) => ({
      headers: c.req.raw.headers  
    }),
  })
)

export default {
  port: 8080,
  fetch: app.fetch,
}
