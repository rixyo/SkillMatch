import React from 'react';
import Image from 'next/image';
import useUser from '@/hooks/useUser'
import Avatar from '@/components/Avatar';
type UserHeroProps = {
    userId: string;
};

const UserHero:React.FC<UserHeroProps> = ({userId}) => {
    const {data: fetchUser} = useUser(userId);

    
    return(
        <div>
            <div className='bg-blue-100 h-44 relative'>
                {fetchUser?.coverImage && <Image src={fetchUser.coverImage} width={500} height={200} alt="cover" className='rounded-md'/>}
                <div className='absolute -bottom-10 left-2 '>
                    <Avatar userId={userId} isLarge hasBorder />

                </div>
            </div>
        </div>
    )
}
export default UserHero;