/**
 * API SERVICE LAYER: CHARACTERS
 * -----------------------------
 * Handles direct HTTP communication with the backend for character data.
 * 
 * Features:
 * - **Filtering:** passes search/type/page params.
 * - **Context Awareness:** Passes 'x-user-public' header if we need to 
 *   see the character ownership relative to another user (View Box feature).
 */

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
    //LOGIC: View Box Feature
    //If userKey is provided (from Context), we tell the server:
    //"Fetch characters, but also tell me if this user owns them".
    if(userKey){
        config.headers = { 'x-user-public': userKey};
    }
    const response = await apiClient.get('/api/characters', config);
    return response.data;
};