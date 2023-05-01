import useUser from '@/hooks/useUser';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';

import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineHeart, AiFillHeart } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';

type NestedItemProps = {
    nestedReplay: NestedReplay;
    nestedMutatedReplay: any

    
};

const NestedItem:React.FC<NestedItemProps> = ({nestedReplay,nestedMutatedReplay}) => {
    const {data:user}=useUser(nestedReplay.userId as string)
    const isLiked=nestedReplay.likesId.includes(user?.id as string)
    const createdAt=useMemo(()=>{
        return formatDistanceToNowStrict(new Date(nestedReplay.createdAt),{addSuffix:true})

    },[nestedReplay.createdAt])
    const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;
    const onDelete=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        try {
            await axios.delete("/api/replay/nestedreplay/",{params:{replayId:nestedReplay.id}})
            nestedMutatedReplay()
            toast.success('replay deleted')
            
        } catch (error) {
            console.log(error)
            
        }
    },[nestedReplay.id,nestedMutatedReplay])
    
    return (
        <div className=' w-full p-2 my-1 cursor-pointer mt-2' >
        <div className='flex items-center'>
             <Avatar userId={nestedReplay.userId as string}/>
             <div className='flex items-center cursor-pointer hover:underline' >
             <p className='hidden md:block text-md font-semibold ml-2'>{user?.name}</p>
             <p className='truncate w-10 ml-2 md:hidden  text-md font-bold hover:underline' >{user?.name}</p>
             {user?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }
             </div>
             <p className='hidden md:block text-gray-500 mx-2'>{user?.customTag}</p>
             <p className='truncate w-10 md:hidden text-gray-500 mx-2'>{user?.customTag}</p>
             <p className='hidden md:block text-gray-400 mx-2'>{createdAt}</p>
             <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{createdAt}</p>
             { <AiOutlineDelete className='text-gray-400  cursor-pointer' onClick={onDelete} />}
         </div>
             <p className='text-md text-black text-lg  break-words ml-12 '>{nestedReplay.body}</p>
             <div className='flex items-center w-full gap-5 ml-2'>
                
                 <div
        
        className="
          flex 
          flex-row 
          items-center 
          text-neutral-500 
          gap-2 
          cursor-pointer 
          transition 
          hover:text-red-500
      ">
        <LikeIcon color={isLiked ? 'red' : ''} size={20}   />
        <p>
          {nestedReplay?.likesId.length||0}
        </p>
        </div>

             </div>
             
            </div>
    )
}
export default NestedItem;