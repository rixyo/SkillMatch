import currentUser from '@/hooks/useCurrentUser';
import useReplayModal from '@/hooks/useReplayModal';
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
import useReplays from '@/hooks/useReplays';
import ReplayItem from '../Replay/ReplayItem';




type CommentItemProps = {
    comment: comment
   
};

const CommentItem:React.FC<CommentItemProps> = ({comment}) => {
    const {data:user}=useUser(comment.userId)
    const router=useRouter()
    const {data:loginUser}=currentUser()
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi
    const {data:replays,mutate:mutatedReplay}=useReplays(comment.id as string)
   
   

    const {login}=useToggle()
    const createdAt=useMemo(()=>{
        return formatDistanceToNowStrict(new Date(comment.createdAt),{addSuffix:true})

    },[comment.createdAt])
    const gotoComment=useCallback((event:any)=>{
        event.stopPropagation()
        router.push(`/comment/${comment.id}`)
    },[])
    const deleteComment=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
      event.stopPropagation()
        try {
            await axios.delete("/api/comment/comment/",{params:{commentId:comment.id}})
           // commentMutate()
            toast.success('comment deleted')
        } catch (error:any) {
            toast.error(error.response?.data?.error || error.message)
        }
    },[comment.id,])
    const isLiked=useMemo(()=>{
        const list=comment.likesId || []
        return list.includes(loginUser?.user.id)
    },[comment.likesId,loginUser?.user.id])
    const onLike=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        if(!loginUser){
            login()
            return

        }
        try {
            if(isLiked){
                await axios.delete("/api/comment/like/",{params:{commentId:comment.id}})
                //commentMutate()
            }else{
                await axios.post("/api/comment/like/",{commentId:comment.id})
                //commentMutate()
                toast.success('comment liked')

            }
            

        } catch (error:any) {
            toast.error(error.response?.data?.error || error.message)
        }
    },[comment.id,,isLiked])
    const LikeIcon = isLiked ? AiFillHeart : AiOutlineHeart;
    return (
        <div className='flex flex-col items-start p-3 w-full  my-2' key={comment.id} onClick={gotoComment} >
            <div className='flex items-center' >
                <Avatar userId={comment.userId}/>
                <div className='flex items-center cursor-pointer hover:underline' >

                <p className='hidden md:block text-md font-semibold ml-2'>{user?.name}</p>
                <p className='truncate w-10 ml-2 md:hidden  text-md font-bold hover:underline' >{user?.name}</p>
                {user?.isVarified && <MdVerified className='text-blue-500  md:ml-2'/>  }
                </div>
                <p className='hidden md:block text-gray-400 mx-2'>{user?.customTag}</p>
                <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{user?.customTag}</p>
                <p className='hidden md:block text-gray-400 mx-2'>{createdAt}</p>
                <p className='truncate w-10 md:hidden text-gray-400 mx-2'>{createdAt}</p>
                {loginUser?.user.id===comment.userId && <AiOutlineDelete className='text-gray-400 ml-auto cursor-pointer' onClick={deleteComment}/>}
            </div>
            <div className=' mx-10 w-full'>
                <>

            {!linkRegex.test(comment.body) && <p className="text-md text-black break-words">{comment.body}</p> }   
               {comment.body.match(linkRegex) && (
                    <div>
                        <p className='text-md text-black break-words '>{comment.body.replace(linkRegex,"").trim()}</p>
                        {Array.from(comment.body.matchAll(linkRegex)).map((link,index)=>(
                       <li className='list-none'>
                       
                            <span   className='text-blue-500 hover:underline break-words ' key={index}>{link[0]}</span>
                           
                        
                         
                        
                       </li>
                  ))}
                    </div>
               )}

                </>
                {
                     
                 replays && replays.length>=2? <div>
                        <ReplayItem replay={replays[0]} key={0} mutatedReplay={mutatedReplay}/>
                    <span className='text-md text-sky-500 cursor-pointer hover:underline'>Show More</span>
                 </div>   :(
                    replays?.map((replay:Replay,index)=>(
                        <div className='hidden md:flex flex-col w-full '>
                        <ReplayItem replay={replay} key={index} mutatedReplay={mutatedReplay}/>
                        </div>
                    ))
                    )
                   
                }
            </div>
            <div className='flex items-center w-full gap-5 ml-2' >
                <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='replay' onClick={gotoComment} />
                <p className='  text-neutral-500 '>{comment?.replays?.length}</p>
            
              
            
               
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
             <LikeIcon color={isLiked ? 'red' : ''} size={20} onClick={onLike} />
             <p>
               {comment.likesId.length}
             </p>
         
           </div>
            </div>

        </div>
    )
}
export default CommentItem;