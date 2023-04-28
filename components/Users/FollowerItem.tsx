import { useRouter } from 'next/router';
import React from 'react';
import Avatar from '../Avatar';

type FollowerItemProps = {
    follower:User
};

const FollowerItem:React.FC<FollowerItemProps> = ({follower}) => {
    const router=useRouter()
    
    return (
        <div className='flex rounded border-2 border-gray-400 my-5 sm:w-full   items-center p-5'>
           <Avatar userId={follower.id}/>
           <div className='flex flex-col ml-5'>
                <p className='text-lg font-semibold cursor-pointer hover:underline' onClick={()=>router.push(`/users/${follower.id}`)}>{follower.name}</p>
                <p className='text-gray-500 text-sm'>{follower.customTag}</p>
                <p className='text-gray-500 text-sm'>{follower.bio}</p>
                
           </div>
        </div>
    )
}
export default FollowerItem;