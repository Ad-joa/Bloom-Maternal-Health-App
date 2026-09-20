import apiClient from './client';

export const getEducationalContent = async (trimester?: number, category?: string) => {
    try {
        const params: any = {};
        if (trimester) params.trimester = trimester;
        if (category) params.category = category;
        const response = await apiClient.get(`/educational`, { params });
        return response.data;
    } catch (error) {
        console.error("Error fetching educational content:", error);
        throw error;
    }
};

export const getTrimesterInfo = async (trimesterId: number) => {
    try {
        const response = await apiClient.get(`/trimester/${trimesterId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trimester info:", error);
        throw error;
    }
};
