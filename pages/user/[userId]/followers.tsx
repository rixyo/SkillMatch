
import Header from '@/components/Header/Heder';
import useGetFollower from '@/hooks/useGetFollower';
import useUser from '@/hooks/useUser';
import React from 'react';
import { RingLoader,CircleLoader } from 'react-spinners';
import {useRouter} from 'next/router'
import FollowerItem from '@/components/Users/FollowerItem';
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
const followers:React.FC = () => {
    const router=useRouter()
    const {userId}=router.query
    const {data:followers,isLoading:followerDataLoading}=useGetFollower(userId as string)

    const {data:user}=useUser(userId as string)


    if(followerDataLoading) return(
        <div className='flex justify-center items-center h-full'>
            <CircleLoader color={'#3B82F6'} loading={true} size={50} />

        </div>
    )
    
    return (
        <div className='flex flex-col sm:w-auto lg:w-full mx-5'>
          
        
         {user && 
         <Header showBackArrow label={user?.name as string} sublebel={user?.customTag as string} />
         }  
        
       
            <div className='flex  flex-col sm:w-full lg:w-auto items-start'>
              {followers?.map((follower,index)=>(
                <>
              
                    <FollowerItem key={index} follower={follower} />
                </>
              ))}
                {followers && followers?.length===0 && <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl  font-bold text-gray-500">No followers yet</h1>
                    </div>}
            </div>
   
          

        </div>
    )
}
export default followers;