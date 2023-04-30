import useSWR from "swr"
import fetcher from "@/libs/fetcher"

const useComment=(commentId:string)=>{
    const {data,error,isLoading,mutate}=useSWR<comment>(commentId?`/api/comment/${commentId}`:null,fetcher)
    return {
        data,
        isLoading,
        error,
        mutate
    }

}
export default useComment