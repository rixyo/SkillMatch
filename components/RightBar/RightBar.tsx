import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import useCurrentUser from '@/hooks/useCurrentUser';
import useUsers from '@/hooks/useUsers';
import Avatar from '../Avatar';
type FollowBarProps = {
    
};

const FollowBar:React.FC<FollowBarProps> = () => {
const {data:currentUser}=useCurrentUser()

const {data:users=[]}=useUsers()

if(users.length===0) return null

    return (
        <>
        {currentUser && 
        <div className='hidden xl:block xl:col-span-2 mt-2 ml-5 rounded-lg border-2 border-red-600'>
        <div className='flex flex-col'>
           <div className='w-auto mt-1 p-2' >
           <BsSearch className='w-5 h-5 absolute mt-1 ml-1  text-gray-500'/>
            <input   type="text"
            placeholder="Search"
            className="border-2 border-none  h-8 pr-3 pl-10 py-2 font-semibold place-holder-gray-500 text-black rounded-lg ring-2 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full" 
        
            />
         

           </div>
            <h1 className='font-bold text-2xl text-center'>Who To Follow</h1>
         {
            users.users.map((user: Record<string,any>)=>(

             <div key={user.id} className='flex flex-row gap-4 ml-5 mt-5 justify-start  '>
                 {currentUser.user.id!==user.id &&  <Avatar userId={user.id}/> }  
                   {currentUser.user.id!==user.id &&
                   <>
                   <div className='flex flex-col mt-3 cursor-pointer'>
                   <p className='font-semibold text-sm hover:underline '>{user.name}</p>
                     <p className='text-gray-500 text-sm'>{user.customTag}</p>
               </div>
                <button className='text-blue border-2 border-solid  w-1/3 h-1/2  my-3 mr-3 border-blue-400  text-lg font-medium rounded-lg'>Follow</button>
                   </>
                    } 


                </div>
            
            ))
         }
       
          
            </div>

    </div>
        }
        </>
      
    )
}
export default FollowBar;