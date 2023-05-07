import React, { FormEvent, useCallback, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
import useCurrentUser from '@/hooks/useCurrentUser';
import useUsers from '@/hooks/useUsers';
import Avatar from '../Avatar';
import { useRouter } from 'next/navigation'
import { useRouter as Router } from 'next/router';
import axios from 'axios';
import toast from 'react-hot-toast';


const FollowBar:React.FC = () => {
    const [search,setSearch]=useState<string>("")
    const router=useRouter()
    const r=Router()
  const url=r.asPath

const {data:currentUser}=useCurrentUser()

const {data:users,mutate:mutatedUser}=useUsers()




const onSearch=useCallback((event:React.FormEvent)=>{
    event.preventDefault()
    const encodedSearch=encodeURI(search)
    router.push(`/search?q=${encodedSearch}`)
   

},[search])

const onFollow=useCallback((userId:string)=>{
   // event.preventDefault()
    axios.post("/api/follow",{userId:userId})
    toast.success("Followed")
    mutatedUser()
   

},[currentUser?.user.id])

    return (
        <>
        {currentUser && 
        <div className='hidden xl:block xl:col-span-3  mt-2 ml-5 '>
        <div className='flex flex-col'>
           <div className='w-auto mt-1 p-2' >
           <BsSearch className='w-5 h-5 absolute mt-1 ml-1  text-gray-500'/>
           <form onSubmit={onSearch}>

            <input   type="text"
            placeholder="Search"
            className="border-2 border-none  h-8 pr-3 pl-10 py-2 font-semibold place-holder-gray-500 text-black rounded-lg ring-2 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full" 
            onChange={(e)=>setSearch(e.target.value)}
            value={search}
        
            />
           </form>
         

           </div>
          {url ==="/" &&  <h1 className='font-bold text-2xl text-center'>Who To Follow</h1>} 
         { url==="/" &&
            users?.map((user:User)=>(
                
                <div key={user?.id} className="flex items-center w-11/12">

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

                <button className='text-blue w-full border-2 border-solid  p-2  my-3 mr-3 border-blue-400  text-lg font-medium rounded-lg' onClick={()=>onFollow(user.id)}>Follow</button>  
            </div>
}
                </div>
             
            
            ))
         }
       
          
            </div>

    </div>
        }
        </>
      
    )
}
export default FollowBar;