import Header from '@/components/Header/Heder';
import PostFeed from '@/components/posts/postFeed';
import UserBio from '@/components/Users/UserBio';
import UserHero from '@/components/Users/UserHero';
import usePosts from '@/hooks/usePosts';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';
import React from 'react';
import { RingLoader,CircleLoader} from "react-spinners"


const userView:React.FC = () => {
    const router = useRouter();
    const { userId } = router.query;
    
    const {data: fetchUser,isLoading} = useUser(userId as string);
   
    const {isLoading:loading}=usePosts(userId as string)

    if(isLoading || !fetchUser) return(
        <div className='flex justify-center items-center h-full'>
            <RingLoader color={'#3B82F6'} loading={true} size={50} />

        </div>
    )
    
    return (
        <>
        <Header showBackArrow label={fetchUser.name as string} />
    
      <UserHero userId={userId as string}/>
      
     
    <UserBio userId={userId as string}/>
       
       
        {loading?<div className="flex justify-center items-center h-full">
  <CircleLoader color="#3B82F6"  size={50} />
</div> :  <PostFeed  userId={userId as string} />}

        
        
        </>
    )
}
export default userView;