"use server";

import { hc } from "@/lib/hono-client";
import { Frequency } from "@/server/lib/enum";
import { revalidatePath } from "next/cache";

type CreateHabitFormData = {
  name: string;
  description?: string;
  userId: string;
  color: string;
  isRepeatable?: boolean;
  frequency: Frequency;
};

export const createHabit = async (formData: CreateHabitFormData) => {
  try {
    const response = await hc.api.habits.$post({
      json: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Failed to create habit");
    }

    const result = await response.json();
    revalidatePath("/");
    return result;
  } catch (error) {
    console.error("Error creating habit:", error);
    throw error;
  }
};
