"use client";
import React, { useEffect, useState } from "react";
import { BreadcrumbWithCustomSeparator } from "./breadcrumb";

import { useTheme } from "next-themes";
import { MdDarkMode } from "react-icons/md";
import { IoMdSunny } from "react-icons/io";
function Header() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <div className="w-full h-18.5  mx-auto flex justify-between items-center border-b-1">
      <div className="">
        <BreadcrumbWithCustomSeparator />
      </div>
      <div className=" flex w-1/8 justify-center gap-3">
        <div
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
          className=" h-10 w-10 flex justify-center items-center  rounded-full bg-gray-200 dark:bg-gray-400 text-black dark:text-white cursor-pointer"
        >
          {theme === "light" ? <MdDarkMode /> : <IoMdSunny />}
        </div>
        <div className="h-10 w-10 rounded-full dark:bg-gray-400 bg-secondary mr-10 flex justify-center items-center text-xl font-medium text-white">
          G
        </div>
      </div>
    </div>
  );
}

export default Header;
