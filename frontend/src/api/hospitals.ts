import apiClient from './client';

export const getHospitals = async () => {
    try {
        const response = await apiClient.get(`/hospitals`);
        return response.data;
    } catch (error) {
        console.error("Error fetching hospitals:", error);
        throw error;
    }
};
