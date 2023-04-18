import Avatar from '@/components/Avatar';
import Button from '@/components/Button';
import Header from '@/components/Header/Heder';
import useFollow from '@/hooks/useFollow';
import useGetFollower from '@/hooks/useGetFollower';
import useUser from '@/hooks/useUser';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { MdVerified } from 'react-icons/md';
import { RingLoader } from 'react-spinners';
import {useRouter} from 'next/router'
import useCurrentUser from '@/hooks/useCurrentUser';
import useLoginModal from '@/hooks/useLoginModal';
import axios from 'axios';
import toast from 'react-hot-toast';

type followerProps = {
    
};

const follower:React.FC<followerProps> = () => {
    const {data:followers,isLoading:followerDataLoading}=useGetFollower()
    const router=useRouter()
    const {userId}=router.query
    const {toggleFollow}=useFollow(userId as string)
    const {data:user,mutate:mutateFetchedUser}=useUser(userId as string)
    const {data:currentUser}=useCurrentUser()
  
  

 
  
   



    if(followerDataLoading) return(
        <div className='flex justify-center items-center h-full'>
            <RingLoader color={'#3B82F6'} loading={true} size={50} />

        </div>
    )
    
    return (
        <div className='flex w-full border-2 border-red-500 mx-5'>
            <div className='w-full'>

            <div className='flex flex-col items-start gap-0 cursor-pointer border-2 border-solid border-gray-400 w-full'>
         {user && 
         <Header showBackArrow label={user?.name as string} sublebel={user?.customTag as string} />
         }  
            </div>
            <div className=' w-full border-2 border-blue-500 mt-10'>
                {followers?.map((follower:User)=>(
                    <div className='flex items-center gap-2'>
                     
                   <Avatar userId={follower.id}                     
                   />
                   <div className='flex gap-0  flex-col'>
                    <div className='flex items-center gap-1 justify-between'>
                          <h1 className=' mx-2 mt-2 text-xl cursor-pointer hover:underline font-bold '>{follower.name}</h1>
                        {follower.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }  
                       
                        {
                follower.followerId.map((fId:string)=>(
                    <div className='flex items-center gap-2'>
                        {fId===currentUser?.user?.id && <button className='text-gray-500 text-lg mt-3 border-2 rounded-full border-gray-400 p-1 font-bold hover:text-red-500 hover:border-red-500'>Following</button>
                  
                        }
                    </div>
                ))
            }


                    </div>
                            <p className='text-md text-gray-400'>{follower.customTag}</p>

                            <p className='break-words text-xl font-mono text-gray-500'>{follower.bio}</p>
                   </div>
            
             
                    </div>
                ))}
            </div>
         
            </div>
          

        </div>
    )
}
export default follower;