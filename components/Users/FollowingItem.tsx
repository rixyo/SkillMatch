import currentUser from '@/hooks/useCurrentUser';
import useUsers from '@/hooks/useUsers';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import toast from 'react-hot-toast';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';

type FollowingItemProps = {
    following:User
};

const FollowingItem:React.FC<FollowingItemProps> = ({following}) => {
    const [follow,setfollowing]=useState<string>("Following")
    const {mutate:mutatedUser}=useUsers()
    const {mutate:loginUser}=currentUser()
    
    const router=useRouter()
    const unFollow=useCallback(async()=>{

       await axios.delete('/api/follow',{params:{userId:following.id} } )
         mutatedUser()
            loginUser()
       toast.success("Unfollow")
    },[following.id])
    
    return (
        <div className='flex items-center w-11/12 justify-center'>

      
        <div className='flex  sm:w-auto lg:w-full items-center p-5'>
           <Avatar userId={following.id}/>
           <div className='flex flex-col ml-5'>
            <div className='flex items-center'>
                <p className='text-lg font-semibold cursor-pointer hover:underline' onClick={()=>router.push(`/user/${following.id}`)}>{following.name}</p>
                {following.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }

            </div>
                <p className='text-gray-500 text-sm'>{following.customTag}</p>
                <p className='text-gray-500 text-sm'>{following.bio}</p>
                
           </div>
          
        </div>
        <div>
            <button className='rounded-full hover:text-red-500 border-2 border-gray-400 bg-white mx-2 p-2 text-lg text-gray-600' onClick={unFollow} onMouseOver={()=>setfollowing("UnFollow")} onMouseOut={()=>setfollowing("Following")}>{follow}</button>
        </div>
        </div>
    )
}
export default FollowingItem;