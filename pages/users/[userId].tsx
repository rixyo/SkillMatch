import Header from '@/components/Header/Heder';
import UserBio from '@/components/Users/UserBio';
import UserHero from '@/components/Users/UserHero';
import useUser from '@/hooks/useUser';
import { useRouter } from 'next/router';
import React from 'react';
import {CircleLoader} from "react-spinners"


const userView:React.FC = () => {
    const router = useRouter();
    const { userId } = router.query;
    const {data: fetchUser,isLoading} = useUser(userId as string);

    if(isLoading || !fetchUser) return(
        <div className='flex justify-center items-center h-full'>
            <CircleLoader color={'#3B82F6'} loading={true} size={50} />

        </div>
    )
    
    return (
        <>
        <Header showBackArrow label={fetchUser.name} />
        <UserHero userId={fetchUser.id as string}/>
        <div className=' ml-5 mt-5'>
        <UserBio userId={fetchUser.id as string}/>
        </div>
        
        </>
    )
}
export default userView;