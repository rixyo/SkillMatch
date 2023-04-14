import useCurrentUser from '@/hooks/useCurrentUser';
import React from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';



const sidebarFooter:React.FC = () => {
    const {data:currentUser}=useCurrentUser()

    
    return (
        <>
        {currentUser &&
        <div className='flex items-center justify-bwtween mt-60 lg:mt-96 border-2 border-solid border-gray-200 rounded-md md:p-1  md:ml-5 '>
             <Image src="/random.jpg" width={50} height={50} alt="name" className='rounded-full border-2 border-solid border-red-500'/>
            <div className='flex flex-col md:ml-5'>
            <div className='flex  items-center gap-2  '>
            <text className='ml-2 hover:underline hover:cursor-pointer  font-semibold text-lg' >{currentUser.user.name}</text>
          {currentUser.user.name==="Roixy" && <MdVerified className='text-blue-500'/> }  
            </div>
          
            <text className='text-gray-500 ml-1'>{currentUser.user.customTag}</text>
            </div>

            </div>}
        </>
    )
}
export default sidebarFooter;