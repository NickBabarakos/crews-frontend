import apiClient from "./client";


export const getCreators = async({page, limit}) => {
    const response = await apiClient.get('/api/creators/leaderboard', {
        params: { page, limit}
    });
    return response.data;
}

export const verifyCreatorHandle = async(socialUrl) =>{
    const response = await apiClient.post('/api/creators/verify-handle', {
        social_url: socialUrl
    });
    return response.data;
};

export const verifyCreatorKey = async(publicKey) => {
    const response = await apiClient.post('/api/creators/verify-key', {
        public_key: publicKey
    });
    return response.data;
};

export const checkCreatorName = async(name) => {
    const encodedName = encodeURIComponent(name.trim());
    const response = await apiClient.get(`/api/creators/check-name/${encodedName}`);
    return response.data;
};



