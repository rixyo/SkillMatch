import React from 'react';
import { FormTab } from './Form';

type FormItemProps = {
    tab:FormTab,
    selectedTab:boolean
    setSelectedTab:(title:string)=>void
};

const FormItem:React.FC<FormItemProps> = ({tab,selectedTab,setSelectedTab}) => {
    const handleClick=()=>{
        setSelectedTab(tab.title)
    }
    
    return(
        <div className='flex items-center xl:justify-normal  cursor-pointer mt-2' key={tab.title}>
        <div  className='p-1
           rounded-full 
           h-14
           w-14
           flex
           items-center
           hover:bg-slate-300 
           hover:bg-opacity-10 
           cursor-pointer 
        ' key={Math.random()%10}>
            <tab.icon className={`text-2xl ${selectedTab ? 'text-sky-500' : 'text-gray-500'} `} onClick={handleClick}   />
          
        </div>
        <div  ></div>
       

    </div>
    )
}
export default FormItem;