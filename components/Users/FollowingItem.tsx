import { useRouter } from 'next/router';
import React from 'react';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';

type FollowingItemProps = {
    following:User
};

const FollowingItem:React.FC<FollowingItemProps> = ({following}) => {
    
    const router=useRouter()
    
    return (
        <div className='flex  sm:w-auto lg:w-full    items-center p-5'>
           <Avatar userId={following.id}/>
           <div className='flex flex-col ml-5'>
            <div className='flex items-center'>
                <p className='text-lg font-semibold cursor-pointer hover:underline' onClick={()=>router.push(`/users/${following.id}`)}>{following.name}</p>
                {following.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }

            </div>
                <p className='text-gray-500 text-sm'>{following.customTag}</p>
                <p className='text-gray-500 text-sm'>{following.bio}</p>
                
           </div>
        </div>
    )
}
export default FollowingItem;