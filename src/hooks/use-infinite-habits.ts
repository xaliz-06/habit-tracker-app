"use client";

import { hc } from "@/lib/hono-client";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useInfiniteHabits = (userId: string) => {
  return useInfiniteQuery({
    queryKey: ["habits", userId],
    queryFn: async ({ pageParam }) => {
      const response = await hc.api.habits.$get({
        query: {
          userId,
          cursor: pageParam,
          limit: "3",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch habits");
      }

      return response.json();
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
};
