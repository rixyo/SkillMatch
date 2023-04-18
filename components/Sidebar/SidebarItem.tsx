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
        router.push(tab.href!)

    }
    return (
        <div className='flex items-center xl:justify-normal  cursor-pointer lg:border-2 border-solid lg:border-gray-300 lg:rounded-lg mt-2' key={Math.random()/2} onClick={handleClick}>
            <div key={tab.title+Math.random()*10} className='p-1
               rounded-full 
               h-14
               w-14
               flex
               items-center
               hover:bg-slate-300 
               hover:bg-opacity-10 
               cursor-pointer 
            '>
                <tab.icon className={`text-2xl ${selectedTab ? 'text-blue-500' : 'text-gray-500'} `}  title={tab.title} />
            </div>
            <div key={tab.title+tab.title} >
                <p className={`text-sm ${selectedTab ? 'text-blue-500' : 'text-gray-500'}  font-semibold hidden md:block `} >{tab.title}</p>
            </div>

        </div>
    )
}
export default SidebarItem;