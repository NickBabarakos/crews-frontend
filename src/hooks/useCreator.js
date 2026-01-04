import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getCreators } from "../api/creatorService";

export const useCreators = ( {page, limit, enabled }) => {
    return useQuery({
        queryKey: ['creators', page, limit],
        queryFn: ()=> getCreators({page, limit}),
        placeholderData: keepPreviousData,
        enabled: enabled,
        staleTime: 5*60*1000,
    });
};