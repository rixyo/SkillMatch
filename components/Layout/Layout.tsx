import React from 'react';
import RightBar from '../Followerbar/FollowerBar';
import FollowBar from '../Followerbar/FollowerBar';
import Sidebar from '../Sidebar/Sidebar';

type LayoutProps = {
    children: React.ReactNode;
};

const Layout:React.FC<LayoutProps> = ({children}) => {
    
    return ( <div className='h-screen  bg-gray-100'>
        <div className='container h-full mx-auto xl:px-30 max-w-6xl'>
            <div className='grid grid-cols-4  h-full xl:grid-cols-9'>
             

                <Sidebar/>
         
                <div className='col-span-3 xl:col-span-4  mt-2 overflow-y-scroll'>
        {children}
                </div>
                <RightBar/>

            
            </div>
        </div>
        </div>
    )
}
export default Layout;