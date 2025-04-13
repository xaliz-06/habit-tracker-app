import { getHabitCompletions } from "@/actions/get-habit-completions";
import { useQuery } from "@tanstack/react-query";

export const useGetHabitCompletions = (habitId: string, year: number) => {
  return useQuery({
    queryKey: ["habitCompletions", habitId, year],
    queryFn: async () => {
      const data = await getHabitCompletions({
        habitId: habitId,
        year: year.toString(),
      });

      return data;
    },
    enabled: !!habitId && !!year,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};
