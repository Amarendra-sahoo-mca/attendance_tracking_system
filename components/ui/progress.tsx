"use client";

import { useMemo } from "react";
import { parseISO, isBefore, format, isValid } from "date-fns";

interface TimelineProgressProps {
  holidays: any[]; // ISO strings
}

export default function TimelineProgress({ holidays }: TimelineProgressProps) {
  const today = new Date();

  const parsed = useMemo(() => {
    return holidays
      .map((date) => parseISO(date.date)) // Assuming each holiday has a 'date' property
      .sort((a, b) => a.getTime() - b.getTime());
  }, [holidays]);

  const total = parsed.length;
  const passedCount = parsed.filter((d) => isBefore(d, today)).length;
  const progressPercent = Math.round((passedCount / total) * 100);

  return (
    <div className="w-full h-26 overflow-x-auto scrollbar-hide py-6 px-4 ">
      {/* Timeline Container with fixed width */}
      <div className="relative min-w-[800px] h-8 flex items-center justify-between ">
        {/* Full gray line */}
        <div className="mx-3 absolute w-full left-0 right-0 top-4 transform -translate-y-1/2 h-[4px] bg-gray-300 dark:bg-zinc-700 z-0" />

        {/* Green progress bar */}
        <div
          className="mx-3 top-4 absolute transform -translate-y-1/2 h-[4px] bg-primary z-10 transition-all duration-300"
          style={{ width: `${progressPercent}%` }}
        />

        {/* Dots */}
        {holidays.map((item, index) => {
          const itemDate = new Date(item.date);
          item.endDate = new Date(item.endDate);
          const isPast = isBefore(itemDate, today);
          
          return (
            <div
              key={index}
              className="mx-3 z-20 flex flex-col items-center "
              style={{
                left: `calc(${(index / (total - 1)) * 100}%)`,
                transform: "translateX(-50%)",
                position: "absolute",
                height: "100px", // fixed height to control layout
                justifyContent: "flex-start", // align from top
              }}
            >
              {/* Date label (always on top) */}
              <div className="text-xs mt-5 mb-1 text-center text-gray-700 dark:text-gray-300 whitespace-nowrap">
                {isValid(new Date(itemDate)) &&
                isValid(new Date(item.endDate))
                  ? format(new Date(itemDate), "dd") +
                    (itemDate !== item.endDate
                      ? "-" + format(new Date(item.endDate), "dd MMM")
                      : " " + format(new Date(item.endDate), "MMM"))
                  :  isValid(itemDate)? format(itemDate, "dd MMM") : "Invalid"}
              </div>

              {/* Dot (always center aligned vertically) */}
              <div
                className={`w-5 h-5 rounded-full border-2 ${isPast ? "bg-primary border-primary" : "bg-[#9ca3af] border-[#6b7280]"}`}
                // style={{
                //   backgroundColor: isPast ? "#16a34a" : "#9ca3af", // Tailwind green-600 / gray-400
                //   borderColor: isPast ? "#15803d" : "#6b7280", // Tailwind green-700 / gray-500
                // }}
              />

              {/* Name label (wrapped, below dot) */}
              <div className="text-xs mt-1 text-center text-gray-700 dark:text-gray-300 max-w-[80px] leading-tight break-words">
                {item.name}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
