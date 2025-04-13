import React, { useState, useEffect, useRef } from "react";
import { ActivityCalendar } from "react-activity-calendar";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "./ui/button";
import { Tooltip as ReactTooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Habit } from "@/lib/types/habit";
import { getTextColorClass } from "@/lib/colors/color";

import { ColorOption, getCssColorVariable } from "@/lib/colors/colorUtils";
import { useGetHabitCompletions } from "@/hooks/use-habit-completions";

interface Props {
  habit: Habit;
}

// Static mock data that spans the entire year
const generateMockData = (year: number) => {
  return [
    // January - Winter activities
    { date: `${year}-01-01`, count: 4, level: 2 }, // New Year's Day
    { date: `${year}-01-05`, count: 1, level: 1 },
    { date: `${year}-01-12`, count: 3, level: 2 },
    { date: `${year}-01-20`, count: 2, level: 1 },
    { date: `${year}-01-25`, count: 5, level: 3 },
    { date: `${year}-01-31`, count: 1, level: 1 },

    // February - Valentine's month
    { date: `${year}-02-14`, count: 6, level: 4 }, // Valentine's Day
    { date: `${year}-02-20`, count: 2, level: 1 },

    // March - Spring begins
    { date: `${year}-03-08`, count: 3, level: 2 }, // International Women's Day
    { date: `${year}-03-17`, count: 5, level: 3 }, // St. Patrick's Day
    { date: `${year}-03-21`, count: 2, level: 1 }, // Spring equinox

    // April - Spring continues
    { date: `${year}-04-01`, count: 1, level: 1 }, // April Fools
    { date: `${year}-04-15`, count: 4, level: 2 },
    { date: `${year}-04-22`, count: 3, level: 2 }, // Earth Day

    // May - Getting warmer
    { date: `${year}-05-01`, count: 2, level: 1 }, // Labor Day
    { date: `${year}-05-15`, count: 5, level: 3 },
    { date: `${year}-05-25`, count: 7, level: 4 },

    // June - Summer begins
    { date: `${year}-06-05`, count: 3, level: 2 },
    { date: `${year}-06-15`, count: 8, level: 4 },
    { date: `${year}-06-21`, count: 4, level: 2 }, // Summer solstice
    { date: `${year}-06-30`, count: 6, level: 3 },

    // July - Peak summer
    { date: `${year}-07-04`, count: 9, level: 4 }, // Independence Day
    { date: `${year}-07-15`, count: 5, level: 3 },
    { date: `${year}-07-20`, count: 7, level: 4 },
    { date: `${year}-07-28`, count: 3, level: 2 },

    // August - Summer continues
    { date: `${year}-08-12`, count: 6, level: 3 },
    { date: `${year}-08-19`, count: 4, level: 2 },
    { date: `${year}-08-25`, count: 8, level: 4 },
    { date: `${year}-08-31`, count: 2, level: 1 },

    // September - Fall begins
    { date: `${year}-09-05`, count: 3, level: 2 },
    { date: `${year}-09-15`, count: 5, level: 3 },
    { date: `${year}-09-22`, count: 4, level: 2 }, // Fall equinox
    { date: `${year}-09-30`, count: 1, level: 1 },

    // October - Halloween season
    { date: `${year}-10-10`, count: 6, level: 3 },
    { date: `${year}-10-20`, count: 7, level: 4 },
    { date: `${year}-10-25`, count: 9, level: 4 },
    { date: `${year}-10-31`, count: 10, level: 4 }, // Halloween

    // November - Thanksgiving month
    { date: `${year}-11-01`, count: 2, level: 1 },
    { date: `${year}-11-11`, count: 3, level: 2 }, // Veterans Day
    { date: `${year}-11-20`, count: 5, level: 3 },
    { date: `${year}-11-26`, count: 8, level: 4 }, // Thanksgiving

    // December - Holiday season
    { date: `${year}-12-01`, count: 1, level: 1 },
    { date: `${year}-12-10`, count: 4, level: 2 },
    { date: `${year}-12-20`, count: 7, level: 4 },
    { date: `${year}-12-24`, count: 9, level: 4 }, // Christmas Eve
    { date: `${year}-12-25`, count: 10, level: 4 }, // Christmas
    { date: `${year}-12-31`, count: 8, level: 4 }, // New Year's Eve
  ];
};

// Mock API call with static data
const fetchYearData = async (year: number) => {
  await new Promise((resolve) => setTimeout(resolve, 300)); // Simulate network delay
  return generateMockData(year);
};

const HabitItem = ({ habit }: Props) => {
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const calendarContainerRef = useRef<HTMLDivElement>(null);

  const {
    data: activityData,
    isLoading,
    isError,
    error,
  } = useGetHabitCompletions(habit.id, currentYear);

  useEffect(() => {
    if (
      activityData &&
      activityData.length > 0 &&
      calendarContainerRef.current
    ) {
      setTimeout(() => {
        if (calendarContainerRef.current) {
          calendarContainerRef.current.scrollLeft =
            calendarContainerRef.current.scrollWidth;
          checkScrollPosition();
        }
      }, 50);
    }
  }, [activityData]);

  const checkScrollPosition = () => {
    if (calendarContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        calendarContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
    }
  };

  const handleScroll = (direction: "left" | "right") => {
    if (calendarContainerRef.current) {
      const scrollAmount = 200;
      calendarContainerRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
      setTimeout(checkScrollPosition, 300);
    }
  };

  const handleYearChange = (change: number) => {
    setCurrentYear((prev) => prev + change);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-[200px]">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="mx-auto mt-4 px-2 py-4 max-w-5xl relative">
      <div className="flex items-center justify-between mb-4">
        <div className="flex flex-1 flex-col">
          <h3
            className={`font-semibold text-xl ${getTextColorClass(
              habit.color as ColorOption,
              600
            )}`}
          >
            {habit.name}
          </h3>
          <p className="text-muted-foreground text-sm tracking-tighter">
            {habit.description}
          </p>
        </div>
        <div className="flex flex-1 items-center justify-between mb-4">
          <Button
            onClick={() => handleYearChange(-1)}
            variant={"outline"}
            disabled={isLoading}
            className="p-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <h2 className="text-xl font-semibold">{currentYear}</h2>

          <Button
            onClick={() => handleYearChange(1)}
            variant={"outline"}
            disabled={isLoading}
            className="p-2 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <div className="relative">
        {canScrollLeft && (
          <Button
            onClick={() => handleScroll("left")}
            variant={"outline"}
            className="ml-2 absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg shadow-md opacity-80  transition-colors cursor-pointer"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
        )}
        <div
          ref={calendarContainerRef}
          className="overflow-hidden w-full min-h-[200px] relative"
          onScroll={checkScrollPosition}
        >
          <div className="w-max">
            {activityData && activityData.length > 0 ? (
              <>
                <ActivityCalendar
                  data={activityData}
                  showWeekdayLabels
                  labels={{
                    weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
                  }}
                  blockSize={14}
                  blockMargin={4}
                  fontSize={14}
                  renderBlock={(block, activity) => {
                    return React.cloneElement(block, {
                      "data-tooltip-id": "react-tooltip",
                      "data-tooltip-html": `${activity.count} activities on ${activity.date}`,
                    });
                  }}
                  theme={{
                    light: [
                      getCssColorVariable(habit.color as ColorOption, 500),
                      getCssColorVariable(habit.color as ColorOption, 600),
                      getCssColorVariable(habit.color as ColorOption, 700),
                      getCssColorVariable(habit.color as ColorOption, 800),
                      getCssColorVariable(habit.color as ColorOption, 950),
                    ],
                    dark: [
                      getCssColorVariable(habit.color as ColorOption, 950),
                      getCssColorVariable(habit.color as ColorOption, 800),
                      getCssColorVariable(habit.color as ColorOption, 700),
                      getCssColorVariable(habit.color as ColorOption, 600),
                      getCssColorVariable(habit.color as ColorOption, 500),
                    ],
                  }}
                />
                <ReactTooltip id="react-tooltip" />
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground text-sm">
                  No activities recorded yet.
                </p>
              </div>
            )}
          </div>
        </div>
        {canScrollRight && (
          <Button
            onClick={() => handleScroll("right")}
            variant={"outline"}
            className="mr-2 absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-lg shadow-md opacity-80 transition-colors cursor-pointer"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
        )}
      </div>
    </div>
  );
};
export default HabitItem;
