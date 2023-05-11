import Avatar from '@/components/Avatar';
import Header from '@/components/Header/Heder';
import currentUser from '@/hooks/useCurrentUser';
import axios from 'axios';
import { NextPageContext } from 'next';
import {getSession, signOut} from "next-auth/react"
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import toast from 'react-hot-toast';

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

const deactive:React.FC = () => {
    const router=useRouter()
    const {data:loginUser}=currentUser()
    const deactivated=useCallback(async()=>{
        await axios.patch("/api/deactive",{userId:loginUser?.user.id})
        toast.success("Account deactivated")
        router.push("/")
        signOut()

    },[loginUser?.user.id,signOut])
 
    return (
        <>
        <Header label={'Deactivate account'} 
        showBackArrow
        />
        <div className='flex flex-col gap-2 items-start justify-center mt-5'>
            <div className='flex items-center gap-2'>

            <Avatar userId={loginUser?.user.id as string} />
            <div className='flex flex-col'>
                <h1 className='text-md text-gray-600 font-semibold'>{loginUser?.user.name}</h1>
                <p className='text-sm text-gray-500'>{loginUser?.user.customTag}</p>
            </div>
        
            </div>
            <h1 className='text-xl text-black font-bold mt-5' >
                    This will deactivate your account</h1>
            <p className='text-sm text-gray-500'>You are about to start the process of deactivating your SkillMatch account. Your display name, @username, and public profile will no longer be viewable on SkillMatch.</p>
            <h1 className='text-xl text-black font-bold mt-5' >
            What else you should know</h1>
            <p className='text-sm text-gray-500'>You can restore your Twitter account if it was accidentally or wrongfully deactivated for up to 30 days after deactivation.</p>
            <button className='self-center mt-5 text-red-600 ' onClick={deactivated}>Deactive</button>
        </div>
        </>
    )
}
export default deactive;