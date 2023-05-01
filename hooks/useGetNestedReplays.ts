import useSWR from "swr";
import fetcher from "@/libs/fetcher";
const useGetNestedReplays = (replayId:string) => {
    const {data,error,isLoading,mutate}=useSWR<NestedReplay[]>(replayId?`/api/replay/nestedreplay?replayId=${replayId}`:null,fetcher)
    return{
        data,
        isLoading,
        error,
        mutate
    }
}
export default useGetNestedReplays