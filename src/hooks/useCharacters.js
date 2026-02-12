/**
 * DATA HOOK: USE CHARACTERS
 * -------------------------
 * A React Query wrapper for fetching paginated character lists.
 * 
 * Features:
 * - **Caching:** Keeps data fresh for 5 mins (staleTime).
 * - **UX:** Uses `keepPreviousData` to prevent flickering during pagination.
 * - **Conditional Fetch:** Only runs when a 'type' is selected.
 */
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getCharacters } from '../api/characterService';

export const useCharacters = (params) => {
    return useQuery({
        queryKey: ['characters', params],
        queryFn: ()=> getCharacters(params),
        placeholderData: keepPreviousData,
        enabled: !!params.type, 
        staleTime: 5*60*1000,
    });
};