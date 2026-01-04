import apiClient from "./client";

export const getBanners = async ({ page, limit}) => {
    const response = await apiClient.get('/api/banners', {
        params: {page,limit}
    });
    return response.data;
};

export const getBannerDetails = async(bannerId) => {
    const response = await apiClient.get(`/api/banners/${bannerId}`);
    return response.data;
}