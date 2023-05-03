import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useSearch = (q:string) => {
    const {data,error,isLoading,mutate}=useSWR(q?`/api/search?q=${q}`:null,fetcher)
    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default useSearch;