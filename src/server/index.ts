import { Hono } from "hono";
import { cors } from "hono/cors";
import { auth } from "./lib/auth";
import { habitsRouter } from "./routes/habits";
import { completionsRouter } from "./routes/completions";

const app = new Hono().basePath("/api");

app.use(
  cors({
    origin: ["http://localhost:3000"],
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["POST", "GET", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
    credentials: true,
  })
);
app.get("/health", (c) => {
  return c.text("hello hono!");
});

app.on(["POST", "GET"], "/auth/**", (c) => auth.handler(c.req.raw));

const routes = app
  .route("/habits", habitsRouter)
  .route("/completions", completionsRouter);

export type AppType = typeof routes;
export { app };
