import useNumberVerify from '@/hooks/useNumberVerifyModal';
import axios from 'axios';
import React, { useCallback,useState } from 'react';
import toast from 'react-hot-toast';
import Modal from './Modal';


const VerifyNumber:React.FC= () => {
    const verify=useNumberVerify()
    const [number,setNumber]=useState('')
    const generateOTP=useCallback(async()=>{
        try {
            if(!number) return toast.error('Please enter your number')
            console.log(number)
            await axios.post("/api/OTP",{number})
            toast.success('OTP sent successfully')
            
        } catch (error:any) {
           console.log(error)
            
        }
    },[number])
    const body=(
        <div className='flex flex-col gap-3'>
            <div className='flex gap-2'>
                <input type="text" placeholder='Enter your number' value={number} onChange={(e)=>setNumber(e.target.value)} className='border border-gray-300 w-1/2 p-2 rounded-md outline-none '/>
                <button className='bg-blue-500 text-white p-2 rounded-md' onClick={generateOTP}>Send OTP</button>

            </div>
            <div className='flex gap-2 mt-5 '>
                <input type="text" placeholder='1' className='border border-gray-300 w-1/12 p-2 rounded-md outline-none '/>
                <input type="text" placeholder='2' className='border border-gray-300 w-1/12 p-2 rounded-md outline-none '/>
                <input type="text" placeholder='3' className='border border-gray-300 w-1/12 p-2 rounded-md outline-none '/>
                <input type="text" placeholder='4' className='border border-gray-300 w-1/12 p-2 rounded-md outline-none '/>
                <input type="text" placeholder='5' className='border border-gray-300 w-1/12 p-2 rounded-md outline-none '/>
                <input type="text" placeholder='6' className='border border-gray-300 w-1/12 p-2 rounded-md outline-none '/>
            </div>
        </div>
    )
    
    return (
       <Modal
         title="Verify your number"
         onClose={verify.onClose}
         isOpen={verify.isOpen}
         actionLabel="Verify"
         onSubmit={()=>{}}
            body={body}
       />
    )
}
export default VerifyNumber;