import { useRouter } from 'next/router';
import React from 'react';
import { Tab } from './Sidebar';

type SidebarItemProps = {
  tab: Tab;
    selectedTab: boolean;
    setSelectedTab: (title: string) => void;  
};

const SidebarItem:React.FC<SidebarItemProps> = ({tab,selectedTab,setSelectedTab}) => {
    const router=useRouter()
    const handleClick=()=>{
        setSelectedTab(tab.title)
        router.push(tab.href)

    }
    return (
        <div className='flex lg:justify-center xl:justify-normal  items-center cursor-pointer ' onClick={handleClick}>
            <div className='p-3
        
               rounded-full 
               h-14
               w-14
               flex
               items-center
               hover:bg-slate-300 
               hover:bg-opacity-10 
               cursor-pointer 
            
    
            '>
                <tab.icon className={`text-2xl ${selectedTab ? 'text-blue-500' : 'text-gray-500'} `} title={tab.title} />
            </div>
            <div>
                <p className={`text-sm ${selectedTab ? 'text-blue-500' : 'text-gray-500'} hidden md:block font-semibold `}>{tab.title}</p>
            </div>

        </div>
    )
}
export default SidebarItem;