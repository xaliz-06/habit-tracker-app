"use client";

import AddHabitSheet from "@/components/add-habit-sheet";
import HabitItem from "@/components/habit-item";
import { Separator } from "@/components/ui/separator";

export default function Home() {
  return (
    <div className="min-h-screen bg-background px-6 py-8">
      <div className="mx-auto rounded-lg bg-card p-6 shadow-md">
        <div className="flex flex-row justify-between items-center px-4">
          <h3 className="font-semibold tracking-tight text-2xl">Dashboard</h3>
          <AddHabitSheet />
        </div>
        <Separator className="my-2" />
        <div className="flex flex-col gap-2 mt-4">
          <h3 className="font-semibold tracking-tight text-lg">
            Your habits will appear here
          </h3>
          <p className="text-muted-foreground">
            Track your progress and stay motivated!
          </p>
          <div className="flex flex-col gap-2">
            <HabitItem />
          </div>
        </div>
      </div>
    </div>
  );
}
