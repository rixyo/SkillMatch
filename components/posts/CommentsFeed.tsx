import useGetComments from '@/hooks/useGetComments';
import React from 'react';
import { CircleLoader } from 'react-spinners';
import CommentItem from './CommentItem';

type CommentsFeedProps = {
    postId:string
};

const CommentsFeed:React.FC<CommentsFeedProps> = ({postId}) => {
    const {data:comments,mutate:commentMuted,isLoading}=useGetComments(postId)
    return (
        <div className='flex flex-col sm:w-full lg:w-auto   my-5' key={`comments+${postId}`}>
            {isLoading?<div className="flex flex-row justify-center items-center">
  <CircleLoader color="#3B82F6"  size={50} />
</div>:(
    <>
     {comments && comments.map((comment:comment)=>(
            <>
                <CommentItem key={comment.id} comment={comment} commentMutate={commentMuted} />
           
            </>
           ) )}
    </>
) }
          


        </div>
    )
}
export default CommentsFeed;