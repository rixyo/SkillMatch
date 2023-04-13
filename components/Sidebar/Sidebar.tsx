import React, { useState } from 'react';
import { AiOutlineHome } from 'react-icons/ai';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { AiOutlineMessage } from 'react-icons/ai';
import { SlUser } from 'react-icons/sl';
import { IoSettingsOutline } from 'react-icons/io5';
import { MdLogout } from 'react-icons/md';
import { IconType } from 'react-icons';
import SidebarItem from './SidebarItem';
import { title } from 'process';

export type Tab = {
    title: string;
    icon: IconType;
    href: string;
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
        title: 'Profile',
        icon: SlUser,
        href: '/profile'
    },
    {
        title: 'Settings',
        icon: IoSettingsOutline,
        href: '/settings'

    },
    {
        title: 'Logout',
        icon: MdLogout,
        href: '/logout'
    }
]
const Sidebar:React.FC= () => {
    const [selectedTab,setSelectedTab]=useState("")
    
    return( 
    <div className='col-span-1 xl:col-span-2 mr-5 h-full pr-4 md:pr-6  mt-2 border-2 border-blue-500 rounded-lg'>
        <div className='flex flex-col  md:items-end'>
            <div className='space-y-2 lg:w-[230px]'>

            { Tabs.map((tab,index)=>(
                <>
                <SidebarItem key={index+tab.title} tab={tab} selectedTab={tab.title===selectedTab} setSelectedTab={setSelectedTab}/>
                </>
            ))}
            </div>

        </div>

    </div>
)}
export default Sidebar;