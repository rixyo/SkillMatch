import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useGetProjects= (userId: string) => {
    const { data, error, isLoading, mutate } = useSWR<Project[]>(
       userId? `/api/users/project?userId=${userId}`:"/api/users/project",
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