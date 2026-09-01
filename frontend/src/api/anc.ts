import apiClient from './client';

export const getAncVisits = async () => {
    try {
        const response = await apiClient.get(`/anc`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ANC visits:", error);
        throw error;
    }
};

export const createAncVisit = async (visitData: any) => {
    try {
        const response = await apiClient.post(`/anc`, visitData);
        return response.data;
    } catch (error) {
        console.error("Error creating ANC visit:", error);
        throw error;
    }
};

export const updateAncVisit = async (visitId: number, updateData: any) => {
    try {
        const response = await apiClient.put(`/anc/${visitId}`, updateData);
        return response.data;
    } catch (error) {
        console.error("Error updating ANC visit:", error);
        throw error;
    }
};

export const deleteAncVisit = async (visitId: number) => {
    try {
        const response = await apiClient.delete(`/anc/${visitId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting ANC visit:", error);
        throw error;
    }
};
