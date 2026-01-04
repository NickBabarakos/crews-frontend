import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { searchCrews } from "../api/crewsService";

/**
 * REACT QUERY HOOK Fetch Crews
 * -----------------------------
 * Wrapper around the searchCrews API.
 * 
 * Features:
 * 1. keepPreviousData: Keeps the old list visible while loading the new page (smooth UX).
 * 2. staleTime (5min): Data is considered fresh for 5 minutes (minimizes API calls on back/forth nav)
 * 3. Enabled: Can be paused (e.g, waiting for filters to be ready)
 */

export const useCrews = ({ mode, filters, page, limit, showOnlyOwned, enabled, ownedIds}) =>{
    return useQuery({
        queryKey: ['crews', mode, filters, page, limit, showOnlyOwned, ownedIds],
        queryFn: ()=> searchCrews({ mode, filters, page, limit, showOnlyOwned, ownedIds}),
        placeholderData: keepPreviousData,
        enabled: enabled,
        staleTime: 5*60*1000,
    });
};