import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useNotifications = (userId?:string) => {
    const { data, error,mutate,isLoading } = useSWR<notification[]>(userId?`/api/notification/${userId}`:null, fetcher);
    
    return {
     data,
        mutate,
        isLoading,
        error,
    }

}
export default useNotifications