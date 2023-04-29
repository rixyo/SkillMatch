import useSWR from "swr";
import fetcher from "@/libs/fetcher";
const useGetComments = (postId:string) => {
    const {data,error,isLoading,mutate}=useSWR<comment[]>(`/api/comment?postId=${postId}`,fetcher)
    return{
        data,
        isLoading,
        error,
        mutate
    }
}
export default useGetComments