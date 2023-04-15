import React, { useCallback, useState } from 'react';
import { AiOutlineClose, AiOutlineHome } from 'react-icons/ai';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { IconType } from 'react-icons';
import SidebarItem from './SidebarItem';
import useToggle from '@/hooks/useToggle';
import useCurrentUser from '@/hooks/useCurrentUser';
import {signOut} from "next-auth/react"
import {FiLogIn} from "react-icons/fi"
import SidebarFooter from './sidebarFooter';
import { useRouter } from 'next/router';
export type Tab = {
    title: string;
    icon: IconType;
    href?: string;
}
const Tabs:Tab[] = [
    {
        title: 'Home',
        icon: AiOutlineHome,
        href: '/'
    },
    {
        title:"Notifications",
        icon: IoIosNotificationsOutline,
        href: '/notifications',
    },
    {
        title: 'Messages',
        icon: AiOutlineMessage,
        href: '/messages'
    },
    {
        title: 'Settings',
        icon: IoSettingsOutline,
        href: '/settings'

    },
    
  
]
const Sidebar:React.FC= () => {
    const [selectedTab,setSelectedTab]=useState<string>("")
    const router=useRouter()
    const {login,register} =useToggle()
    const {data:currentUser}=useCurrentUser()
    

    
    return( 
        <>
    <div className='col-span-2  md:col-span-1 xl:col-span-2 mr-5 h-full pr-4 md:pr-6  mt-2 border-2 border-blue-500 rounded-lg sticky'>
        <div className='flex flex-col  md:items-end  lg:items-center'>
            <div className='space-y-2 lg:w-[230px] '>

            { Tabs.map((tab)=>(
                <>
            {currentUser &&  <SidebarItem key={tab.title} tab={tab} selectedTab={tab.title===selectedTab} setSelectedTab={setSelectedTab}/> }   
                </>
            ))}
              
            </div>
            
           

        </div>
        <div className='flex justify-center'>

     {!currentUser &&  
     <div className='ml-5 w-auto'>
     <h1 className='text-center mt-2 text-2xl font-semibold'>New To MatchMass</h1>
       <div className='flex items-center mt-2 border-2   justify-center border-solid border-gray-400 mb-3 rounded-lg p-1  cursor-pointer ' onClick={register}>
        <FiLogIn className=' text-gray-500 text-md mr-2' title='SignUp/Login'/>
        <p className='text-md font-semibold text-gray-500' >SignUp</p>
     </div>
   
        <p className='text-md  text-gray-500 md:p-1  '>By signing up, you agree to the <span className='underline text-blue-400 cursor-pointer'>Terms of Service</span> and <span className='underline text-blue-400 cursor-pointer'>Privacy Policy</span>, including <span className='underline text-blue-400 cursor-pointer'>Cookie</span> Use.</p>
   
     </div>
     
  
    
    } 
    {currentUser && 
        <div className='flex items-center justify-start    md:mr-10 md:ml-11  border-2 border-solid border-gray-200 mb-3 rounded-lg  mt-2 w-full p-3  cursor-pointer ' onClick={()=>signOut()}>
        <MdLogout className=' text-gray-500 text-md mr-5 md:ml-2' title='LogOut'/>
        <p className='text-md font-semibold text-gray-500' >Logout</p>
        </div>
        }
        </div>
 <SidebarFooter/>
    </div>
          
    </>
)}
export default Sidebar;


