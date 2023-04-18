import useSWR from "swr"
import fetcher from "@/libs/fetcher"

const usePost=(postId:string)=>{
    const {data,error,isLoading,mutate}=useSWR<Post>(postId?`/api/posts/${postId}`:null,fetcher)
    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default usePost