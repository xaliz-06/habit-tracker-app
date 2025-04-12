import { InferSelectModel } from "drizzle-orm";
import { habit } from "../db/schema";

export type Habit = typeof habit.$inferSelect;
