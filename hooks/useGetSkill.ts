import useSWR from 'swr';
import fetcher from '@/libs/fetcher';

const useGetSkill = (userId: string) => {
    const { data, error, isLoading, mutate } = useSWR<Skill[]>(
        `/api/users/skill?userId=${userId}`,
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
