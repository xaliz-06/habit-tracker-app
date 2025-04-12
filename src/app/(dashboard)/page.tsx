"use client";

import { useEffect, useRef } from "react";

import AddHabitSheet from "@/components/add-habit-sheet";
import HabitItem from "@/components/habit-item";

import { useInfiniteHabits } from "@/hooks/use-infinite-habits";
import { authClient } from "@/lib/auth-client";

import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";

import { Loader2, MessageCircleWarningIcon } from "lucide-react";

import { useIntersection } from "@mantine/hooks";

export default function Home() {
  const {
    data: session,
    isPending: isPendingUser, //loading state
    error, //error object
    refetch, //refetch the session
  } = authClient.useSession();

  const {
    data,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
    status,
    error: habitsError,
  } = useInfiniteHabits(session?.user?.id || "");
  const lastHabitRef = useRef<HTMLDivElement>(null);
  const { ref, entry } = useIntersection({
    root: lastHabitRef.current,
    threshold: 1,
  });

  useEffect(() => {
    if (entry?.isIntersecting && hasNextPage) {
      fetchNextPage();
    }
  }, [entry, fetchNextPage, hasNextPage]);

  const habits = data?.pages.flatMap((page) => page.data) || [];

  if (error) {
    refetch();
    return (
      <div className="text-center text-rose-500 flex items-center justify-center">
        <MessageCircleWarningIcon className="h-4 w-4 " /> Error loading user.
        Please try again.
      </div>
    );
  }

  if (isPendingUser) {
    return (
      <div className="min-h-screen bg-background px-6 py-8">
        <div className="mx-auto rounded-lg bg-card p-6 shadow-md">
          <div className="flex flex-row justify-between items-center px-4">
            <h3 className="font-semibold tracking-tight text-2xl">Dashboard</h3>
            <Skeleton className="h-8 w-12 " />
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
              <Skeleton className="w-full h-20" />
            </div>
          </div>
        </div>
      </div>
    );
  }
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
          <div className="flex flex-col gap-2" ref={lastHabitRef}>
            {habits.length > 0 ? (
              habits.map((habit, index) => (
                <div
                  key={habit.id}
                  ref={index === habits.length - 1 ? ref : null}
                >
                  <HabitItem habit={habit} />
                </div>
              ))
            ) : (
              <p className="text-center text-muted-foreground py-4">
                No habits yet. Create your first habit!
              </p>
            )}

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
