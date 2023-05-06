import currentUser from '@/hooks/useCurrentUser';
import useNotifications from '@/hooks/useNotifications';
import React, { useEffect } from 'react';
import { CircleLoader } from 'react-spinners';
import NotificationItem from './NotificationItem';



const NotificationFeed:React.FC = () => {
    const {data:loginUser,mutate:mutatedLoginUser}=currentUser()

   
        const {data:notifications,isLoading}=useNotifications(loginUser?.user.id as string)
       
       
    
       
  

  
    useEffect(()=>{
        mutatedLoginUser()
    },[mutatedLoginUser()])
    
    
    return(
        <>
        {notifications && notifications?.length>0 &&notifications?.map((notification:notification)=>(
            <NotificationItem notification={notification} key={notification.id}/>
        )
        )
    }
    {isLoading && <div className="flex justify-center items-center">
    <CircleLoader color="#3B82F6"  size={50} />
        </div>}
        </>
    )
}
export default NotificationFeed;