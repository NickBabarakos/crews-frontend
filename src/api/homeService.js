import apiClient from "./client";

export const getHomeStats = async () => {
    const response = await apiClient.get('/api/home/stats');
    return response.data;
};

export const getActiveEvents = async() => {
    const response = await apiClient.get('/api/home/events');
    return response.data;
};

export const getLatestUnits = async()=> {
    const response = await apiClient.get('/api/home/latest-unit');
    return response.data;
};

export const getChangelog = async() => {
    const response = await apiClient.get('/api/home/changelog');
    return response.data;
};