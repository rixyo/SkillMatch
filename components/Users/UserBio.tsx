import React, { useMemo } from 'react';
import useUser from '@/hooks/useUser'
import {format} from 'date-fns';
import Button from '../Button';
import useCurrentUser from '@/hooks/useCurrentUser';
import { BsCalendar4Week } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import useEditModal from '@/hooks/useEditModal';
type UserBioProps = {
    userId: string;
};

const UserBio:React.FC<UserBioProps> = ({userId}) => {
    const {data: fetchUser} = useUser(userId);
  const editModal=useEditModal()
    const {data: currentUser} = useCurrentUser()
    const createdAt=useMemo(()=>{
        if(!fetchUser?.createdAt) return null;
        return format(new Date(fetchUser.createdAt as string),'MMMM yyyy')
    },[fetchUser.createdAt])

    
    return(
        <div className='border-b-[1px]  border-gray-300 pb-4 '>
            <div className='flex justify-end mt-3'>
                {fetchUser.id ===currentUser?.user.id ? (
                    <>
                    <Button secondary label='Edit Profile' onClick={editModal.onOpen}/>
                    </>

                ):(
                    <>
                    <Button secondary label='Follow' onClick={()=>{}}/>
                    </>
                )}
    
            </div>
            <div className='mt-3 px-4'>
                <div className='flex flex-col'>
                    <div className='flex items-center'>
                <h1 className='font-bold text-2xl'>{fetchUser.name}</h1>
                {fetchUser.isVarified && <MdVerified className='text-blue-500  md:ml-2'/> }

                    </div>

                <p className='text-gray-500'>{fetchUser.customTag}</p>
                <p className='text-gray-500'>{fetchUser.bio}</p>
            
                    <div className='flex items-center text-gray-500'> <BsCalendar4Week className='mr-1'/>Joined {createdAt}</div>
                   
                 
                    <p>
                        <span className='font-bold'>{fetchUser.followingId.length}</span> <span className='text-gray-500'>
                        Following
                        </span>
                        <span className='font-bold  ml-3'>{fetchUser.followerId.length}</span> <span className='text-gray-500'>
                        Followers
                        </span>
                    </p>
                </div>

            </div>
        </div>
    )
}
export default UserBio;