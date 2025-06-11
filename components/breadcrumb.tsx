"use client";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";

export function BreadcrumbWithCustomSeparator() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter(Boolean).slice(1); // e.g. ['app', 'students', 'view']
  
  const getpath = (target:string)=> {
    const index = pathSegments.indexOf(target);
    const path = pathSegments.slice(0, index+1).join("/");
    return `/app/${path}`
  }
  
  return (
    <Breadcrumb className="ml-10 w-full  mb-4 mt-4">
      <BreadcrumbList>
        {pathSegments.map((item: string,index:number) => (
          <div className="flex items-center" key={index}>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={getpath(item)} className="hover:underline">{item}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </div >
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
