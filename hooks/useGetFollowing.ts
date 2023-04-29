import useSWR from "swr"
import fetcher from "@/libs/fetcher"
const useGetFollowing=(userId:string)=>{
    const {data,error,isLoading,mutate}=useSWR<User[]>(`/api/following/${userId}`,fetcher)
    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default useGetFollowing