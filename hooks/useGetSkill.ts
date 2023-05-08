import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useGetSkill = (userId: string) => {
    const { data, error, isLoading, mutate } = useSWR<Skill[]>(
       userId? `/api/users/skill?userId=${userId}`:"/api/users/skill",
        fetcher
    );
    
    return {
        data,
        isLoading,
        error,
        mutate,
    };
}
export default useGetSkill;
