import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { db } from "../db/db";
import { and, desc, eq, InferInsertModel, lt } from "drizzle-orm";
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
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        userId: z.string().min(1, "User ID is required"),
        cursor: z.string().optional(),
        limit: z.string().regex(/^\d+$/).transform(Number).default("3"),
      })
    ),
    async (c) => {
      const { userId, cursor, limit } = c.req.valid("query");

      try {
        let whereConditions = and(eq(habitTable.userId, userId));

        if (cursor) {
          const cursorHabit = await db.query.habit.findFirst({
            where: eq(habitTable.id, cursor),
          });

          if (cursorHabit) {
            whereConditions = and(
              eq(habitTable.userId, userId),
              lt(habitTable.createdAt, cursorHabit.createdAt)
            );
          }
        }

        const habits = await db
          .select()
          .from(habitTable)
          .where(whereConditions)
          .orderBy(desc(habitTable.createdAt))
          .limit(limit);

        const nextCursor =
          habits.length === limit ? habits[habits.length - 1].id : null;

        return c.json({
          success: true,
          data: habits,
          nextCursor,
        });
      } catch (error) {
        console.error("Error fetching habits:", error);
        return c.json(
          {
            success: false,
            message: "Failed to fetch habits",
          },
          500
        );
      }
    }
  )
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
