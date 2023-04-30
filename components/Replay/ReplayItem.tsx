import useUser from '@/hooks/useUser';
import { formatDistanceToNowStrict } from 'date-fns';
import React, { useMemo } from 'react';
import { AiOutlineComment, AiOutlineDelete } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';

type ReplayItemProps = {
    replay:Replay
    
};

const ReplayItem:React.FC<ReplayItemProps> = ({replay}) => {
    const {data:user}=useUser(replay.userId as string)
    console.log(user)
    const createdAt=useMemo(()=>{
        return formatDistanceToNowStrict(new Date(replay.createdAt),{addSuffix:true})

    },[replay.createdAt])
    return (
        <div className=' w-full p-2 my-1    mt-2'>
           <div className='flex items-center'>
                <Avatar userId={replay.userId as string}/>
                <div className='flex items-center cursor-pointer hover:underline' >
                <p className='hidden md:block text-md font-semibold ml-2'>{user?.name}</p>
                <p className='truncate w-10 ml-2 md:hidden  text-md font-bold hover:underline' >{user?.name}</p>
                {user?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }
                </div>
                <p className='hidden md:block text-gray-500 mx-2'>{user?.customTag}</p>
                <p className='truncate w-10 md:hidden text-gray-500 mx-2'>{user?.customTag}</p>
                <p className='hidden md:block text-gray-400 mx-2'>{createdAt}</p>
                <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{createdAt}</p>
                { <AiOutlineDelete className='text-gray-400  cursor-pointer' />}
            </div>
                <p className='text-md text-black text-lg  break-words ml-12 '>{replay.body}</p>
                <div className='flex items-center w-full gap-5 ml-2'>
                    <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='replay'/>

                </div>
           
            </div>
          
        
    )
}
export default ReplayItem;