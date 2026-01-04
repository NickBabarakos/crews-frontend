import apiClient from "./client";

export const submitReport = async({crew_id, message}) => {
    const response = await apiClient.post('/api/reports/submit',{
        crew_id,
        message 
    });
    return response.data;
}