import React from 'react';
import ReplayItem from './ReplayItem';

type ReplaysFeedProps = {
    replays: Replay[]
    
};

const ReplaysFeed:React.FC<ReplaysFeedProps> = ({replays}) => {
    console.log(replays)
    
    return (
       <>
      {replays && replays.map((replay:Replay)=>(
      
        <ReplayItem replay={replay} key={replay.id}/>
      
      ))}
       </>
        
    )
}
export default ReplaysFeed;