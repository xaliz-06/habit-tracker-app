import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/db";
import { InferInsertModel } from "drizzle-orm";
import { habit as habitTable } from "../db/schema";
import { frequencyEnum } from "../lib/enum";

/** Fake database */
const users = [
  {
    id: 1,
    name: "John",
  },
  {
    id: 2,
    name: "Carlo",
  },
];

const createHabitSchema = z.object({
  name: z.string().min(1, "Habit name is required"),
  description: z.string().optional(),
  userId: z.string().min(1, "User ID is required"),
  color: z.string().min(1, "Color is required"),
  isRepeatable: z.boolean().optional().default(false),
  frequency: z.enum(frequencyEnum).default(frequencyEnum[0]),
});

type NewHabit = InferInsertModel<typeof habitTable>;

export const habitsRouter = new Hono()
  .post("/", zValidator("json", createHabitSchema), async (c) => {
    const habit = c.req.valid("json");

    try {
      const userExists = await db.query.user.findFirst({
        where: (user, { eq }) => eq(user.id, habit.userId),
      });

      if (!userExists) {
        return c.json(
          {
            success: false,
            message: "User not found.",
          },
          404
        );
      }

      const newHabit: NewHabit = {
        id: crypto.randomUUID(),
        name: habit.name,
        description: habit.description || null,
        userId: habit.userId,
        color: habit.color,
        isRepeatable: habit.isRepeatable,
        frequency: habit.frequency,
      };

      const [result] = await db.insert(habitTable).values(newHabit).returning();

      return c.json(
        {
          success: true,
          data: result,
        },
        201
      );
    } catch (error) {
      console.error("Error creating habit:", error);
      return c.json(
        {
          success: false,
          message: "Failed to create habit",
        },
        500
      );
    }
  })
  .get("/", async (c) => {
    return c.json({
      users: users,
    });
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");

    if (!id) throw Error("No Id found.");

    let _id: number;
    try {
      _id = parseInt(id);
    } catch (e) {
      throw Error("Invalid Id. Must be int.");
    }

    const user = users.find((u) => u.id === _id);

    if (!user) throw Error("User not found.");

    return c.json(user);
  });
