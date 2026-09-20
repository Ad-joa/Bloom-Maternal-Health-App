import apiClient from './client';

export const loginUser = async (credentials: any) => {
    try {
        const response = await apiClient.post('/auth/login', credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const forgotPassword = async (email: string) => {
    try {
        const response = await apiClient.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const resetPassword = async (data: any) => {
    try {
        const response = await apiClient.post('/auth/reset-password', data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error;
    }
};

export const registerUser = async (userData: any) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};

export const deleteAccount = async () => {
    try {
        const response = await apiClient.delete('/auth/account');
        return response.data;
    } catch (error) {
        console.error("Error deleting account:", error);
        throw error;
    }
};
