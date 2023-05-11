
import useCurrentUser from '@/hooks/useCurrentUser';
import useGetComments from '@/hooks/useGetComments';
import usePosts from '@/hooks/usePosts';
import useToggle from '@/hooks/useToggle';
import axios from 'axios';
import { useRouter } from 'next/router';
import React, { useCallback, useState } from 'react';
import {toast} from "react-hot-toast"
import { IconType } from 'react-icons';
import { IoImageOutline } from 'react-icons/io5';
import Avatar from './Avatar';
import Button from './Button';

import Picker from '@emoji-mart/react'
import { BsEmojiSmile } from 'react-icons/bs';



import FormItem from './FormItem';
import FormImageUpload from './FormImageUpload';
import {AiOutlineGif } from "react-icons/ai"


type FormProps = {
    placeholder: string;
    isComment?: boolean;
    postid?: string;
    isReplay?: boolean;
    commentId?:string;
    mutatedReplay?:any;
    isNestedReplay?:boolean;
    mutatedNestedReplay?:any;
    replayId?:string;

};

export interface FormTab{
   
    icon:IconType;
    title:string;
}
const Tabs:FormTab[]=[
    {
        icon:IoImageOutline ,
        title:"Image"

    },
    {
        icon:BsEmojiSmile,
        title:"Emoji"
    },
    {
        icon:AiOutlineGif,
        title:"GIF"
    }
]
const Form:React.FC<FormProps> = ({placeholder,isComment,isReplay,commentId,mutatedReplay,postid,isNestedReplay,replayId,mutatedNestedReplay}) => {
    const {data:currentUser} = useCurrentUser()
    const router=useRouter()
    const {postId}=router.query
    const path=router.asPath
   
  
    
    const {login} = useToggle()
    const {mutate:mutatePost} = usePosts()
    const {mutate:mutatedComment}=useGetComments(postId as string)
    const [body,setBody] = useState<string>('')
    const [loading,setLoading] = useState<boolean>(false)
    const [characterRemaning,setCharacterRemaing]=useState<number>(240)
    const [bodyLength,setBodyLength]=useState<number>(0)
    const [emoji, setEmoji] = useState(null);
    const [selectedTab,setSelectedTab]=useState<string>("")
    const [image,setImage]=useState<string>("")
  
    const handleChange= useCallback((e:React.ChangeEvent<HTMLTextAreaElement>)=>{
        if(e.target.value.length > 240) return 
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
             
                const url=isComment?`/api/comment/comment?postId=${postId}`:`/api/posts`
               if(isReplay){
                await axios.post(`/api/comment/replay/`,{body,commentId:commentId,postId:postid})
                toast.success("Replayed successfully")
                setBody("")
                mutatedReplay()


               }
                else if(isNestedReplay){
                    await axios.post(`/api/replay/nestedreplay/`,{body,replayId:replayId})
                    toast.success("Replayed successfully")
                    setBody("")
                    mutatedNestedReplay()
                }
               else{

                   await axios.post(url,{body,image})
                   toast.success(isComment?"Commented successfully":"Posted successfully")
                   setBody("")
                     setImage("")
                     setSelectedTab("")
                   mutatePost()
                   if(isComment){
                       mutatedComment()
                   }
               }

            }
           
            
        } catch (error:any) {
            toast.error(error.response?.data?.error ||error.message)

            
        }finally{
            setLoading(false)
        }
        
    },[body,setBody,mutatePost,isComment,postId,currentUser,login])
    const handleEmoji=(emoji:any)=>{
        setEmoji(emoji)
        setBody(body+emoji.native)

    }
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
                <div className='flex gap-2 items-center'>
                 
            {Tabs.map((tab,index)=>(
             
              <FormItem tab={tab} key={index}  selectedTab={tab.title===selectedTab} setSelectedTab={setSelectedTab} />
            
            ))}
           
                
                </div>
               <div className='flex justify-end'>
                <Button
                label={isComment?"Replay":"Share"}
                disabled={loading || !body}
                onClick={onSubmit}
                />

               </div>
               {currentUser?.user  &&
                    selectedTab==="Emoji" &&
                    <div>

                        <Picker set='twitter' onEmojiSelect={handleEmoji} />
                    </div>
              }
              { currentUser?.user && path==="/" &&
                    selectedTab==="Image" &&
                    <FormImageUpload
                    value={image}
                    onChange={(value)=>setImage(value)}
                    label="click here to upload image"
                    isHome
                    />
              }
              {currentUser?.user && path==="/" &&
              selectedTab==="GIF" &&
              <div>
                  

              </div>
              }
               

            </div>
            

        </div>
    )
}
export default Form;


