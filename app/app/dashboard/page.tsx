"use client";
import HolidayProgress from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getAllhdays } from "@/service/dashboard.api";
import { getAllEmp } from "@/service/employee.api";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import React, { JSX, useEffect, useState } from "react";
import { FaCalendarTimes } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import { GrUserWorker } from "react-icons/gr";
import { FaCalendarAlt } from "react-icons/fa";
import { Chart } from "react-google-charts";
import DashboardSkleton from "@/components/dashboardSkleton";
import CountUp from "@/components/ui/count_up";

function dashboard() {
  const [loading, setLoading] = useState(true);
  const { setTheme } = useTheme();

  const getIconByName = (name: string): JSX.Element | null => {
    switch (name) {
      case "Total Working Days":
        return <FaCalendarAlt className="text-2xl" />;
      case "Total Holidays":
        return <FaCalendarTimes className="text-2xl" />;
      case "Remaining Working Days":
        return <MdHomeRepairService className="text-2xl" />;
      case "Total Projects":
        return <GoProjectSymlink className="text-2xl" />;
      case "Total Employees":
        return <GrUserWorker className="text-xl" />;
      default:
        return null;
    }
  };

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
    queryKey: ["employees"],
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 2 seconds delay

    return () => clearTimeout(timer); // clean up
  }, []);
  return (
    <div className="pl-5 pt-5  max-w-screen overflow-hidden">
      {loading || !apiholidays.data ? (
        <DashboardSkleton />
      ) : (
        <>
          {apiholidays.data && (
            <>
              <div className="w-full h-36  flex gap-3 ">
                {apiholidays.data.cardsData &&
                  apiholidays.data.cardsData.map((item: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="h-[122px] w-[220px]  rounded-lg border-2 p-2 shadow-lg dark:shadow-primary"
                      >
                        <div className="flex items-center justify-between">
                            <CountUp
                              from={0}
                              to={item.value}
                              separator=","
                              direction="up"
                              duration={1}
                              className="count-up-text font-bold text-4xl mt-3"
                            />
                          <div className="mt-5">{getIconByName(item.name)}</div>
                        </div>
                        <p className="font-semibold mt-2">{item.name}</p>
                      </div>
                    );
                  })}
              </div>
              <div className="flex w-282   ">
                <div className="w-2/5 h-90 mt-2 border-2 px-2 shadow-lg dark:shadow-primary rounded-lg ">
                  <p className="text-lg font-semibold mb-2">
                    Working Days In Year {new Date().getFullYear()}
                  </p>
                  <div className="flex items-center justify-center">
                    <Chart
                      chartType="PieChart"
                      width={"380px"}
                      height={"320px"}
                      data={data}
                      options={options}
                    />
                  </div>
                </div>
                <div className="w-2/3 flex flex-col justify-center gap-3">
                  <div className="w-[97%] h-32 mt-2 ml-5 border-2 px-2 shadow-lg dark:shadow-primary rounded-lg">
                    <p className="text-lg font-semibold mb-2">
                      Holidays {new Date().getFullYear()}
                    </p>
                    <HolidayProgress
                      holidays={apiholidays.data.Holidays ?? []}
                    />
                  </div>
                  <div className="h-[90%] w-[97%] ml-5 border-2 px-2 shadow-lg dark:shadow-primary rounded-lg">
                    <p className="text-lg font-semibold mb-2">
                      Working Days Every Months Of {new Date().getFullYear()}
                    </p>
                    <Chart
                      chartType="ColumnChart"
                      width="100%"
                      height="87%"
                      data={graphdata}
                      className=" mx-auto"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

export default dashboard;
