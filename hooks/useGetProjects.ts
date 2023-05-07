import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useGetProjects= (userId: string) => {
    const { data, error, isLoading, mutate } = useSWR<Project[]>(
        `/api/users/project?userId=${userId}`,
        fetcher
    );
    
    return {
        data,
        isLoading,
        error,
        mutate,
    };
}
export default useGetProjects;