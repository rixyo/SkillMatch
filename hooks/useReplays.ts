import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useReplays = (commentId:string) => {
    const {data,error,isLoading,mutate}=useSWR<Replay[]>(commentId?`/api/comment/replay?commentId=${commentId}`:null,fetcher);
    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default useReplays;