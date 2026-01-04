import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getBanners } from '../api/bannerService';

export const useBanners = ({page, limit, enabled}) => {
    return useQuery({
        queryKey: ['banners', page, limit],
        queryFn: ()=> getBanners({ page, limit}),
        placeholderData: keepPreviousData,
        enabled: enabled,
        staleTime: 10*60*1000,
    });
};