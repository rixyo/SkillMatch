import Header from '@/components/Header/Heder';
import React from 'react';
import {TbMathGreater} from 'react-icons/tb'
import {CgProfile} from 'react-icons/cg'
import { BsKey } from 'react-icons/bs';
import { MdHeartBroken } from 'react-icons/md';

const index:React.FC = () => {
    
    return (
        <div>
            <Header
            label={"Settings"}
            showBackArrow

            />
            <div className='grid grid-cols-2 gap-4 mt-2  divide-x divide-sky-500'>
                <div className='col-span-1 gap-5 items-center p-2  '>
                  

                    <div className='flex justify-between items-center hover:cursor-pointer'>
                    <h1 className='ml-2 text-md text-gray-600 font-semibold'>Your Account</h1>
                    <TbMathGreater/>

                    </div>
                    <div className='flex justify-between items-center hover:cursor-pointer'>
                    <h1 className='ml-2 text-md text-gray-600 font-semibold'>Verification</h1>
                    <TbMathGreater className=''/>

                    </div>
                    </div>
              
                <div className='col-span-1  hover:cursor-pointer p-2 '>
                    

                    <div className='flex gap-3 items-center '>
                    <CgProfile className='text-md text-gray-400' size={20}/>
                  
                    <h1 className='text-md text-black font-medium'>Account Information</h1>

                  

                    </div>
                    <p className='text-sm text-gray-500'>See your account information like your phone number email address </p>
                   
                     <div className='p-2'>

                    <div className='flex gap-3 items-center'>
                    <BsKey className='text-md text-gray-400' size={20} />
                  
                    <h1 className='text-md text-black font-medium'>Change Password</h1>

                  

                    </div>
                    <p className='text-sm text-gray-500'>Change your Password at anytime </p>
                    </div>
                     <div className='p-2'>

                    <div className='flex gap-3 items-center'>
                    <MdHeartBroken className='text-md text-gray-400' size={20}/>
                  
                    <h1 className='text-md text-black font-medium'>Deactive your Account</h1>

                  

                    </div>
                    <p className='text-sm text-gray-500'>Find out how you can deactive your account </p>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default index;