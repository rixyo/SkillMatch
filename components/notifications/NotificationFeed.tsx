import currentUser from '@/hooks/useCurrentUser';
import useNotifications from '@/hooks/useNotifications';
import useUser from '@/hooks/useUser';
import React, { useEffect } from 'react';
import NotificationItem from './NotificationItem';



const NotificationFeed:React.FC = () => {
    const {data:loginUser,mutate:mutatedLoginUser}=currentUser()
    //console.log(loginUser)
   
        const {data:notifications}=useNotifications(loginUser?.user.id as string)
       
    
       
   // const {data:notifications,mutate:mutatedNotification}=useNotifications(loginUser?.user.id as string)

  
    useEffect(()=>{
        mutatedLoginUser()
    },[mutatedLoginUser()])
    
    
    return(
        <>
        {notifications && notifications?.length>0?notifications?.map((notification:notification)=>(
            <NotificationItem notification={notification} key={notification.id}/>
        )
        ):<div className="text-neutral-600 text-center p-6 text-xl">
        No notifications
      </div>
        }
        </>
    )
}
export default NotificationFeed;