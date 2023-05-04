import Avatar from '@/components/Avatar';
import currentUser from '@/hooks/useCurrentUser';
import useNestedReplay from '@/hooks/useNestedReplay';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';



const nestedreplayId:React.FC = () => {
   const router=useRouter()
    const {nestedreplayId}=router.query
    const {data:nestedReplay,mutate:nestedMutatedReplay}=useNestedReplay(nestedreplayId as string)
    const {data:user}=useUser(nestedReplay?.userId as string)
   
    const {data:loginUser}=currentUser()
   
   
    
    
    const isLiked=useMemo(()=>{
        return nestedReplay?.likesId.includes(loginUser?.user?.id)

    },[nestedReplay?.likesId,loginUser?.user?.id])
    console.log(isLiked)
   
    const createdAt=useMemo(()=>{
        if(!nestedReplay) return
        return  formatDistanceToNowStrict(new Date(nestedReplay.createdAt),{addSuffix:true})

    },[nestedReplay?.createdAt])
    const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;
    const onDelete=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        try {
            await axios.delete("/api/replay/nestedreplay/",{params:{nestedreplayId:nestedReplay?.id}})
            nestedMutatedReplay()
            toast.success('replay deleted')
            
        } catch (error:any) {
            console.log(error)
            toast.error(error.response.data)
            
        }
    },[nestedReplay?.id,nestedMutatedReplay])
    const onLike=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        try {
            if(isLiked){
                await axios.delete("/api/nestedreplay/like",{params:{nestedreplayId:nestedReplay?.id}})
                nestedMutatedReplay()
                return
            }
            await axios.post("/api/nestedreplay/like",{nestedreplayId:nestedReplay?.id})
            nestedMutatedReplay()
            toast.success('liked')
            
        } catch (error:any) {
            console.log(error)
            toast.error(error.response.data)
            
        }
    },[])
  
    
    return (
        <div className=' w-full p-2 my-1 cursor-pointer mt-2' >
        <div className='flex items-center'>
             <Avatar userId={nestedReplay?.userId as string}/>
             <div className='flex items-center cursor-pointer hover:underline' >
             <p className='hidden md:block text-md font-semibold ml-2'>{user?.name}</p>
             <p className='truncate w-10 ml-2 md:hidden  text-md font-bold hover:underline' >{user?.name}</p>
             {user?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }
             </div>
             <p className='hidden md:block text-gray-500 mx-2'>{user?.customTag}</p>
             <p className='truncate w-10 md:hidden text-gray-500 mx-2'>{user?.customTag}</p>
             <p className='hidden md:block text-gray-400 mx-2'>{createdAt?.split("ago")[0]}</p>
             <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{createdAt?.split("ago")[0]}</p>
             {nestedReplay?.userId ===loginUser?.user.id && <AiOutlineDelete className='text-gray-400  cursor-pointer' onClick={onDelete} />}
         </div>
             <p className='text-md text-black text-lg  break-words ml-12 '>{nestedReplay?.body}</p>
             <div className='flex items-center w-full gap-5 ml-2'>
             <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='replay' />
                
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
        <LikeIcon color={isLiked ? 'red' : ''} size={20} onClick={onLike}   />
        <p>
          {nestedReplay?.likesId.length||0}
        </p>
        </div>

             </div>
             <div className='flex flex-col w-full'>

<div className='w-full flex gap-2  mt-5'>
<Avatar userId={loginUser?.user.id as string}/>
<textarea
 className='w-full h-20 border-2 border-solid border-gray-300 disabled:opacity-80 peer resize-none mt-3  p-2 rounded-lg text-[20px] placeholder-gray-400 focus:outline-none ring-0 outline-none'
    placeholder="Replay"
  
   
/>
</div>
<div className='flex justify-end mt-1 '>
    <button className='bg-sky-500 rounded-full  h-11 p-2 text-center text-white text-lg font-semibold w-20'>Replay</button>

</div>
</div>
            </div>
    )
}
export default nestedreplayId