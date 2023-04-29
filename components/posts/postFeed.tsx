
import usePosts from '@/hooks/usePosts';
import React from 'react';
import Form from '../Form';
import PostIteam from './PostIteam';

type postFeedProps = {
    userId?: string;
};

const postFeed:React.FC<postFeedProps> = ({userId}) => {
    const {data:posts ,mutate}=usePosts(userId)
    
    return(
        <>
  
        {posts && posts.map((post:Post)=>(
         
         
                <PostIteam key={post.id} post={post} userId={userId} mutate={mutate}/>
              
            
            ))
                
             }
             { posts && posts.length===0 && <div className="flex justify-center items-center h-full">
                <h1 className="text-2xl font-bold text-gray-500">No posts yet</h1>
                </div>}
            </>
    )
}
export default postFeed;