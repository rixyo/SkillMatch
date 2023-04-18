import Avatar from '@/components/Avatar';
import useCurrentUser from '@/hooks/useCurrentUser';
import usePostEditModal from '@/hooks/useEditPostModal';
import usePost from '@/hooks/usePost';
import axios from 'axios';
import { formatDistanceToNowStrict } from 'date-fns';
import { useRouter } from 'next/router';
import React, { useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { AiOutlineComment, AiOutlineDelete, AiOutlineEdit } from 'react-icons/ai';
import { GoHeart } from 'react-icons/go';
import { IoAnalyticsOutline } from 'react-icons/io5';
import { MdVerified } from 'react-icons/md';
import { CircleLoader } from 'react-spinners';



const postId:React.FC = () => {
    const router = useRouter();
    const { postId } = router.query;
    const {data:currentUser}=useCurrentUser()
    const {onOpen}=usePostEditModal()
    const {data:post, isLoading, mutate}=usePost(postId as string)
    const deletePost=useCallback(async()=>{
        try {
            await axios.delete(`/api/posts/${postId}`)
            toast.success("Post deleted successfully")
          await  mutate({...post as Post})
            router.push("/")


        
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.message)
        }
    },[post?.id,router,mutate])

    const createdAt=useMemo(()=>{
        if(!post?.createdAt) return ""
        else{
            return formatDistanceToNowStrict(new Date(post.createdAt),{addSuffix:true})

        }
    },[post?.createdAt])
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
                  <p className='text-gray-500 hidden md:block'>{createdAt}</p>
                  <p className='truncate w-10 md:hidden text-gray-500'>{createdAt}</p>
                  {currentUser?.user?.id===post?.userId &&  <AiOutlineEdit className='text-gray-500 ' title='Edit' onClick={onOpen} /> } 
               {currentUser?.user?.id===post?.userId &&  <AiOutlineDelete size={20} className='text-gray-500 ' title='Delete' onClick={deletePost} /> }  
                 
               </div>
                       

           </div>
           <div className=' mx-5  p-3'>
               <div>

               <p className='text-md text-gray-500 break-words'>{post?.body}</p>
               </div>
           </div>
           <div className='flex items-center w-full gap-5 ml-2' >
               <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='comment'/>
               <p className='text-gray-500'>{post?.comments?.length}</p>
               <IoAnalyticsOutline className='text-2xl text-gray-500 hover:text-blue-300' title='Views'/>
               <p className='text-gray-500'>{post?.viewsIds?.length || 0}</p> 
               <GoHeart className='text-2xl text-gray-400 hover:text-red-200'  title='like'/>
               <p className='text-gray-500'>{post?.likesIds?.length}</p>
             

           </div>

       </div>
       }
        
        </>
    )
}
export default postId