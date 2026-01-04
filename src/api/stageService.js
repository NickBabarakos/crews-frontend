import apiClient from "./client";

/**
 * 
 * Fetches the dropdown options or boss list for a specific mode.
 * Used primarily in the BossGridView (Coliseum) or strictly for filtering lists.
 */
export const getStageList = async({mode, level, page, limit}) => {
    const response = await apiClient.get('/api/stages/list', {
        params: {mode, level, page, limit}
    });
    return response.data;
};

/**
 * Fetches detailed info for a specific stage/boss.
 * Used to get:
 * 1. The Stage Id (needed for submitting crews).
 * 2. The Stage Guide (Gimmicks, HP, Attack Patterns) fro the Guide Modal.
 * 
 * @param {object} params - {mode, stage, level? }
 * @returns 
 */

export const getStageInfo = async (params) => {
    const response = await apiClient.get('/api/stages/info', { params});
    return response.data;
};

/**
 * Fetches dynamic event names (e.g. for Kizuna/TM/PKA).
 * Used to map static IDs (e.g 290) to current event names (e.g. "Vs Big Mom")
 * @returns 
 */

export const getEventNames = async() => {
    const response = await apiClient.get('/api/stages/event-names');
    return response.data;
}