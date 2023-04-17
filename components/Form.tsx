
import useCurrentUser from '@/hooks/useCurrentUser';
import usePost from '@/hooks/usePost';
import usePosts from '@/hooks/usePosts';
import useToggle from '@/hooks/useToggle';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useState } from 'react';
import {toast} from "react-hot-toast"
import Avatar from './Avatar';
import Button from './Button';

type FormProps = {
    placeholder: string;
    isComment?: boolean;
    isLikes?: boolean;
    postId?: string;
};

const Form:React.FC<FormProps> = ({placeholder}) => {
    const {data:currentUser} = useCurrentUser()
    const router=useRouter()
    const {postId}=router.query
    const {data:singlePost}=usePost(postId as string)
    
    const {login} = useToggle()
    const {mutate:mutatePost} = usePosts()
    const [body,setBody] = useState<string>('')
    const [loading,setLoading] = useState<boolean>(false)
    const [characterRemaning,setCharacterRemaing]=useState<number>(140)
    const [bodyLength,setBodyLength]=useState<number>(0)

    const handleChange= useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        if(e.target.value.length > 140) return 
        setBody(e.target.value)
        setBodyLength(e.target.value.length)
        setCharacterRemaing(140 - e.target.value.length)
    },[setBody,setBodyLength,setCharacterRemaing])
   
    
    const onSubmit= useCallback(async()=>{
        try {
            setLoading(true)
            if(!currentUser){
                login()
              
                return
            }
            else{

                await axios.post("/api/posts",{body})
                toast.success("Post created")
                setBody("")
                mutatePost()
            }
           
            
        } catch (error:any) {
            toast.error(error.response?.data?.error ||error.message)

            
        }finally{
            setLoading(false)
        }
        
    },[body,setBody,mutatePost])
    
    return (
        <div className='flex gap-4 mt-2'>
            <div>
                <Avatar userId={currentUser?.user?.id}/>
      
            </div>
            <div className='w-full'>
               <textarea
               disabled={loading}
                value={body}
                onChange={handleChange}
                className='w-full h-20 disabled:opacity-80 peer resize-none mt-3  p-2 rounded-lg text-[20px] placeholder-gray-400 focus:outline-none ring-0 outline-none'
                placeholder={placeholder}

               >
             
               </textarea>
           {bodyLength>=130 && <p className='text-red-500 text-center mx-32 border-2 border-solid border-blue-400 rounded-full h-10 w-10'>{characterRemaning}</p> }    
               <hr className='opacity-0 peer-focous:oopacity-100 h-[1px] w-full border-gray-300 transition'/>
               <div className='flex justify-end'>
                <Button
                label='Post'
                disabled={loading || !body}
                onClick={onSubmit}
                />

               </div>
               

            </div>
            

        </div>
    )
}
export default Form;