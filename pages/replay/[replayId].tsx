import Avatar from '@/components/Avatar';
import NestedReplayFeed from '@/components/nestedreplay/NestedReplayFeed';
import useComment from '@/hooks/useComment';
import currentUser from '@/hooks/useCurrentUser';
import useNestedModal from '@/hooks/useNestedModal';
import usePost from '@/hooks/usePost';
import useReplay from '@/hooks/useReplay';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineDelete, AiOutlineComment, AiFillHeart, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';


export async function getServerSideProps(context:NextPageContext) {
    const session = await getSession(context)
    if(!session){
        return{
            redirect:{
            destination:"/",
            permanent:false
            }
        }
    }
    return {
        props: { session },
    }
  }
const replayId:React.FC = () => {
    const router=useRouter()
    const {replayId}=router.query
    const {data:replay,mutate:mutatedReplay}=useReplay(replayId as string)
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi
   
    const {mutate:mutatedComment}=useComment(replay?.commentId as string)
    const {mutate:mutatedNestedReplay}=useComment(replayId as string)
    const {data:comment}=useComment(replay?.commentId as string)
    const {mutate:mutatedPost}=usePost(comment?.postId as string)
    const {data:loginUser}=currentUser()
    const {data:user}=useUser(replay?.userId as string)
    const nestedModal=useNestedModal()
    const [body,setBody]=useState<string>("")
    const [characterRemaning,setCharacterRemaing]=useState<number>(140)
    const [bodyLength,setBodyLength]=useState<number>(0)
    const handleChange= useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        if(e.target.value.length > 140) return 
        setBody(e.target.value)
        setBodyLength(e.target.value.length)
        setCharacterRemaing(140 - e.target.value.length)
    },[setBody,setBodyLength,setCharacterRemaing])
    
    const createdAt=useMemo(()=>{
        if(!replay?.createdAt) return ""
        else{
            return formatDistanceToNowStrict(new Date(replay.createdAt),{addSuffix:true})

        }
    },[comment?.createdAt])
    const onSubmit=useCallback(async()=>{
        try {
            if(body.length<=0) return toast.error("Please enter replay")
            else if(body.length>140) return toast.error("Replay must be less than 140 characters")
        
            else{
            await axios.post(`/api/replay/nestedreplay/`,{body,replayId:replay?.id})
            mutatedPost()
            mutatedComment()
            mutatedReplay()
            mutatedNestedReplay()
           setBody("")
           toast.success("Replay added")
            }
        } catch (error:any) {
            toast.error(error.response.data)
        }

    },[body,replay?.id])
    const isLiked=useMemo(()=>{
        if(!loginUser) return false
        else{
            return replay?.likesId.includes(loginUser?.user.id)
        }
    },[loginUser?.user.id,replay?.likesId])
    const onLike=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        if(!loginUser) return
        else if(!isLiked){
            await axios.post("/api/replay/like",{replayId:replay?.id})
            mutatedPost()
            mutatedComment()
            mutatedReplay()
            toast.success("replay liked")
        }
        else{
            await axios.delete("/api/replay/like",{params:{replayId:replay?.id}})
            mutatedPost()
            mutatedComment()
            mutatedReplay()
        }
    },[replay?.id,isLiked,loginUser])
  

    const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;
    
    return(
        <div className='flex flex-col items-start p-2 w-full  my-2 mx-2 ' key={replay?.id} >
        <div className='flex items-center w-full ' onClick={()=>router.push(`/users/${replay?.userId}`)}>
            {replay &&  <Avatar userId={replay?.userId as string}/> } 
             {replay &&  <div className='flex items-center cursor-pointer hover:underline' >
  
              <p className='hidden md:block text-md font-semibold ml-2'>{user?.name}</p>
              <p className='truncate w-10 ml-2 md:hidden  text-md font-bold hover:underline' >{user?.name}</p>
              {user?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }
              </div>}
             <p className='hidden md:block text-gray-400 mx-2'>{user?.customTag}</p>
              <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{user?.customTag}</p>
              <p className='hidden md:block text-gray-400 mx-2'>{createdAt}</p>
              <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{createdAt}</p>
      
              {loginUser?.user.id===replay?.userId && <AiOutlineDelete className='text-gray-400  cursor-pointer' />}
          </div>
          <div className=' mx-10'>
                <>

            {replay &&!linkRegex.test(replay.body) && <p className="text-md text-black break-words">{replay.body}</p> }   
               {replay?.body.match(linkRegex) && (
                    <div>
                        <p>{replay.body.replace(linkRegex,"").trim()}</p>
                        {Array.from(replay.body.matchAll(linkRegex)).map((link,index)=>(
                       <li className='list-none'>
                        <Link href={link[0].includes('http') ? link[0] : `https://${link[0]}`} key={index}>
                            <span   className='text-blue-500 hover:underline' key={index}>{link[0]}</span>
                            </Link>
                        
                         
                        
                       </li>
                  ))}
                    </div>
               )}

                </>
            </div>
          <div className='flex items-center w-full gap-5 ml-2' >
        {replay &&  <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='replay' onClick={nestedModal.onOpen} /> } 
       {replay && <p className='gap-2 text-gray-500 '>{replay?.nestedReplays?.length}</p> } 
          
            
          
             
        {replay && <div
           
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
           <LikeIcon color={isLiked ? 'red' : ''} size={20} onClick={onLike}  />
           <p>
             {replay?.likesId.length}
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
              <button className='bg-sky-500 rounded-full  h-11 p-2 text-center text-white text-lg font-semibold w-20'onClick={onSubmit} >Replay</button>
  
          </div>
          </div>
          <NestedReplayFeed replayId={replay?.id as string}/>
       
         
    
          
  
      </div>
    )
}
export default replayId;