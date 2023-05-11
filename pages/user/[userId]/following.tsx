import Header from '@/components/Header/Heder';
import FollowingItem from '@/components/Users/FollowingItem';
import useGetFollowing from '@/hooks/useGetFollowing';
import useUser from '@/hooks/useUser';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';

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

const following:React.FC = () => {
    const router=useRouter()
    const {userId}=router.query
    const {data:following}=useGetFollowing(userId as string)
    const {data:user}=useUser(userId as string)
    
    return(
        <div className='flex flex-col sm:w-auto lg:w-full mx-5'>
       
            {user && 
         <Header showBackArrow label={user?.name as string} sublebel={user?.customTag as string} />
         } 
            <div className='flex  flex-col sm:w-full lg:w-auto items-start' key={`following+${Math.random()/2}`}>
                {following?.map((following,index)=>(
                    <>
                    <FollowingItem key={index} following={following} />
                    </>
                ))}
                {following && following?.length===0 && <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl  font-bold text-gray-500">No following</h1>
                    </div>}
            </div>


        </div>
    )
}
export default following;