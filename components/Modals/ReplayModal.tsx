import React, { useCallback, useMemo, useState } from 'react';
import axios from 'axios';
import Modal from './Modal';
import useReplayModal from '@/hooks/useReplayModal';
import Input from '../Input';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
import useComment from '@/hooks/useComment';
import Avatar from '../Avatar';
import useUser from '@/hooks/useUser';
import { MdVerified } from 'react-icons/md';
import { formatDistanceToNowStrict } from 'date-fns';
import currentUser from '@/hooks/useCurrentUser';
import usePost from '@/hooks/usePost';


const ReplayModal:React.FC = () => {
    const replayModal=useReplayModal()
    const router=useRouter()
    const {commentId}=router.query
    const {data:loginUse}=currentUser()
    const {data:comment,mutate:mutatedComment}=useComment(commentId as string)
    const {data:post,mutate:mutatedPost}=usePost(comment?.postId as string)
    const {data:user}=useUser(comment?.userId as string)
    const [body,setBody]=useState<string>("")
    const [loading,setLoading]=useState<boolean>(false)
    const [characterRemaning,setCharacterRemaing]=useState<number>(50)
    const [bodyLength,setBodyLength]=useState<number>(0)
    const handleChange= useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        if(e.target.value.length > 50) return 
        setBody(e.target.value)
        setBodyLength(e.target.value.length)
        setCharacterRemaing(50 - e.target.value.length)
    },[setBody,setBodyLength,setCharacterRemaing])
    const createdAt=useMemo(()=>{
        if(!comment?.createdAt) return ""
        else{
            return formatDistanceToNowStrict(new Date(comment?.createdAt),{addSuffix:true})

        }  

    },[comment?.createdAt])
    const onSubmit=useCallback(async()=>{
        try {
            setLoading(true)
            if(body.length<=0) return toast.error("Please enter replay")
           

            await axios.post(`/api/comment/replay/`,{body,commentId:comment?.id,postId:post?.id})
            replayModal.onClose()
            mutatedComment()
            mutatedPost()
            setBody("") 
            toast.success("Replay successfully")
        } catch (error: any) {
            toast.error(error.response.data)
            
        } finally {
            setLoading(false)
        }

    },[body,comment?.id,post?.id,mutatedComment,mutatedPost,replayModal])
     
    
  
    

    const bodyContent=(
        <div className='p-2 w-full'>
           

            <div className='flex items-center justify-start '>
         
                <Avatar userId={comment?.userId as string} />
                <div className='flex items-center mx-2'>
                    <p className='text-xl font-semibold cursor-pointer hover:underline'>{user?.name}</p>
                    {user?.isVarified  && <MdVerified className='text-blue-500  md:ml-2'/>  }
              
                </div>
                <p className='text-gray-500 text-lg'>{user?.customTag}</p>
                <p className='text-gray-400 text-lg mx-2'>{createdAt}</p>

                </div>
            <p className='text-black text-md  ml-12'>{comment?.body}</p>
       {comment?.userId!==loginUse?.user.id && <p className='text-gray-500 text-lg ml-12'>Replay to <span className='text-blue-500 hover:cursor-pointer'>@{user?.name }</span></p>}
       <div className='w-full flex gap-2 '>
       <Avatar userId={loginUse?.user.id as string}/>
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
        <Modal onClose={replayModal.onClose} onSubmit={onSubmit}
                
        actionLabel="Replay" isOpen={replayModal.isOpen}
        title="Replay" body={bodyContent}
              />
    )
}
export default ReplayModal;