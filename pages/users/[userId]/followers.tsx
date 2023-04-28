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
import FollowerItem from '@/components/Users/FollowerItem';

type followerProps = {
    
};

const followers:React.FC<followerProps> = () => {
    const router=useRouter()
    const {userId}=router.query
    const {data:followers,isLoading:followerDataLoading}=useGetFollower()

    const {data:user,mutate:mutateFetchedUser}=useUser(userId as string)
    const {data:currentUser}=useCurrentUser()
  
  

 
  
   



    if(followerDataLoading) return(
        <div className='flex justify-center items-center h-full'>
            <RingLoader color={'#3B82F6'} loading={true} size={50} />

        </div>
    )
    
    return (
        <div className='flex flex-col w-auto border-2 border-red-500 mx-5'>
          

        
         {user && 
         <Header showBackArrow label={user?.name as string} sublebel={user?.customTag as string} />
         }  
        
       
            <div className='flex  flex-col w- items-start border-2 border-blue-500'>
              {followers?.map((follower,index)=>(
                    <FollowerItem key={index} follower={follower} />
              ))}
            </div>
   
          

        </div>
    )
}
export default followers;