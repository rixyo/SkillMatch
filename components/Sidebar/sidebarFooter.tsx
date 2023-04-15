import useCurrentUser from '@/hooks/useCurrentUser';
import React, { useCallback } from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import { useRouter } from 'next/router';
import Avatar from '../Avatar';



const sidebarFooter:React.FC = () => {
    const {data:currentUser}=useCurrentUser()
    const router = useRouter();
    const onClick = useCallback((event: any) => {
        event.stopPropagation();
    
        const url = `/users/${currentUser.user.id}`;
    
        router.push(url);
      }, [router, currentUser]);

    
    return (
        <>
        {currentUser &&
        <div className='flex items-center justify-bwtween mt-60 lg:mt-96 border-2 border-solid border-gray-200 rounded-md md:p-1  md:ml-5 '>
            <Avatar userId={currentUser.user.id}/>
            <div className='flex flex-col md:ml-5 ml-2 '>
            <div className='flex  items-center gap-2  ' onClick={onClick}>
            <p className='ml-2 hover:underline hover:cursor-pointer  font-semibold text-lg' >{currentUser.user.name}</p>
          {currentUser.user.email==="rixy253@gmail.com" && <MdVerified className='text-blue-500'/> }  
            </div>
          
            <p className='text-gray-500 ml-1'>{currentUser.user.customTag}</p>
            </div>

            </div>}
        </>
    )
}
export default sidebarFooter;