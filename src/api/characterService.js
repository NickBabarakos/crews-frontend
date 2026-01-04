import apiClient from './client';

export const getCharacters = async({type, search, page, limit}) => {
    const response = await apiClient.get('/api/characters', {
        params: {
            type,
            search,
            page, 
            limit 
        }
    });
    return response.data;
};