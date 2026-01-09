import apiClient from "./client";

const getHeaders = (token) => ({
    headers: { 'Authorization': `Bearer ${token}`}
});

const adminService = {

    login: async (secret) => {
        const response = await apiClient.post('/api/admin/login', {secret});
        return response.data;
    },

    // === AUTH & REPORTS ===
    verifyAuth: async (token) => {
        //Χρησιμοποιουμε το reports endpoint για verification 
        return await apiClient.get('/api/admin/reports', getHeaders(token));
    },

    getReports: async(token) => {
        const response = await apiClient.get('/api/admin/reports', getHeaders(token));
        return response.data;
    },

    resolveReport: async(id, token) =>{
        return await apiClient.delete(`/api/admin/reports/${id}`, getHeaders(token));
    },

    //==CREATORS ===
    checkCreator: async (payload, token) => {
        //payload: {public_key} OR {social_url} 
        const response = await apiClient.post('/api/admin/check-creator', payload, getHeaders(token));
        return response.data;
    },

    createCreator: async (payload, token) =>{
        //payload: {name, social_url, public_key}
        const response = await apiClient.post('/api/admin/create-creator', payload, getHeaders(token));
        return response.data;
    },

    //===CHARACTERS & BANNERS ====
    insertCharacter: async (CharacterData, token) =>{
        const response = await apiClient.post('/api/admin/character', CharacterData, getHeaders(token));
        return response.data;
    },

    insertBanner: async (bannerData, token) => {
        const response = await apiClient.post('/api/admin/banner', bannerData, getHeaders(token));
        return response.data;
    },

    //=== CREWS ===
    createCrew: async (crewData, token) => {
        const response = await apiClient.post('/api/admin/create-crew', crewData, getHeaders(token));
        return response.data;
    },

    getPendingCrews: async (token) => {
        const response = await apiClient.get('/api/admin/pending-crews', getHeaders(token));
        return response.data;
    },

    rejectPendingCrew: async (id, token) =>{
        return await apiClient.delete(`/api/admin/pending-crews/${id}`, getHeaders(token));
    },

    deleteCrew: async (id, token) => {
        return await apiClient.delete(`/api/admin/crews/${id}`, getHeaders(token));
    },

    //===GAME CONTENT (PKA, TM, KIZUNA)===
    updateEventContent: async(mode, data, token) => {
        const response = await apiClient.post('/api/admin/update-event-content', {mode, data}, getHeaders(token));
        return response.data;
    }
};

export default adminService;