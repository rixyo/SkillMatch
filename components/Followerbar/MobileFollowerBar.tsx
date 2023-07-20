import React, {  useCallback, useState } from 'react';
import { MdVerified } from 'react-icons/md';
import useCurrentUser from '@/hooks/useCurrentUser';
import useUsers from '@/hooks/useUsers';
import Avatar from '../Avatar';
import { useRouter } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';
import usePosts from '@/hooks/usePosts';



const MobileFollowerBar:React.FC = () => {
    const router=useRouter()
    const url=router.asPath
      const {data:currentUser}=useCurrentUser()
      const {data:users,mutate:mutatedUser}=useUsers()
      const {mutate:mutatedPost}=usePosts()
      const onFollow=useCallback(async(userId:string)=>{
          await axios.post("/api/follow",{userId:userId})
          toast.success("Followed")
          mutatedUser()
          mutatedPost()
      },[currentUser?.user.id])
    
    return (
        <>
          {currentUser && 
        <div className='sm:flex md:hidden  mt-2 ml-5 '>
        <div className='flex flex-col'>
          {url ==="/" &&  <h1 className='font-bold text-2xl text-center'>Who To Follow</h1>} 
         { url==="/" && users && users.length<10 &&
            users?.map((user:User)=>(
                
                <div key={user?.id} className="flex-col justify-center items-center w-auto">

             <div  className='flex flex-row gap-4 ml-5 mt-5 justify-start hover:cursor-pointer  w-full'>
                 {currentUser.user.id!==user.id &&  <Avatar userId={user.id}/> }  
                   {currentUser.user.id!==user.id &&
                   <>
                   <div className='flex flex-col mt-3 cursor-pointer'>
                   <div className='flex items-center'>
                <h1 className='font-bold text-xl truncate'>{user.name}</h1>
                {user.isVarified && <MdVerified className='text-blue-500  md:ml-2'/> }
                    </div>
                     <p className='text-gray-500 text-sm'>{user.customTag}</p>
               </div>
                
                   </>
                    } 



                </div>
        
            {currentUser.user.id!==user.id && 
            < div className='mx-2'>

                <button className='text-blue w-full border-2 border-solid  p-1  my-3 mr-3 border-blue-400  text-lg font-medium rounded-full' onClick={()=>onFollow(user.id)}>Follow</button>  
            </div>
}
                </div>
             
            
            ))
         }
         {
            users && users.length>10 && url==="/" &&
                <>
                {users.slice(0,10).map((user:User)=>(
                      <div key={user?.id} className="flex-col justify-center items-center w-11/12">

                      <div  className='flex flex-row gap-4 ml-5 mt-5 justify-start hover:cursor-pointer  w-full'>
                          {currentUser.user.id!==user.id &&  <Avatar userId={user.id}/> }  
                            {currentUser.user.id!==user.id &&
                            <>
                            <div className='flex flex-col mt-3 cursor-pointer'>
                            <div className='flex items-center'>
                         <h1 className='font-bold text-xl'>{user.name}</h1>
                         {user.isVarified && <MdVerified className='text-blue-500  md:ml-2'/> }
                             </div>
                              <p className='text-gray-500 text-sm'>{user.customTag}</p>
                        </div>
                         
                            </>
                             } 
         
         
         
                         </div>
                 
                     {currentUser.user.id!==user.id && 
                     < div className='mx-2'>
         
                         <button className='text-blue w-full border-2 border-solid  p-1  my-3 mr-3 border-blue-400  text-lg font-medium rounded-full' onClick={()=>onFollow(user.id)}>Follow</button>  
                     </div>
         }
                         </div>
                ))}
                <h1 className='text-lg text-black cursor-pointer hover:underline text-center' onClick={()=>router.push('/usersuggestions')} >show more</h1>
                
                </>
            
         }
       
          
            </div>

    </div>
        }
        </>
    )
}
export default MobileFollowerBar;