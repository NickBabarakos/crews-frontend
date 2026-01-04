import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getStageList } from "../api/stageService";

export const useBosses = ({mode, level, page, limit, enabled}) => {
    return useQuery({
        queryKey: ['bosses', mode, level, page, limit],
        queryFn: ()=> getStageList({mode, level, page, limit}),
        placeholderData: keepPreviousData,
        enabled: enabled,
        staleTime: 10*60*1000,
    });
};