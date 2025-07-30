'use client'
import GlareHover from '@/components/ui/glareHover';
import { PATHS } from '@/constants/end_points';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import React from 'react'
import { FiFolder, FiCalendar, FiFileText, FiClock } from 'react-icons/fi';
function Settings() {
    const { theme } = useTheme();
    const router = useRouter();
    const content = [
        {
            name:'projects',
            theme:'#cb8dd6',
            icon: <FiFolder size={142} />,
            navigatePath :'projects',
        },
        {
            name:'holidays',
            theme:'#939dd6',
            icon: <FiCalendar size={142} />,
            navigatePath :'holidays',
        },
        {
            name:'leave types',
            theme:'#6fdae7',
            icon: <FiFileText size={142} />,
            navigatePath :'leave_types',
        },
        {
            name:'working days in week',
            theme:'#f278a2',
            icon: <FiClock size={142} />,
            navigatePath :'working_days_in_week',
        },
    ]
  return (
    <div className='px-9 py-7 w-full'>
        <div className="mx-auto w-[95%] h-auto flex flex-wrap">
            {content.map((item:any)=>(
                <div key={item.name} className="h-[200px]  w-[482px] m-6 rounded-xl cursor-pointer border-2  " 
                // style={{ bg-[#3366cc66]
                //     backgroundImage: `linear-gradient(135deg, white 20%, ${
                //       '#3366cc'
                //     } 80%`,
                //   }}
                onClick={()=>router.push(`${PATHS.SETTINGS}/${item.navigatePath}`)}
                  >
                   <GlareHover
                          className="flex justify-between p-5 shadow-lg dark:shadow-primary"
                          glareColor={`${
                            theme === "dark" ? "#ffffff" : "#3366cc"
                          }`}
                          height="198px"
                          width="480px"
                          glareOpacity={0.3}
                          glareAngle={-30}
                          // glareSize={100}
                          transitionDuration={800}
                          playOnce={false}
                        >
                   <p className='font-extrabold text-2xl my-2 capitalize'>{item.name}</p>
                   <span className='my-auto'>{item.icon}</span>
                        </GlareHover>
                   </div>
                  
            ))}
        </div>
    </div>
  )
}

export default Settings