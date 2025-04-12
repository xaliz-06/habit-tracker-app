import { Frequency } from "@/server/lib/enum";

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  userId: string;
  color: string;
  frequency: Frequency;
  streak: number;
  lastCompleted: string | null;
  isRepeatable: boolean;
  createdAt: string;
  updatedAt: string;
};
