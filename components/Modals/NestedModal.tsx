
import useComment from '@/hooks/useComment';
import currentUser from '@/hooks/useCurrentUser';
import useNestedModal from '@/hooks/useNestedModal';
import useReplay from '@/hooks/useReplay';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';
import Modal from './Modal';


const NestedModal:React.FC = () => {
    const nestedModal=useNestedModal()
    const router=useRouter()
    const {replayId}=router.query
    const {data:replay,mutate:mutatedReplay}=useReplay(replayId as string)
   // const {mutate:mutatedComment}=useComment(replay?.commentId as string)
    const {mutate:mutatedNestedReplay}=useReplay(replay?.id as string)
   const {data:loginUser}=currentUser()
   const {data:user}=useUser(replay?.userId as string)
   const [body,setBody]=useState<string>("")
    const [characterRemaning,setCharacterRemaing]=useState<number>(140)
    const [bodyLength,setBodyLength]=useState<number>(0)
    const handleChange= useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        if(e.target.value.length > 140) return 
        setBody(e.target.value)
        setBodyLength(e.target.value.length)
        setCharacterRemaing(140 - e.target.value.length)
    },[setBody,setBodyLength,setCharacterRemaing])
    const onSubmit=useCallback(async()=>{
        try {
            if(body.length<=0) return toast.error("Please enter replay")
            else if(body.length>140) return toast.error("Replay must be less than 140 characters")
        
            else{
            await axios.post(`/api/replay/nestedreplay/`,{body,replayId:replay?.id})
         
            mutatedReplay()
            mutatedNestedReplay()
           setBody("")
           toast.success("Replay added")
           nestedModal.onClose()
            }
        } catch (error:any) {
            toast.error(error.response.data)
        }

    },[body,replay?.id])
   const createdAt=useMemo(()=>{
    if(!replay?.createdAt) return ""
    else{
        return formatDistanceToNowStrict(new Date(replay.createdAt),{addSuffix:true})

    }  

},[replay?.createdAt])
   

    const bodyContent=(
        <div className='p-2 w-full'>
           

        <div className='flex items-center justify-start '>
     
            <Avatar userId={replay?.userId as string} />
            <div className='flex items-center mx-2'>
                <p className='text-xl font-semibold cursor-pointer hover:underline'>{user?.name}</p>
                {user?.isVarified  && <MdVerified className='text-blue-500  md:ml-2'/>  }
          
            </div>
            <p className='text-gray-500 text-lg'>{user?.customTag}</p>
            <p className='text-gray-400 text-lg mx-2'>{createdAt}</p>

            </div>
        <p className='text-black text-md  ml-12'>{replay?.body}</p>
   {replay?.userId!==loginUser?.user.id && <p className='text-gray-500 text-lg ml-12'>Replay to <span className='text-blue-500 hover:cursor-pointer'>@{user?.name }</span></p>}
   <div className='w-full flex gap-2 '>
   <Avatar userId={loginUser?.user.id as string}/>
    <textarea
     className='w-full h-20 disabled:opacity-80 peer resize-none mt-3  p-2 rounded-lg text-[20px] placeholder-gray-400 focus:outline-none ring-0 outline-none'
        placeholder="Replay"
        value={body}
        onChange={handleChange}
        
    />
   </div>
    
   
   </div>
    )
    
    return(
        <Modal 
        onClose={nestedModal.onClose}
        isOpen={nestedModal.isOpen}
      onSubmit={onSubmit}
        title="Replay"
        actionLabel='Submit'
        body={bodyContent}


        />
    )
}
export default NestedModal;