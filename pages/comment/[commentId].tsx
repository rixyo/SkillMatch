import Avatar from '@/components/Avatar';
import ReplaysFeed from '@/components/Replay/ReplaysFeed';
import useComment from '@/hooks/useComment';
import currentUser from '@/hooks/useCurrentUser';
import usePost from '@/hooks/usePost';
import useReplayModal from '@/hooks/useReplayModal';
import useToggle from '@/hooks/useToggle';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';



const commentId:React.FC = () => {
    const router=useRouter()
    const {commentId}=router.query
    

    const {data:comment,mutate:commentMutate}=useComment(commentId as string)
    const {data:post,mutate:postMutated}=usePost(comment?.postId as string)
  
    const ReplayModal=useReplayModal()
 
    const {data:loginUser}=currentUser()
    const {login}=useToggle()
    const {data:user}=useUser(comment?.userId as string)
    const [loading,setLoading]=useState<boolean>(false)
    const [body,setBody]=useState<string>("")
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
           
            commentMutate()
           postMutated()
            setBody("")
            toast.success("Replay successfully")
        } catch (error: any) {
            toast.error(error.response.data)
            
        } finally {
            setLoading(false)
        }

    },[body,comment?.id,commentMutate,])
    const deleteComment=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
          try {
              await axios.delete("/api/comment/comment/",{params:{commentId:comment?.id}})
              commentMutate()
              toast.success('comment deleted')
          } catch (error:any) {
              toast.error(error.response?.data?.error || error.message)
          }
      },[comment?.id,commentMutate])
      const isLiked=useMemo(()=>{
          const list=comment?.likesId || []
          return list.includes(loginUser?.user.id)
      },[comment?.likesId,loginUser?.user.id])
      const onLike=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
          event.stopPropagation()
          if(!loginUser){
              login()
              return
  
          }
          try {
              if(isLiked){
                  await axios.delete("/api/comment/like/",{params:{commentId:comment?.id}})
                  commentMutate()
                  router.push(`/posts/${comment?.postId}`)
              }else{
                  await axios.post("/api/comment/like/",{commentId:comment?.id})
                  commentMutate()
                  toast.success('comment liked')
  
              }
              
  
          } catch (error:any) {
              toast.error(error.response?.data?.error || error.message)
          }
      },[comment?.id,commentMutate,isLiked])
      const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;
     
    return (
     <div className='flex flex-col items-start p-2 w-full  my-2 mx-2 ' key={comment?.id} >
      <div className='flex items-center w-full ' onClick={()=>router.push(`/users/${comment?.userId}`)}>
          {comment &&  <Avatar userId={comment?.userId as string}/> } 
           {comment &&  <div className='flex items-center cursor-pointer hover:underline' >

            <p className='hidden md:block text-md font-semibold ml-2'>{user?.name}</p>
            <p className='truncate w-10 ml-2 md:hidden  text-md font-bold hover:underline' >{user?.name}</p>
            {user?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }
            </div>}
           <p className='hidden md:block text-gray-400 mx-2'>{user?.customTag}</p>
            <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{user?.customTag}</p>
            <p className='hidden md:block text-gray-400 mx-2'>{createdAt}</p>
            <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{createdAt}</p>
    
            {user?.id===comment?.userId && comment && <AiOutlineDelete className='text-gray-400  cursor-pointer' onClick={deleteComment}/>}
        </div>
        <p className='text-black text-lg ml-12'>{comment?.body}</p>
        <div className='flex items-center w-full gap-5 ml-2' >
      {comment &&  <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='replay' onClick={ReplayModal.onOpen} /> } 
     {comment && <p className='gap-2 text-gray-500 '>{comment?.replays.length}</p> } 
        
          
        
           
      {comment && <div
         
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
         <LikeIcon color={isLiked ? 'red' : ''} size={20} onClick={onLike} />
         <p>
           {comment?.likesId.length}
         </p>
     
       </div>
}
        </div>
        <div className='flex flex-col w-full'>

        <div className='w-full flex gap-2  mt-5'>
       <Avatar userId={loginUser?.user.id as string}/>
        <textarea
         className='w-full h-20 border-2 border-solid border-gray-300 disabled:opacity-80 peer resize-none mt-3  p-2 rounded-lg text-[20px] placeholder-gray-400 focus:outline-none ring-0 outline-none'
            placeholder="Replay"
            value={body}
            onChange={handleChange}
           
        />
       </div>
        <div className='flex justify-end mt-1 '>
            <button className='bg-sky-500 rounded-full  h-11 p-2 text-center text-white text-lg font-semibold w-20' onClick={onSubmit} >Replay</button>

        </div>
        </div>
     
       
     {comment?.replays &&  <ReplaysFeed replays={comment.replays}/> }  
        

    </div>


    )
}
export default commentId;