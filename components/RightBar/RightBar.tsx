import React, { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';
import { MdVerified } from 'react-icons/md';
import { BsSearch } from 'react-icons/bs';
type FollowBarProps = {
    
};

const FollowBar:React.FC<FollowBarProps> = () => {


    return (
        <div className='hidden xl:block xl:col-span-2 mt-2 ml-5 rounded-lg border-2 border-red-600'>
            <div className='flex flex-col'>
               <div className='w-auto mt-1 p-2' >
               <BsSearch className='w-5 h-5 absolute mt-1 ml-1  text-gray-500'/>
                <input   type="text"
                placeholder="Search"
                className="border-2 border-none  h-8 pr-3 pl-10 py-2 font-semibold place-holder-gray-500 text-black rounded-lg ring-2 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full" 
            
                />
             

               </div>
                <h1 className='font-bold text-2xl text-center'>Who To Follow</h1>
                <div className='flex justify-start items-center self-center mt-5 cursor-pointer  ml-2 gap-3'>
                    <Image src="/random.jpg" width={50} height={50} alt="name" className='rounded-full border-2 border-solid border-red-500'/>
                    <div className='flex flex-col'>

                    <div className='flex  items-center gap-2  '>
                    <text className='ml-2 hover:underline'>Roixy</text> 
                    <MdVerified className='text-blue-500'/>
                    </div>
                    <div>
                    <text className=' text-gray-500 ml-1'>@roixy</text>
                    </div>
                    </div>
                    
                    <button className='rounded-full w-20 p-1 bg-blue-500  text-white'>Follow</button>
                </div>
           
              
                </div>

        </div>
    )
}
export default FollowBar;