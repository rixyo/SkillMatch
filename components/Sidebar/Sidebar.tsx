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


export type Tab = {
    title: string;
    icon: IconType;
    href?: string;
    alert?: boolean;
    auth?:boolean
}
const Sidebar:React.FC= () => {
    const [selectedTab,setSelectedTab]=useState<string>("")
    const {data:loginUser}=useCurrentUser()
  
  
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
            alert:loginUser?.user?.hasNotifications,
            auth:true
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

    const {register} =useToggle()
    const {data:currentUser}=useCurrentUser()

    

    
    return( 
        <>
    <div className='col-span-1 xl:col-span-2 mr-5 h-1/2 pr-4 md:pr-6  mt-2  rounded-lg' key="main-contain">
        <div className='flex flex-col  md:items-center ' key={"SideBarItems"}>
            <div className='space-y-2 lg:w-[230px] mx-5' key={"SideBarChild"}>

            { Tabs.map((tab)=>(
                <>
            {currentUser &&  <SidebarItem key={tab.title+tab.icon} tab={tab} selectedTab={tab.title===selectedTab} setSelectedTab={setSelectedTab}/> }   
                </>
            ))}
        
              
            </div>
     {currentUser &&        <div className='flex items-center self-start mx-6 md:p-2  gap-4  cursor-pointer ' key={"Logout"} onClick={()=>signOut()}>
        <MdLogout className=' text-gray-500 text-xl ' title='LogOut'/>
        <p className='text-md font-semibold text-gray-500 hidden md:block' >Logout</p>
        </div>
}
           

        </div>
       
        <SidebarFooter/>

       
      

     {!currentUser &&  
        <div className='flex justify-center' key="new user">
     <div className='ml-5 w-auto hidden md:block'>
     <h1 className='text-center mt-2 text-2xl font-semibold'>New To MatchMass</h1>
       <div className='flex items-center mt-2 border-2   justify-center border-solid border-gray-400 mb-3 rounded-lg p-1  cursor-pointer ' onClick={register}>
        <FiLogIn className=' text-gray-500 text-md mr-2' title='SignUp/Login'/>
        <p className='text-md font-semibold text-gray-500' >SignUp</p>
     </div>
   
        <p className='text-md  text-gray-500 md:p-1  '>By signing up, you agree to the <span className='underline text-blue-400 cursor-pointer'>Terms of Service</span> and <span className='underline text-blue-400 cursor-pointer'>Privacy Policy</span>, including <span className='underline text-blue-400 cursor-pointer'>Cookie</span> Use.</p>
   
     </div>
     
  
    
        </div>
    } 
   
 
        
    </div>
          
    </>
)}
export default Sidebar;


