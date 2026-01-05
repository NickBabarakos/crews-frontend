import apiClient from './client';

export const getCharacters = async({type, search, page, limit, userKey}) => {

    const config ={
        params: {
            type,
            search,
            page,
            limit
        }
    };

    if(userKey){
        config.headers = { 'x-user-secret': userKey};
    }
    const response = await apiClient.get('/api/characters', config);
    return response.data;
};