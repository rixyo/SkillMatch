import useCurrentUser from '@/hooks/useCurrentUser';
import useToggle from '@/hooks/useToggle';
import { useRouter } from 'next/router';
import React, { useCallback,  useMemo} from 'react';
import {formatDistanceToNowStrict } from  "date-fns"
import Avatar from '../Avatar';
import { MdVerified } from 'react-icons/md';
import { AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineEdit, AiOutlineHeart } from 'react-icons/ai';
import { IoAnalyticsOutline } from 'react-icons/io5';
import {GoHeart} from 'react-icons/go'
import toast from 'react-hot-toast';
import axios from 'axios';
import usePostEditModal from '@/hooks/useEditPostModal';
import useLike from '@/hooks/useLike';



type PostIteamProps = {
    post: Post;
    userId?: string
    mutate?:any

};

const PostIteam:React.FC<PostIteamProps> = ({post,mutate,userId}) => {
    const {onOpen}=usePostEditModal()
  
    
    

    const router=useRouter()
    const {login}=useToggle()
    const {data:currentUser} = useCurrentUser()
 const {hasLiked,toggleLike}=useLike({postId:post.id,userId})
 

    const gotoProfile = useCallback((event:any) => {
        event.stopPropagation();
        if(!currentUser){
            login()
            return
        }
        router.push(`/users/${post.userId}`)
      

    }, [router, post.userId]);
    const gotoPost = useCallback((event:any) => {
        event.stopPropagation();
        if(!currentUser){
            login()
            return
        }
        router.push( `/posts/${post.id}`)
    }, [router, post.id]);
    const onLike = useCallback((event:React.MouseEvent<SVGElement,MouseEvent>) => {
        event.stopPropagation();
        if(!currentUser){
            login()
            return
        }
        toggleLike()

    }, [login,currentUser,toggleLike]);
    const createdAt=useMemo(()=>{
        if(!post.createdAt) return ""
        else{
            return formatDistanceToNowStrict(new Date(post.createdAt),{addSuffix:true})

        }
    },[post.createdAt])
  
    const deletePost=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        try {
            await axios.delete(`/api/posts/${post.id}`)
           // mutate({...post as Post})
           mutate()
            

        
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.response?.data?.error || error.message)
        }finally{
            toast.success("Post deleted")
        }

    },[post?.id,router])

    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
    return(
        <div
        onClick={gotoPost}
        className="flex flex-col border-2 border-solid border-gray-300 p-5 cursor-pointer rounded-lg   my-5 mx-2 hover:border-gray-200"
        key={post.id}
        >
            <div className='flex items-start gap-1'>
                <Avatar
                userId={post.userId}
                />
                <div className='flex items-center md:gap-2 '  >
                    <p className='hidden md:block text-md  font-bold hover:underline' onClick={gotoProfile} >{post.user.name}</p>
                    <p className='truncate w-10 md:hidden  text-md   font-bold hover:underline' onClick={gotoProfile}>{post.user.name}</p>
                   {post.user.isVarified && <MdVerified className='text-blue-500'/>}
                   <p className='hidden md:block  text-gray-500 text-lg'>{post.user.customTag}</p>
                   <p className='truncate w-10 md:hidden text-gray-500'>{post.user.customTag}</p>
                   <p className='text-gray-500 hidden md:block'>{createdAt}</p>
                   <p className='truncate w-10 md:hidden text-gray-500'>{createdAt}</p>
                {currentUser?.user?.id===post?.userId &&  <AiOutlineEdit size={20} className='text-gray-500 ' title='Edit' onClick={onOpen} /> }   
                {currentUser?.user?.id===post?.userId &&  <AiOutlineDelete size={20} className='text-gray-500 ' title='Delete' onClick={deletePost} /> } 
                  
                </div>
                        

            </div>
            <div className=' mx-5  p-3'>
                <div>

                <p className='text-md text-gray-500 break-words'>{post.body}</p>
                </div>
            </div>
            <div className='flex items-center w-full gap-5 ml-2' >
                <AiOutlineComment className='text-2xl text-gray-500 hover:text-blue-300' title='comment'/>
             
                <p className=' text-neutral-500 '>{post.comments?.length}</p>
                <IoAnalyticsOutline className='text-2xl text-gray-500 hover:text-blue-300' title='Views'/>
                <p className='text-gray-500'>{post.viewsId?.length || 0}</p> 
          
              
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
                {post.likesId.length}
              </p>
            </div>
            

            </div>

        </div>
    )
}
export default PostIteam;