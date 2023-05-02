import useGetNestedReplays from '@/hooks/useGetNestedReplays';
import React from 'react';
import { CircleLoader } from 'react-spinners';
import NestedItem from './NestedItem';

type NestedReplayFeedProps = {
    replayId:string
};

const NestedReplayFeed:React.FC<NestedReplayFeedProps> = ({replayId}) => {
    const {data:nestedReplays,mutate:nestedMutatedReplay}=useGetNestedReplays(replayId as string)

    
    return (
        
            <>
            {nestedReplays && nestedReplays.map((replay:NestedReplay)=>(
        <>
            <NestedItem key={replay.id} nestedReplay={replay} nestedMutatedReplay={nestedMutatedReplay} />
       
        </>
       ) )}
         
        
  


      </>


    )
}
export default NestedReplayFeed;