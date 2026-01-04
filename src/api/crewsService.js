import apiClient from "./client";

/**
 * Submits a new crew (strategy) to the database.
 * @param {object} payload -- Includes stage_id, team members, guide type(video/text) and creator info.
 * @returns {Promise<object>} The server response indicating success/failure.
 */
export const submitCrew = async (payload) => {
    const response = await apiClient.post('/api/crews/submit', payload);
    return response.data;
};

/**
 * CORE SEARCH FUNCTION
 * Fetches the list of crews based on filters (Stage, Captains) and User Box (My Box).
 * 
 * @param {string} mode - The game mode (e.g. 'grand_voyage', 'kizuna_clash') 
 * @param {object} filters - Key-value pairs of active filters (e.g. {stage: 'vs Arlong'}).
 * @param {number} page - Current pagination index.
 * @param {number} limit - Items per page.
 * @param {boolean} showOnlyOwned - If true, filters crews performable with user's box.
 * @param {Array<number>} ownedIds - List of character IDs the user owns (used when showOnlyOwned is true) 
 */

export const searchCrews = async({mode, filters, page, limit, showOnlyOwned, ownedIds}) => {
    let postData ={
        mode,
        ...filters 
    };

    if(showOnlyOwned){
        postData.ownedIds = ownedIds || [-1];
    }

    const response = await apiClient.post('/api/stages/search', postData, {
        params: { page, limit }
    });
    return response.data;
};