import apiClient from './client';

export const getAdvisory = async (symptoms: string[]) => {
    try {
        const response = await apiClient.post('/advisory', { symptoms });
        return response.data;
    } catch (error) {
        console.error("Error fetching advisory:", error);
        throw error;
    }
};

export const getAdvisoryHistory = async () => {
    try {
        const response = await apiClient.get('/advisory/history');
        return response.data;
    } catch (error) {
        console.error("Error fetching advisory history:", error);
        throw error;
    }
};

export const clearAdvisoryHistory = async () => {
    try {
        const response = await apiClient.delete('/advisory/history');
        return response.data;
    } catch (error) {
        console.error("Error clearing advisory history:", error);
        throw error;
    }
};
