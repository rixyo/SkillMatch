import useSWR from "swr"
import fetcher from "@/libs/fetcher"

const useGetFollower=()=>{
    const {data,error,isLoading,mutate}=useSWR("/api/getfollower",fetcher)
  

    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default useGetFollower