import useGetComments from '@/hooks/useGetComments';
import React from 'react';
import { CircleLoader } from 'react-spinners';
import CommentItem from './CommentItem';

type CommentsFeedProps = {
 
    postId:string
};

const CommentsFeed:React.FC<CommentsFeedProps> = ({postId}) => {
    const {data:comments,isLoading}=useGetComments(postId as string)

        
  
    return (
        <>
            {isLoading ? <div className="flex justify-center items-center h-full" key={"loading"}>
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
      
   

          


        </>
    )
}
export default CommentsFeed;