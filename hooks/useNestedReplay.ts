import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useNestedReplay = (nestedreplayId:string) => {
    const { data, error,mutate,isLoading } = useSWR<NestedReplay>(nestedreplayId?`/api/nestedreplay/${nestedreplayId}`:null, fetcher);
    
    return {
     data,
        mutate,
        isLoading,
        error,
    }
}
export default useNestedReplay