import apiClient from './client';

export const getCharacters = async({type, search, page, limit, userKey, trigger}) => {

    const config ={
        params: {
            type,
            search,
            page,
            limit,
            t: trigger
        }
    };

    if(userKey){
        config.headers = { 'x-user-public': userKey};
    }
    const response = await apiClient.get('/api/characters', config);
    return response.data;
};