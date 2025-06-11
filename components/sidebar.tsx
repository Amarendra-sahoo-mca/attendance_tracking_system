"use client";
import React from "react";
import Image from "next/image";
import { GraduationCap, Hand, LayoutIcon, Settings } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";

function Sidebar() {
  const pathname = usePathname();
  const { theme } = useTheme();
  const menu_list = [
    {
      id: 1,
      name: "dashboard",
      icon: LayoutIcon,
      path: "/app/dashboard",
    },
    {
      id: 2,
      name: "employee",
      icon: GraduationCap,
      path: "/app/dashboard/employee",
    },
    {
      id: 3,
      name: "attendance",
      icon: Hand,
      path: "/app/attendance",
    },
    {
      id: 4,
      name: "settings",
      icon: Settings,
      path: "/app/settings",
    },
  ];
  
  return (
    <div className="dark:bg-[#0a0a0a] bg-white w-full h-screen border shadow-md pt-5 px-2">
      <div className="">
        <Image
          src={theme === "dark" ? "/logo-dark.svg" : "/logo-light.svg"}
          width={180}
          height={90}
          alt="logo"
          className="mx-auto mb-5 "
        ></Image>
        <hr className="mt-5 mb-2 w-[95%] mx-auto" />

        {menu_list.map((item: any, index: number) => {
          const isActive = pathname === item.path;
          return (
            <Link href={item.path} key={item.id} passHref>
              <h2 className={`flex items-center pl-4 gap-3 h-12 cursor-pointer transition-all rounded-lg text-slate-500 capitalize ${isActive ? "bg-primary text-white"
                    : "text-slate-500 hover:bg-slate-200 hover:text-black"}`}>
                <item.icon />
                {item.name}
              </h2>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
