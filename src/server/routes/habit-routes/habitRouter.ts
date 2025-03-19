import { z } from "zod";
import { publicProcedure, router } from "@/server/lib/trpc";

export const habitRouter = router({
    create: publicProcedure.input(z.instanceof(FormData))
                .query(async (opts) => {
                    const data = opts.input;
                })
})