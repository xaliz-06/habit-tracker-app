import { db } from "../db/db";
import { router } from "../lib/trpc";
import { habitRouter } from "./habit-routes/habitRouter";

export const appRouter = router({
    habit: habitRouter
})

export type AppRouter = typeof appRouter;