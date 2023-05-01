import useGetComments from '@/hooks/useGetComments';
import React from 'react';
import { CircleLoader } from 'react-spinners';
import CommentItem from './CommentItem';

type CommentsFeedProps = {
 
    postId:string
};

const CommentsFeed:React.FC<CommentsFeedProps> = ({postId}) => {
    const {data:comments,mutate:commentMuted,isLoading}=useGetComments(postId as string)

        
  
    return (
        <div className='flex flex-col sm:w-full lg:w-auto   my-5' key={`comments`}>
            {isLoading ? <div className="flex justify-center items-center h-full">
    <CircleLoader color="#3B82F6"  size={50} />
            </div> :(
                <>
                {comments && comments.map((comment:comment)=>(
            <>
                <CommentItem key={comment.id} comment={comment} />
           
            </>
           ) )}
                </>
            )}
      
   

          


        </div>
    )
}
export default CommentsFeed;