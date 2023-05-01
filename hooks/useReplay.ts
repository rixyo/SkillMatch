import useSWR from "swr";
import fetcher from "@/libs/fetcher";
const useReplay = (replayId:string) => {
    const {data,error,isLoading,mutate}=useSWR<Replay>(replayId?`/api/replay/${replayId}`:null,fetcher)
    return {
        data,
        isLoading,
        error,
        mutate
    }
}
export default useReplay