import useSWR from "swr"
import fetcher from "@/libs/fetcher"

const useGetFollower=(userId:string)=>{
    const {data,error,isLoading,mutate}=useSWR<User[]>(`/api/${userId}`,fetcher)
  

    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default useGetFollower