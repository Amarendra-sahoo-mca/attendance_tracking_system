import Header from '@/components/header';
import Sidebar from '@/components/sidebar';
import React from 'react'
// import { seed } from '../api/db/scripts/seed';
interface RootLayoutProps {
    children: React.ReactNode;
}
 function layout({children}:RootLayoutProps) {
  // await seed();
  return (
    <div className='flex'>
        <div className="min-w-55">
            <Sidebar />
        </div>
        <div className="w-full">
            <Header />
      {children}
        </div>
    </div>
  )
}

export default layout
