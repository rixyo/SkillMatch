import React, { useMemo } from 'react';
import useUser from '@/hooks/useUser';
import Avatar from '../Avatar';
import Link from 'next/link';
import { AiFillHeart } from 'react-icons/ai';
import { SlUserFollow } from 'react-icons/sl';
import { formatDistanceToNowStrict } from 'date-fns';
type NotificationItemProps = {
    notification:notification
};

const NotificationItem:React.FC<NotificationItemProps> = ({notification}) => {

    
    const createdAt=useMemo(()=>{
        return formatDistanceToNowStrict(new Date(notification.createdAt),{addSuffix:true})


    },[notification.createdAt])
    return (
        <div className='w-full p-2 '>
            <div className='flex gap-2 items-center '>
                <Avatar
                userId={notification?.fromUserId as string}
                />
                
                 <Link href={notification.link}>
                <p className='text-blue-500 hover:underline'>{notification?.body}</p>
                <p>{createdAt}</p>
                 </Link>

            </div>

        </div>

    )
}
export default NotificationItem;