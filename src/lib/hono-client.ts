import { hc as honoClient } from "hono/client";
import type { AppType } from "@/server/index";

export const hc = honoClient<AppType>("http://localhost:3000/api");
