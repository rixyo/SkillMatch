import Header from '@/components/Header/Heder';
import NotificationFeed from '@/components/notifications/NotificationFeed';

import { NextPageContext } from 'next';
import { getSession } from 'next-auth/react';
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

const Notifications:React.FC = () => {
    
    return(
        <>
        <Header label='Notifications' showBackArrow/>
        <NotificationFeed/>
        </>
    )
}
export default Notifications;