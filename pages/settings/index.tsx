import Header from '@/components/Header/Heder';
import React from 'react';
import {TbMathGreater} from 'react-icons/tb'
import {CgProfile} from 'react-icons/cg'
import { BsKey } from 'react-icons/bs';
import { MdHeartBroken } from 'react-icons/md';
import { useRouter } from 'next/router';
import useVerifyModal from '@/hooks/useVerifyModal';
import { AiOutlineMobile } from 'react-icons/ai';
import useNumberVerify from '@/hooks/useNumberVerifyModal';
import Head from 'next/head';
import { getSession } from 'next-auth/react';
import { NextPageContext } from 'next';

export async function getServerSideProps(context:NextPageContext) {
    const session = await getSession(context)
    if(!session){
        return{
            redirect:{
            destination:"/",
            permanent:false
            }
        }
    }
    return {
        props: { session },
    }
  }
const index:React.FC = () => {
    const router=useRouter()
    const verifyModal=useVerifyModal();
    const verify=useNumberVerify()
    
    return (
        <div>
              <Head>
        <title>Your Account /SkillMatch</title>
        <meta name="description" content="User setting page" />
        <meta property="og:title" content="Your Account /SkillMatch" />
        <meta property="og:description" content="User can change there setting from this page" />
       
        <meta property="og:url" content="https://example.com/my-page" />
        <meta property="og:type" content="website" />
      </Head>
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
                    <div className='flex justify-between items-center hover:cursor-pointer' onClick={verifyModal.onOpen}>
                    <h1 className='ml-2 text-md text-gray-600 font-semibold'>Verification</h1>
                    <TbMathGreater className=''/>

                    </div>
                    </div>
              
                <div className='col-span-1  hover:cursor-pointer p-2 '>
                    

                    <div className='flex gap-3 items-center '>
                    <CgProfile className='text-md text-gray-400 ml-1' size={20}/>
                  
                    <h1 className='text-md text-black font-medium'>Account Information</h1>

                  

                    </div>
                    <p className='text-sm text-gray-500'>See your account information like your phone number email address </p>
                    <div className='flex gap-3 items-center'>
                    <AiOutlineMobile className='text-md text-black ml-1 mt-5' size={20}/>
                  
                    <h1 className='text-md text-black font-medium mt-5 hover:underline' onClick={verify.onOpen}>Verify number</h1>
                    </div>
                    <p className='text-sm text-gray-500'>Verify your phone number to get more features like verification </p>
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
                  
                    <h1 className='text-md text-black font-medium hover:underline' onClick={()=>router.push("/settings/deactive")}>Deactive your Account</h1>

                  

                    </div>
                    <p className='text-sm text-gray-500' >Find out how you can deactive your account </p>
                    </div>
                </div>
            </div>
        </div>

    )
}
export default index;