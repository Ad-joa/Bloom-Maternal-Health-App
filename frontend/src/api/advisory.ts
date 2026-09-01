import apiClient from './client';

export const getAdvisory = async (symptoms: string[], session_id?: string) => {
    try {
        const response = await apiClient.post('/advisory', { symptoms, session_id });
        return response.data;
    } catch (error) {
        console.error("Error fetching advisory:", error);
        throw error;
    }
};

export const getAdvisorySessions = async () => {
    try {
        const response = await apiClient.get('/advisory/sessions');
        return response.data;
    } catch (error) {
        console.error("Error fetching advisory sessions:", error);
        throw error;
    }
};

export const getAdvisoryHistoryBySession = async (sessionId: string) => {
    try {
        const response = await apiClient.get(`/advisory/history/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching advisory history by session:", error);
        throw error;
    }
};

export const deleteAdvisorySession = async (sessionId: string) => {
    try {
        const response = await apiClient.delete(`/advisory/sessions/${sessionId}`);
        return response.data;
    } catch (error) {
        console.error("Error clearing advisory history:", error);
        throw error;
    }
};
