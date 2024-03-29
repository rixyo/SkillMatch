
import React, { useEffect, useMemo, useState } from 'react';
import useUser from '@/hooks/useUser'
import {format} from 'date-fns';
import Button from '../Button';
import useCurrentUser from '@/hooks/useCurrentUser';
import { BsCalendar4Week } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import useEditModal from '@/hooks/useEditModal';
import useFollow from '@/hooks/useFollow';
import {toast} from "react-hot-toast"
import { BiMessageSquareDots } from 'react-icons/bi';
import { useRouter } from 'next/router';

type UserBioProps = {
    userId: string;
};

const UserBio:React.FC<UserBioProps> = ({userId}) => {

    
    const {data: fetchUser} = useUser(userId)
 
    const router=useRouter()
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi;
   
    
    
  
    const editModal=useEditModal()
    const {data: currentUser} = useCurrentUser()
    const createdAt=useMemo(()=>{
        if(!fetchUser?.createdAt) return null;
        return format(new Date(fetchUser.createdAt),'MMMM yyyy')
    },[fetchUser?.createdAt])


    const {isFollowing,toggleFollow,isFollower}=useFollow(userId)

    
    return(
        <div className='border-b-[1px]  border-gray-300 p-2 '>
            <div className='flex justify-end mt-3'>
                { fetchUser && fetchUser.id ===currentUser?.user.id ? (
                    <>
                    <Button secondary label='Edit Profile' onClick={editModal.onOpen}/>
                    </>

                ):(
                    <>
                    <div className='flex items-center gap-2'>
                    {isFollower && 
                    <BiMessageSquareDots size={30} className="text-gray-500 border-2 border-solid rounded-md border-gray-500  cursor-pointer" title='message' onClick={()=>toast.error("Feature is not implemented")}/>
                   
                    } 
                   <button
                   className={` text-black font-bold py-2 px-4 rounded-full ${isFollowing?"hover:text-red-500":""}
                   ${isFollowing?"border-2 border-solid border-red-500":"border-2 border-solid rounded-lg border-blue-300 hover:border-gray-200 p-2"}
                   `}
                  
                   onClick={toggleFollow}
                   >{isFollowing?"Unfollow":"Follow"}</button>

                    </div>
               
                   
                    </>
                )}
    
            </div>
            <div className='mt-3 px-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                <h1 className='font-bold text-2xl'>{fetchUser?.name}</h1>
                {fetchUser?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/> }

                    </div>

                <p className='text-gray-500'>{fetchUser?.customTag}</p>
              {fetchUser?.bio && !linkRegex.test(fetchUser.bio) && <p className='text-gray-500'>{fetchUser?.bio}</p> }  
            {fetchUser?.bio?.match(linkRegex)&&(
                <div className='mt-0'>
                    <p className='break-all'>{fetchUser?.bio.replace(linkRegex,"").trim()}</p>
                  {Array.from(fetchUser?.bio.matchAll(linkRegex)).map((link,index)=>(
                       <li className='list-none'>
                          <a href={link[0]} target='_blank' className='text-blue-500 hover:underline' key={index}>{link[0].split("https://")[1]}</a>
                       </li>
                  ))}
                </div>
            )}
                    <div className='flex items-center text-gray-500'> <BsCalendar4Week className='mr-1'/>Joined {createdAt}</div>
                   
                 
               {fetchUser && 
                 <p>
                 <span className='font-bold cursor-pointer hover:underline' onClick={()=>router.push(`/user/${userId}/following`)}>{fetchUser?.followingId.length}</span> <span className='text-gray-500 cursor-pointer hover:underline' onClick={()=>router.push(`/user/${userId}/following`)}>
                 Following
                 </span>
                 <span className='font-bold  ml-3 cursor-pointer hover:underline' onClick={()=>router.push(`/user/${userId}/followers`)}>{fetchUser?.followerId.length}</span> <span className='text-gray-500 cursor-pointer hover:underline'  onClick={()=>router.push(`/user/${userId}/followers`)}>
                 Followers
                 </span>
             </p>
               }   
                </div>


            </div>
        </div>
    )
}
export default UserBio;