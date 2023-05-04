import Avatar from '@/components/Avatar';
import Form from '@/components/Form';
import CommentsFeed from '@/components/posts/CommentsFeed';
import useCurrentUser from '@/hooks/useCurrentUser';
import usePostEditModal from '@/hooks/useEditPostModal';
import useLike from '@/hooks/useLike';
import usePost from '@/hooks/usePost';
import useToggle from '@/hooks/useToggle';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineEdit, AiOutlineHeart } from 'react-icons/ai';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { CircleLoader } from 'react-spinners';

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

const postId:React.FC = () => {
    const router = useRouter();
    const { postId } = router.query;
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi;
    const mentionRegex = /@(\w+)/g
    const {data:currentUser}=useCurrentUser()
    const {onOpen}=usePostEditModal()
    const {data:post, isLoading, mutate}=usePost(postId as string)
    const {hasLiked,toggleLike}=useLike({postId:postId as string,userId:currentUser?.id})
    const {login}=useToggle()

    const deletePost=useCallback(async()=>{
        try {
            await axios.delete(`/api/posts/`,{params:{postId:post?.id}})
            toast.success("Post deleted successfully")
            mutate()
            router.push("/")


        
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.response?.data?.error || error.message)
        }
    },[post?.id,router,mutate])
    const onLike = useCallback((event:React.MouseEvent<SVGElement,MouseEvent>) => {
        event.stopPropagation();
        if(!currentUser){
            login()
            return
        }
        toggleLike()

    }, [login,currentUser,toggleLike]);

    const createdAt=useMemo(()=>{
        if(!post?.createdAt) return ""
        else{
            return formatDistanceToNowStrict(new Date(post.createdAt),{addSuffix:true})

        }
    },[post?.createdAt])
    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    return(
       <>
       {isLoading ? <div className="flex justify-center items-center h-full">
    <CircleLoader color="#3B82F6"  size={50} />
       </div> :
     
       <div
       className="flex flex-col border-2 border-solid border-gray-200 p-5 cursor-pointer rounded-lg   my-5 mx-2 hover:border-gray-200"
       >
     <div className='flex items-start gap-1'>
               <Avatar
               userId={post?.userId as string}
               />
               <div className='flex items-center md:gap-2 '  >
                   <p className='hidden md:block text-md  font-bold hover:underline' >{post?.user?.name}</p>
                   <p className='truncate w-10 md:hidden  text-md   font-bold hover:underline'>{post?.user?.name}</p>
                  {post?.user?.isVarified && <MdVerified className='text-blue-500'/>}
                  <p className='hidden md:block  text-gray-500 text-lg'>{post?.user?.customTag}</p>
                  <p className='truncate w-10 md:hidden text-gray-500'>{post?.user?.customTag}</p>
                  <p className='text-gray-500 hidden md:block'>{createdAt.split("ago")}</p>
                  <p className='truncate w-10 md:hidden text-gray-500'>{createdAt.split("ago")}</p>
                  {currentUser?.user?.id===post?.userId &&  <AiOutlineEdit className='text-gray-500 ' title='Edit' onClick={onOpen} /> } 
               {currentUser?.user?.id===post?.userId &&  <AiOutlineDelete size={20} className='text-gray-500 ' title='Delete' onClick={deletePost} /> }  
                 
               </div>
                       

           </div>
           <div className=' mx-5 p-1'>
           {post?.body &&!linkRegex.test(post.body)&&!mentionRegex.test(post.body) && <p className="text-md text-black break-words">{post?.body}</p> }   
               {post?.body.match(linkRegex) && !mentionRegex.test(post.body) && (
                    <>
                        <p>{post.body.replace(linkRegex,"").trim()}</p>
                     
                        {Array.from(post.body.matchAll(linkRegex)).map((link,index)=>(
                       <li className='list-none'>
                         <Link href={link[0].startsWith("http") ? link[0] : `https://${link[0]}`}>
                            <span className='text-blue-500 hover:underline' key={index}>{link[0]}</span>
                         </Link>
                       </li>
                  ))}
                    </>
               )}
                 {post?.body.match(mentionRegex)&&!linkRegex.test(post.body) && (
                    <>
                        <p>{post.body.replace(mentionRegex,"").trim()}</p>
                        {Array.from(post.body.matchAll(mentionRegex)).map((mention,index)=>(
                          <li className='list-none'>
                            <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                          </li>
                        ))}
                    </>
                )}
                  {post?.body.match(mentionRegex) && post.body.match(linkRegex) && (
                    <>
                       
                        {Array.from(post.body.matchAll(mentionRegex)).map((mention,index)=>(
                          <li className='list-none'>
                            <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                          </li>
                        ))}
                        <p>{post.body.replace(mentionRegex,'').replace(linkRegex,'')}</p>
                        {Array.from(post.body.matchAll(linkRegex)).map((link,index)=>(
                          <li className='list-none'>
                             <Link href={link[0].startsWith("http") ? link[0] : `https://${link[0]}`}>
                            <span className='text-blue-500 hover:underline' key={index}>{link[0]}</span>
                         </Link>
                          </li>
                        ))}
                            
                    </>
                )}
           </div>
           <div className='flex items-center w-full gap-5 ml-2' >
               <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='comment'/>
               <p className='text-gray-500'>{post?.comments?.length}</p>
               <IoAnalyticsOutline className='text-2xl text-gray-500 hover:text-blue-300' title='Views'/>
               <p className='text-gray-500'>{post?.viewsId?.length || 0}</p> 
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
             <LikeIcon color={hasLiked ? 'red' : ''} size={20} onClick={onLike} />
             <p>
               {post?.likesId?.length}
             </p>
           </div>
             

           </div>
           
              <div className='md:mx-16 md:my-2 '>
              {post?.userId!==currentUser?.user.id &&  <p className='text-gray-500'>Replay to <span className='text-blue-400 hover:underline '>{post?.user.customTag}</span></p>} 
              </div>
           <Form 
                postId={post?.id as string}
                isComment
                placeholder='share your thoughts'
                />
              {post?.comments && <CommentsFeed postId={post.id} /> } 

       </div>
       }
        
        </>
    )
}
export default postId