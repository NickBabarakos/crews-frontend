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