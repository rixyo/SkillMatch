import useCurrentUser from '@/hooks/useCurrentUser';
import useToggle from '@/hooks/useToggle';
import { useRouter } from 'next/router';
import React, { useCallback,  useMemo, useState} from 'react';
import {formatDistanceToNowStrict } from  "date-fns"
import Avatar from '../Avatar';
import { MdVerified } from 'react-icons/md';
import { AiFillHeart, AiOutlineComment, AiOutlineDelete, AiOutlineEdit, AiOutlineHeart, AiOutlineShareAlt } from 'react-icons/ai';
import { IoAnalyticsOutline } from 'react-icons/io5';

import toast from 'react-hot-toast';
import axios from 'axios';
import usePostEditModal from '@/hooks/useEditPostModal';
import useLike from '@/hooks/useLike';
import Link from 'next/link';
import {CldImage} from "next-cloudinary"
import useUser from '@/hooks/useUser';




type PostIteamProps = {
    post: Post;
    userId?: string
    mutate?:any

};

const PostIteam:React.FC<PostIteamProps> = ({post,mutate,userId}) => {
    const {onOpen}=usePostEditModal()
    const linkRegex = /((https?:\/\/)|(www\.))[^\s]+/gi
    const mentionRegex =  /(?<=^|(?<=[^a-zA-Z0-9-_\.]))@([A-Za-z]+[A-Za-z0-9_]+)/g;
    const hintRegex = /\bhints\w*\b/gi;
    const [copied, setCopied] = useState<Boolean>(false);
    const {data:user}=useUser(post.fromSharedId as string)
    
    
    

    const router=useRouter()
    const {login}=useToggle()
    const {data:currentUser} = useCurrentUser()
 const {hasLiked,toggleLike}=useLike({postId:post.id,userId})
    const onShare=useCallback((event:any)=>{
        event.stopPropagation()
      navigator.clipboard.writeText(`${window.location.origin}/post/${post.id}`)
        setCopied(true)
        toast.success("Link copied")
      
    
    },[post.id])

    const gotoProfile = useCallback((event:any) => {
        event.stopPropagation();
        if(!currentUser){
            login()
            return
        }
        router.push(`/user/${post.userId}`)
      

    }, [router, post.userId]);
    const gotoPost = useCallback((event:any) => {
        event.stopPropagation();
        if(!currentUser){
            login()
            return
        }
        router.push( `/post/${post.id}`)
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
    const fromPostCreatedAt=useMemo(()=>{
        if(!post?. postSharedCreatedAt) return ""
        else{
            return formatDistanceToNowStrict(new Date(post.postSharedCreatedAt),{addSuffix:true})

        }
    },[post?. postSharedCreatedAt])
  
    const deletePost=useCallback(async(event:React.MouseEvent<SVGElement,MouseEvent>)=>{
        event.stopPropagation()
        try {
           
                await axios.delete('/api/posts',{params:{postId:post.id}}).then(()=>{
                    toast.success("Post deleted")
                    router.push('/')
                }).catch((error:any)=>{
                    toast.error(error.response?.data?.error || error.message)
                })
                mutate()
            
           
            

        
        } catch (error: any) {
            console.log(error.message)
            toast.error(error.response?.data?.error || error.message)
        }

    },[post?.id,router])
    const handleShare=useCallback((event:any)=>{
        event.stopPropagation()
        if(!currentUser){
            login()
            return
        }
        else{
            axios.post('/api/posts/share',{postId:post.id}).then(()=>{
                mutate()
                toast.success("Post shared")

            }).catch((error:any)=>{
                toast.error(error.response?.data?.error || error.message)
            })
        }
    },[currentUser,post?.id,mutate])

    const LikeIcon = hasLiked ? AiFillHeart : AiOutlineHeart;
   
    return(
        <div
        onClick={gotoPost}
        className="flex flex-col  border-2 border-solid border-gray-300 p-5 cursor-pointer rounded-lg   my-5 mx-2 hover:border-gray-200"
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
                   <p className='text-gray-500 hidden md:block'>{createdAt.split("ago")}</p>
                   <p className='truncate w-10 md:hidden text-gray-500'>{createdAt.split("ago")}</p>
                {currentUser?.user?.id===post?.userId &&  <AiOutlineEdit size={20} className='text-gray-500 ' title='Edit' onClick={onOpen} /> }   
                {currentUser?.user?.id===post?.userId &&  <AiOutlineDelete size={20} className='text-gray-500 ' title='Delete' onClick={deletePost} /> } 
                  
                </div>

                        

            </div>
                {post.isShared && (
                    <div className='flex items-center gap-1 p-3 mx-5'>
                        <Avatar
                        userId={post.fromSharedId as string}/>
                        <div className='flex items-center gap-1'>
                        <p className='hidden md:block text-md  font-bold hover:underline' onClick={()=>router.push(`/user/${user?.id}`)} >{user?.name}</p>
                    <p className='truncate w-10 md:hidden  text-md   font-bold hover:underline' onClick={()=>router.push(`/user/${user?.id}`)}>{user?.name}</p>
                   {user?.isVarified && <MdVerified className='text-blue-500'/>}
                   <p className='hidden md:block  text-gray-500 text-lg'>{user?.customTag}</p>
                   <p className='truncate w-10 md:hidden text-gray-500'>{user?.customTag}</p>
                   <p className='text-gray-500 hidden md:block'>{fromPostCreatedAt.split("ago")}</p>
                   <p className='truncate w-10 md:hidden text-gray-500'>{fromPostCreatedAt.split("ago")}</p>
                        </div>
                    </div>
                )}
            <div className='mx-5 p-1'>
                <>

            {!linkRegex.test(post.body) && !mentionRegex.test(post.body) && <p className={`text-lg font-bold text-gray-500  ${post.isShared &&"mx-5 mt-0"}`}>{post.body}</p> }   
               {post.body.match(linkRegex) &&!mentionRegex.test(post.body) && (
                    <div className=" flex flex-col">
                        <p className=' text-gray-500 text-lg font-bold'>{post.body.replace(linkRegex,"").trim()}</p>
                        {Array.from(post.body.matchAll(linkRegex)).map((link,index)=>(
                       <li className='list-none'>
                        
                          <span className='text-blue-500 break-words hover:underline' key={index}>{link[0]}</span>
                          
                       </li>
                  ))}
                    </div>
               )}

                </>
                <div>
                {post?.body.match(mentionRegex)&&post.body.match(hintRegex)&&!linkRegex.test(post.body) && (
                    <div className='flex flex-col p-1' >
                        {Array.from(post.body.matchAll(mentionRegex)).map((mention,index)=>(
                          <li className='list-none'>
                            <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                          </li>
                        ))}
                        <p className='text-gray-500 text-lg font-bold'>{post.body.replace(mentionRegex,"").trim().split("hints")[0]}</p>
                        <p className='text-red-500 text-lg font-bold'>System: {post.body.replace(mentionRegex,"").trim().split("hints:")[1] }</p>
                    </div>
                )}
                   {post?.body.match(mentionRegex)&&!hintRegex.test(post.body)&&!linkRegex.test(post.body) && (
                    <div className='flex flex-col p-1' >
                        {Array.from(post.body.matchAll(mentionRegex)).map((mention,index)=>(
                          <li className='list-none'>
                            <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                          </li>
                        ))}
                        <p className='text-gray-500 text-lg font-bold'>{post.body.replace(mentionRegex,"").trim()}</p>
                       
                    </div>
                )}
                 {post.body.match(mentionRegex) && post.body.match(linkRegex) && (
                  <>
                  <div className='flex items-center gap-1 w-3/4'>
                    <div>
                      {Array.from(post.body.matchAll(mentionRegex)).map((mention,index)=>(
                        <li className='list-none'>
                          <span className='text-blue-500 hover:underline' key={index}>{mention[0]}</span>
                        </li>
                      ))}

                    </div>

                        <div className='text-lg font-bold text-gray-500 mr-2  border-2 whitespace-nowrap'>{post.body.replace(mentionRegex,'').replace(linkRegex,'')}</div>
                       

                       
                  </div>
                      {Array.from(post.body.matchAll(linkRegex)).map((link,index)=>(
                        <li className='list-none'>
                           <Link href={link[0].startsWith("http") ? link[0] : `https://${link[0]}`}>
                          <span className='text-blue-500 hover:underline break-all' key={index}>{link[0]}</span>
                       </Link>
                        </li>
                      ))}
                     
                      </>
                )}

                </div>

            </div>
            {post.image && <CldImage src={post.image} alt="post" className={` object-cover mb-3 ${post.isShared &&"mx-5 mt-0"}`}
            width={post.isShared ? 300 : 500}
            height={post.isShared ? 200 : 500}
            />}

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
            <AiOutlineShareAlt className='text-2xl text-gray-500 hover:text-blue-300' onClick={handleShare} title="share"/>

            </div>

        </div>
    )
}
export default PostIteam;