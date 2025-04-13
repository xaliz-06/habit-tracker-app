"use server";

import { hc } from "@/lib/hono-client";

type GetHabitCompletionsFormData = {
  habitId: string;
  year: string;
};

export const getHabitCompletions = async (
  formData: GetHabitCompletionsFormData
) => {
  try {
    const response = await hc.api.completions.$get({
      query: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to get habit completions");
    }

    const result = await response.json();

    return result.data;
  } catch (error) {
    console.error("Error getting habit completions:", error);
    throw error;
  }
};
