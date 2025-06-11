"use client"
import { useRouter } from 'next/navigation';
import { Button } from 'react-day-picker';

export default function Home() {
  const router = useRouter();

  const handleClick = () => {
    router.push('/app/dashboard'); 
  };
  return (
    <div className='flex justify-between m-10'>
      AMARENDRA SAHOO 
      <button onClick={handleClick} className='border border-green-400 p-2 rounded hover:bg-green-400'>go to dashboard</button>
    </div>
  );
}
