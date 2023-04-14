import useSWR from "swr"
import fetcher from "@/libs/fetcher"

const currentUser=()=>{
    const {data,error,isLoading,mutate}=useSWR("/api/current",fetcher)
    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default currentUser