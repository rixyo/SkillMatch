import Header from '@/components/Header/Heder';
import PostFeed from '@/components/posts/postFeed';
import Project from '@/components/Users/Project';
import Skill from '@/components/Users/Skill';
import UserBio from '@/components/Users/UserBio';
import UserHero from '@/components/Users/UserHero';
import usePosts from '@/hooks/usePosts';
import useUser from '@/hooks/useUser';
import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import React from 'react';
import { CircleLoader} from "react-spinners"
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

const userView:React.FC = () => {
    const router = useRouter();
    const { userId } = router.query

    
    const {data: fetchUser,isLoading} = useUser(userId as string);
   
    const {isLoading:loading}=usePosts(userId as string)

    if(isLoading || !fetchUser) return(
        <div className='flex justify-center items-center h-full'>
            <CircleLoader color={'#3B82F6'} loading={true} size={50} />

        </div>
    )
    
    return (
        <>
        <Header showBackArrow label={fetchUser.name as string} />
    
      <UserHero userId={userId as string}/>
      
     
  <UserBio userId={userId as string}/> 
  <Skill/>
  <Project/>
       
       
        {loading?<div className="flex justify-center items-center h-full">
  <CircleLoader color="#3B82F6"  size={50} />
</div> :  <PostFeed  userId={userId as string} />}

        
        
        </>
    )
}
export default userView;