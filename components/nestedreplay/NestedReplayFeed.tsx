import useGetNestedReplays from '@/hooks/useGetNestedReplays';
import React from 'react';
import { CircleLoader } from 'react-spinners';
import NestedItem from './NestedItem';

type NestedReplayFeedProps = {
    replayId:string
};

const NestedReplayFeed:React.FC<NestedReplayFeedProps> = ({replayId}) => {
    const {data:nestedReplays,mutate:nestedMutatedReplay,isLoading}=useGetNestedReplays(replayId as string)

    
    return (
        <div className=' sm:w-full lg:w-auto   my-5' key={`comments`}>
        {isLoading ? <div className="flex justify-center items-center h-full">
<CircleLoader color="#3B82F6"  size={50} />
        </div> :(
            <>
            {nestedReplays && nestedReplays.map((replay:NestedReplay)=>(
        <>
            <NestedItem key={replay.id} nestedReplay={replay} nestedMutatedReplay={nestedMutatedReplay} />
       
        </>
       ) )}
            </>
        )}
  


      


    </div>
    )
}
export default NestedReplayFeed;