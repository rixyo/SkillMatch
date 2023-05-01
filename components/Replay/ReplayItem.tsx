import useComment from '@/hooks/useComment';
import currentUser from '@/hooks/useCurrentUser';
import usePost from '@/hooks/usePost';
import useToggle from '@/hooks/useToggle';
import useUser from '@/hooks/useUser';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineHeart } from 'react-icons/ai';
import { MdVerified } from 'react-icons/md';
import Avatar from '../Avatar';


type ReplayItemProps = {
    replay:Replay
    mutatedReplay:any
    
};

const ReplayItem:React.FC<ReplayItemProps> = ({replay,mutatedReplay}) => {
    const {data:user}=useUser(replay.userId as string)
    const {mutate:mutatedPost}=usePost(replay.postId as string)
    const {mutate:mutatedComment}=useComment(replay.commentId as string)
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi;

  
   

    const router=useRouter()
    const {data:loginUser}=currentUser()
    const {login}=useToggle()
 
 
    const createdAt=useMemo(()=>{
        return formatDistanceToNowStrict(new Date(replay.createdAt),{addSuffix:true})

    },[replay.createdAt])
    const gotoReplay=useCallback((e:any)=>{
        e.stopPropagation()
        router.push(`/replay/${replay.id}`)
    },[router,replay.id])
    const onDelete=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        if(!loginUser){
            login()
            return

        }else{
            try {
                if(replay.userId!==loginUser?.user.id) {
                    toast.error("you can't delete this replay")
                    return
                    
                    
                   
                }else{
                    axios.delete("/api/comment/replay/",{params:{replayId:replay.id}})
                    mutatedReplay()
                    mutatedComment()
                    toast.success('replay deleted')
                    //router.push(`//${replay.postId}`)
                }
               
                
            } catch (error:any) {
                console.log(error.message)
                toast.error(error.response?.data?.error || error.message)
                
            }
        }

      
      },[loginUser,replay.id,mutatedReplay,mutatedPost,mutatedComment])

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
            mutatedReplay()
            toast.success("replay liked")
        }
        else{
            await axios.delete("/api/replay/like",{params:{replayId:replay?.id}})
            mutatedReplay()
        }
    },[replay?.id,isLiked,loginUser])
    
      const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;
    return (
        <div className=' w-full p-2 my-1 cursor-pointer mt-2' onClick={gotoReplay}>
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
                { <AiOutlineDelete className='text-gray-400  cursor-pointer' onClick={onDelete} />}
            </div>
            <div className=' mx-10'>
                <>

            {!linkRegex.test(replay.body) && <p className="text-md text-black break-words">{replay.body}</p> }   
               {replay.body.match(linkRegex) && (
                    <div>
                        <p>{replay.body.replace(linkRegex,"").trim()}</p>
                        {Array.from(replay.body.matchAll(linkRegex)).map((link,index)=>(
                       <li className='list-none'>
                       
                            <span   className='text-blue-500 hover:underline' key={index}>{link[0]}</span>
                          
                        
                         
                        
                       </li>
                  ))}
                    </div>
               )}

                </>
            </div>
                <div className='flex items-center w-full gap-5 ml-2'>
                    <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='replay'/>
                    <p className='text-gray-500'>{replay?.nestedReplays?.length||0}</p>
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
           <LikeIcon color={isLiked ? 'red' : ''} size={20} onClick={onLike}  />
           <p>
             {replay?.likesId.length}
           </p>
           </div>

                </div>
                
               </div>
          
        
    )
}
export default ReplayItem;


