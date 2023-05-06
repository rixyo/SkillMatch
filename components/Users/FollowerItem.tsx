import useCurrentUser from '@/hooks/useCurrentUser';
import { data } from 'autoprefixer';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';

type FollowerItemProps = {
    follower:User
};

const FollowerItem:React.FC<FollowerItemProps> = ({follower}) => {
    const router=useRouter()
    const {data:currentUser,mutate:mutateUser}=useCurrentUser()
    const isFollowing=useMemo(()=>{
        const list = currentUser?.user.followingId || [];

    return list.includes(follower.id);
    },[currentUser?.user.followingId,follower.id])
    const handleClick=useCallback(()=>{
        if(isFollowing){
            
            axios.delete('/api/follow',{params:{userId:follower.id} } );
            mutateUser()
            toast.success("Unfollow")
        }else{
           
            axios.post('/api/follow',{userId:follower.id})
            mutateUser()
            toast.success("Followed")
        }

     },[follower.id])
    return (
        <div className='flex w-11/12 items-center'>

      
        <div className='flex  sm:w-auto lg:w-full    items-center p-5'>
           <Avatar userId={follower.id}/>
           <div className='flex flex-col ml-5'>
            <div className='flex items-center'>
                <p className='text-lg font-semibold cursor-pointer hover:underline' onClick={()=>router.push(`/user/${follower.id}`)}>{follower.name}</p>
             {follower.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }   

            </div>
                <p className='text-gray-500 text-sm'>{follower.customTag}</p>
                <p className='text-gray-500 text-sm'>{follower.bio}</p>
                
           </div>
        </div>
        <div>
        <button className={`rounded-full w-full  border-2 border-gray-400 ${isFollowing?"bg-white":" bg-black text-white"} mx-2 p-2 text-lg font-bold'  `} onClick={handleClick}  >{isFollowing?"UnFollow":"Follow"}</button>
        </div>
        </div>
    )
}
export default FollowerItem;