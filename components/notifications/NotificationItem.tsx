import React, { useMemo } from 'react';
import Avatar from '../Avatar';
import Link from 'next/link';
import { formatDistanceToNowStrict } from 'date-fns';
import Head from 'next/head';
type NotificationItemProps = {
    notification:notification
};

const NotificationItem:React.FC<NotificationItemProps> = ({notification}) => {

    
    const createdAt=useMemo(()=>{
        return formatDistanceToNowStrict(new Date(notification.createdAt),{addSuffix:true})


    },[notification.createdAt])
    return (
        <div className='w-full p-2 '>
            <Head>
                <title>Notifications</title>
                 <meta name="description" content={notification?.body} />
        <meta property="og:title" content={notification?.body!} />
        <meta property="og:description" content={notification?.body!} />
        
        <meta property="og:type" content="website" />
            </Head>
            <div className='flex gap-2 items-center '>
                <Avatar
                userId={notification?.fromId as string}
                />
                
                 <Link href={notification.link}>
                <p className='text-blue-500 hover:underline'>{notification?.body}</p>
                <p className='text-md text-gray-700 '>{createdAt}</p>
                 </Link>

            </div>

        </div>

    )
}
export default NotificationItem;