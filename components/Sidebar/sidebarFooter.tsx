import useCurrentUser from '@/hooks/useCurrentUser';
import React, { useCallback } from 'react';
import { MdVerified } from 'react-icons/md';
import { useRouter } from 'next/router';
import Avatar from '../Avatar';




const sidebarFooter:React.FC = () => {
    const {data:currentUser}=useCurrentUser()
    const router = useRouter();
    const gotoProfile = useCallback((event: any) => {
        event.stopPropagation();
    
        const url = `/user/${currentUser.user.id}`;
    
        router.push(url);
      }, [router, currentUser]);

    
    return (
        <>
        {currentUser &&
        <div className='flex items-center sm:justify-start mt-24   rounded-md md:p-1' >
     
         <Avatar userId={currentUser.user.id}/>
           
            <div className='hidden md:flex flex-col md:ml-5 ml-2'>
            <div className='flex  items-center'>
            <p className='md:ml-2 hover:underline hover:cursor-pointer  font-semibold text-lg' onClick={gotoProfile} >
              <span className='hidden md:block'>{currentUser.user.name}</span>
              </p>
          {currentUser.user.isVarified && <MdVerified className='text-blue-500 hidden md:block md:ml-2'/> }  
            </div>
            <p className='text-gray-500 text-sm hidden md:block md:ml-2 '>{currentUser.user.customTag}</p>
          
           
            </div>

            </div>}
        </>
    )
}
export default sidebarFooter;