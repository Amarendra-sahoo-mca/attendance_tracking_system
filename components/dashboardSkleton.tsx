import React from 'react'
import { Skeleton } from './ui/skeleton'

function DashboardSkleton() {
  return (
    <div>
       <div className="w-full h-36  flex gap-3">
            {Array(5)
              .fill(null)
              .map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-[122px] w-[220px] rounded-lg"
                />
              ))}
          </div>
          <div className="flex w-282   ">
          <Skeleton className="w-2/5 h-90 mt-2 rounded-lg" />
          <div className="w-3/5">
          <Skeleton className="w-full h-32 mt-2 ml-5 rounded-lg" />
          <Skeleton className="w-full h-58 mt-2 ml-5 rounded-lg" />
          </div>
          </div>
    </div>
  )
}

export default DashboardSkleton
