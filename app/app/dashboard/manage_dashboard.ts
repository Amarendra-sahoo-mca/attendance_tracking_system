
import { getAllhdays } from "@/service/dashboard.api";
import { getAllEmp } from "@/service/employee.api";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import { useState } from "react";
export function dashboardData() {
    const [loading, setLoading] = useState(true);
  const { theme } = useTheme();
  const [systemTheme, setSystemTheme] = useState(theme);

  const options = {
    pieHole: 0.4,
    is3D: false,
    legend: {
      position: "bottom",
      alignment: "center",
    },
    colors: ["#3366cc", "#dc3912", "#ff9900"],
  };

  const apiholidays = useQuery({
    queryKey: ["dashboard"],
    queryFn: getAllhdays,
  });

  const cardsData = apiholidays?.data?.cardsData ?? [];

  const holidays = cardsData[3]?.value ?? 0;
  const daysLeft = cardsData[4]?.value ?? 0;
  const completedDays = (cardsData[2]?.value ?? 0) - daysLeft;

  const data = [
    ["Working Type", "Days"],
    ["Holiday", holidays],
    ["Days Left", daysLeft],
    ["Completed Days", completedDays],
  ];
  let graphdata = apiholidays?.data?.workingdayGraph
    ? [["Month", "Days"], ...apiholidays.data.workingdayGraph]
    : [["Month", "Days"]];


    return {
      setLoading,
      loading,
      apiholidays,
      theme,
      data,
      options,
      graphdata
    }
}