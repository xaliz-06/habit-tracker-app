import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { number, z } from "zod";
import { db } from "../db/db";
import { habit, habitCompletion } from "../db/schema";
import { eq } from "drizzle-orm";

const CreateHabitCompletionSchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  userId: z.string().min(1, "User ID is required"),
});

export const completionsRouter = new Hono()
  .get(
    "/",
    zValidator(
      "query",
      z.object({
        habitId: z.string().min(1, "Habit ID is required"),
        year: z.coerce
          .number()
          .min(2020, "Year must be greater than 2020")
          .max(
            new Date().getFullYear(),
            "Year must be less than or equal to the current year"
          ),
      })
    ),
    async (c) => {
      const { habitId, year } = c.req.valid("query");

      const startDate = new Date(year, 0, 1);
      const endDate = new Date(year, 11, 31, 23, 59, 59);
      const currentYear = new Date().getFullYear();

      try {
        const completions = await db.query.habitCompletion.findMany({
          where: (habitCompletion, { and, eq, gte, lte }) => {
            return and(
              eq(habitCompletion.habitId, habitId),
              gte(habitCompletion.completionDate, startDate),
              lte(habitCompletion.completionDate, endDate)
            );
          },
          columns: {
            completionDate: true,
            completionCount: true,
            completionId: true,
          },
          orderBy: (habitCompletion, { desc }) => [
            desc(habitCompletion.completionDate),
          ],
        });

        const maxCount = completions.reduce((max, completion) => {
          return Math.max(max, completion.completionCount || 0);
        }, 0);

        const existingDates = new Set(
          completions.map((c) => {
            const d = new Date(c.completionDate);
            return `${d.getFullYear()}-${(d.getMonth() + 1)
              .toString()
              .padStart(2, "0")}-${d.getDate().toString().padStart(2, "0")}`;
          })
        );

        // Helper function to format date as YYYY-MM-DD
        const formatDate = (date: Date) => {
          return `${date.getFullYear()}-${(date.getMonth() + 1)
            .toString()
            .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;
        };

        const firstDayOfYear = formatDate(startDate);
        if (!existingDates.has(firstDayOfYear)) {
          completions.unshift({
            completionDate: startDate,
            completionCount: 0,
            completionId: "placeholder-" + crypto.randomUUID(),
          });
        }

        const lastDayOfYear = formatDate(endDate);
        if (
          (year !== currentYear || new Date() >= endDate) &&
          !existingDates.has(lastDayOfYear)
        ) {
          completions.push({
            completionDate: endDate,
            completionCount: 0,
            completionId: "placeholder-last-" + crypto.randomUUID(),
          });
        }
        if (year === currentYear) {
          const today = new Date();
          const todayStr = formatDate(today);
          if (!existingDates.has(todayStr)) {
            completions.push({
              completionDate: today,
              completionCount: 0,
              completionId: "placeholder-today-" + crypto.randomUUID(),
            });
          }
        }

        const transformedData = completions.map((completion) => {
          const date = new Date(completion.completionDate);
          const dateStr = formatDate(date);

          let level = 0;
          if (completion.completionCount && completion.completionCount > 0) {
            if (maxCount === 1) {
              level = 4;
            } else {
              const ratio = (completion.completionCount || 0) / maxCount;
              if (ratio >= 0.8) level = 4;
              else if (ratio >= 0.6) level = 3;
              else if (ratio >= 0.4) level = 2;
              else if (ratio >= 0.2) level = 1;
            }
          }

          return {
            date: dateStr,
            count: completion.completionCount || 0,
            level,
          };
        });

        return c.json(
          {
            success: true,
            data: transformedData,
            maxCount,
          },
          200
        );
      } catch (error) {
        return c.json(
          {
            success: false,
            message: "Failed to fetch habit completions",
          },
          500
        );
      }
    }
  )
  .post("/", zValidator("json", CreateHabitCompletionSchema), async (c) => {
    const { habitId, userId } = c.req.valid("json");

    const existingHabit = await db.query.habit.findFirst({
      where: (habit, { eq, and }) =>
        and(eq(habit.id, habitId), eq(habit.userId, userId)),
    });

    if (!existingHabit) {
      return c.json(
        {
          success: false,
          message: "Habit not found or does not belong to the user",
        },
        404
      );
    }

    const completionDate = new Date();
    const startOfDay = new Date(completionDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(completionDate);
    endOfDay.setHours(23, 59, 59, 999);

    try {
      const existingCompletion = await db.query.habitCompletion.findFirst({
        where: (completion, { eq, and, gte, lte }) =>
          and(
            eq(completion.habitId, habitId),
            gte(completion.completionDate, startOfDay),
            lte(completion.completionDate, endOfDay)
          ),
      });

      let completion;
      if (existingCompletion) {
        [completion] = await db
          .update(habitCompletion)
          .set({
            completionCount: existingCompletion.completionCount
              ? existingCompletion.completionCount + 1
              : 1,
          })
          .where(
            eq(habitCompletion.completionId, existingCompletion.completionId)
          )
          .returning();
      } else {
        // Create new completion
        [completion] = await db
          .insert(habitCompletion)
          .values({
            completionId: crypto.randomUUID(),
            habitId,
            completionDate: completionDate,
            completionCount: 1,
          })
          .returning();
      }

      if (
        !existingHabit.lastCompleted ||
        existingHabit.lastCompleted.getDate() !== completionDate.getDate()
      ) {
        await db
          .update(habit)
          .set({
            lastCompleted: completionDate,
            streak: existingHabit.streak + 1,
          })
          .where(eq(habit.id, habitId));
      }

      return c.json({
        success: true,
        data: {
          ...completion,
        },
      });
    } catch (error) {
      console.error("Error creating habit completion:", error);
      return c.json(
        {
          success: false,
          message: "Failed to create habit completion",
        },
        500
      );
    }
  });
