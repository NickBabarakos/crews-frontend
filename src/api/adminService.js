import apiClient from "./client";

//Helper για να φτιαχνουμε ευκολα τα headers με το secret
const getHeaders = (secret) => ({
    headers: { 'x-admin-secret': secret}
});

const adminService = {
    // === AUTH & REPORTS ===
    verifyAuth: async (secret) => {
        //Χρησιμοποιουμε το reports endpoint για verification 
        return await apiClient.get('/api/admin/reports', getHeaders(secret));
    },

    getReports: async(secret) => {
        const response = await apiClient.get('/api/admin/reports', getHeaders(secret));
        return response.data;
    },

    resolveReport: async(id, secret) =>{
        return await apiClient.delete(`/api/admin/reports/${id}`, getHeaders(secret));
    },

    //==CREATORS ===
    checkCreator: async (payload, secret) => {
        //payload: {public_key} OR {social_url} 
        const response = await apiClient.post('/api/admin/check-creator', payload, getHeaders(secret));
        return response.data;
    },

    createCreator: async (payload, secret) =>{
        //payload: {name, social_url, public_key}
        const response = await apiClient.post('/api/admin/create-creator', payload, getHeaders(secret));
        return response.data;
    },

    //===CHARACTERS & BANNERS ====
    insertCharacter: async (CharacterData, secret) =>{
        const response = await apiClient.post('/api/admin/character', CharacterData, getHeaders(secret));
        return response.data;
    },

    insertBanner: async (bannerData, secret) => {
        const response = await apiClient.post('/api/admin/banner', bannerData, getHeaders(secret));
        return response.data;
    },

    //=== CREWS ===
    createCrew: async (crewData, secret) => {
        const response = await apiClient.post('/api/admin/create-crew', crewData, getHeaders(secret));
        return response.data;
    },

    getPendingCrews: async (secret) => {
        const response = await apiClient.get('/api/admin/pending-crews', getHeaders(secret));
        return response.data;
    },

    rejectPendingCrew: async (id, secret) =>{
        return await apiClient.delete(`/api/admin/pending-crews/${id}`, getHeaders(secret));
    },

    deleteCrew: async (id, secret) => {
        return await apiClient.delete(`/api/admin/crews/${id}`, getHeaders(secret));
    },

    //===GAME CONTENT (PKA, TM, KIZUNA)===
    updateEventContent: async(mode, data, secret) => {
        const response = await apiClient.post('/api/admin/update-event-content', {mode, data}, getHeaders(secret));
        return response.data;
    }
};

export default adminService;