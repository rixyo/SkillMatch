import useReplays from '@/hooks/useReplays';
import React from 'react';
import ReplayItem from './ReplayItem';

type ReplaysFeedProps = {
    commentId: string
    
};

const ReplaysFeed:React.FC<ReplaysFeedProps> = ({commentId}) => {
    const {data:replays,mutate:mutatedReplay}=useReplays(commentId)
    
    return (
       <>
      {replays  && replays.map((replay:Replay)=>(
      
        <ReplayItem replay={replay} key={replay.id} mutatedReplay={mutatedReplay}/>
      
      ))}
       </>
        
    )
}
export default ReplaysFeed;