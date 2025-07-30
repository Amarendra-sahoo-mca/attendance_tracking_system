"use client";
import HolidayProgress from "@/components/ui/progress";
import React, { JSX, useEffect, useState } from "react";
import { Chart } from "react-google-charts";
import DashboardSkleton from "@/components/dashboardSkleton";
import CountUp from "@/components/ui/count_up";
import GlareHover from "@/components/ui/glareHover";
import { FaCalendarTimes } from "react-icons/fa";
import { MdHomeRepairService } from "react-icons/md";
import { GoProjectSymlink } from "react-icons/go";
import { GrUserWorker } from "react-icons/gr";
import { FaCalendarAlt } from "react-icons/fa";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardData } from "./manage_dashboard";
function dashboard() {
  const {setLoading,loading,theme,
data,
options,
graphdata,
apiholidays} = dashboardData()
  
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
                {
                  apiholidays.data?.cardsData?.map((item: any, index: number) => {
                    return (
                      <div
                        key={index}
                        className="h-[122px] w-[220px]  rounded-lg border-2  shadow-lg dark:shadow-primary "
                      >
                        <GlareHover
                          className=" p-2"
                          glareColor={`${
                            theme === "dark" ? "#ffffff" : "#3366cc"
                          }`}
                          height="122px"
                          width="220px"
                          glareOpacity={0.3}
                          glareAngle={-30}
                          // glareSize={100}
                          transitionDuration={800}
                          playOnce={false}
                        >
                          <div className="flex items-center justify-between w-full ">
                            <CountUp
                              from={0}
                              to={item.value}
                              separator=","
                              direction="up"
                              duration={1}
                              className="count-up-text font-bold text-4xl mt-3"
                            />
                            <div className="mt-5">
                              {getIconByName(item.name)}
                            </div>
                          </div>
                          <p className="font-semibold w-full text-left mt-5">
                            {item.name}
                          </p>
                        </GlareHover>
                      </div>
                    );
                  })}
              </div>
              <div className="flex w-282 ">
                <div className="w-2/5 h-96 mt-2 border-2  shadow-lg dark:shadow-primary rounded-lg ">
                  <GlareHover
                    className="px-2 "
                    glareColor={`${theme === "dark" ? "#ffffff" : "#3366cc"}`}
                    height="390px"
                    width="399px"
                    glareOpacity={0.3}
                    glareAngle={-30}
                    // glareSize={100}
                    transitionDuration={800}
                    playOnce={false}
                  >
                    <p className="text-lg w-full text-left font-semibold mb-2">
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
                  </GlareHover>
                </div>
                <div className="w-2/3 flex flex-col justify-center gap-3">
                  <div className="w-[97%] h-32 mt-2 ml-5 border-2  shadow-lg dark:shadow-primary rounded-lg">
                    <GlareHover
                      className="h-[122px] w-full px-2"
                      glareColor={`${theme === "dark" ? "#ffffff" : "#3366cc"}`}
                      height="128px"
                      width="720px"
                      glareOpacity={0.3}
                      glareAngle={-30}
                      // glareSize={100}
                      transitionDuration={800}
                      playOnce={false}
                    >
                      <p className="text-lg w-full text-left font-semibold mb-2">
                        Holidays {new Date().getFullYear()}
                      </p>
                      <HolidayProgress
                        holidays={apiholidays.data.Holidays ?? []}
                      />
                    </GlareHover>
                  </div>
                  <div className="h-[90%] w-[97%] ml-5 border-2 px-2 shadow-lg dark:shadow-primary rounded-lg">
                    <GlareHover
                      className="px-2"
                      glareColor={`${theme === "dark" ? "#ffffff" : "#3366cc"}`}
                      height="240px"
                      width="720px"
                      glareOpacity={0.3}
                      glareAngle={-30}
                      // glareSize={100}
                      transitionDuration={800}
                      playOnce={false}
                    >
                      <p className="text-lg w-full text-left font-semibold mb-2 ">
                        Working Days Every Months Of {new Date().getFullYear()}
                      </p>
                      <div className="flex w-full items-center justify-center">
                      <Chart
                        chartType="ColumnChart"
                        width="100%"
                        height="87%"
                        data={graphdata}
                        className=" my-auto"
                      />
                      </div>
                    </GlareHover>
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
