import apiClient from './client';

export const restoreBoxService = async (secretKey) => {
    const response = await apiClient.post('/api/box/restore', {secretKey});
    return response.data;
};

export const updateBoxService = async (secretKey, boxData, favorites) => {
    const response = await apiClient.post('/api/box/update' , {
        secretKey,
        boxData,
        favorites
    });
    return response.data;
};

export const createBoxService = async (initialData, favorites) => {
    const response = await apiClient.post('/api/box/create', {
        initialData,
        favorites
    });
    return response.data;
};

export const getOtherBoxService = async (publicKey) => {
    const response = await apiClient.get(`/api/box/view/${publicKey}`);
    return response.data;
}