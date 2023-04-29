import useGetComments from '@/hooks/useGetComments';
import React from 'react';
import CommentItem from './CommentItem';

type CommentsFeedProps = {
    postId:string
};

const CommentsFeed:React.FC<CommentsFeedProps> = ({postId}) => {
    const {data:comments,mutate:commentMuted}=useGetComments(postId)
    return (
        <div className='flex flex-col sm:w-full lg:w-auto items-start  my-5' key={`comments+${postId}`}>
           {comments && comments.map((comment:comment)=>(
            <>
                <CommentItem key={comment.id} comment={comment} commentMutate={commentMuted} />
           
            </>
           ) )}


        </div>
    )
}
export default CommentsFeed;