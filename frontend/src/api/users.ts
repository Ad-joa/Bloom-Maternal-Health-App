import apiClient from './client';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getInsights = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/insights`);
        await AsyncStorage.setItem(`@insights_${userId}`, JSON.stringify(response.data));
        return response.data;
    } catch (error) {
        console.warn("API failed, attempting to load cached insights:", error);
        try {
            const cached = await AsyncStorage.getItem(`@insights_${userId}`);
            if (cached) {
                return JSON.parse(cached);
            }
        } catch (storageError) {
            console.error("Failed to load cached insights:", storageError);
        }
        throw error;
    }
};

export const onboardUser = async (userId: number, data: any) => {
    try {
        const response = await apiClient.put(`/users/${userId}/onboard`, data);
        return response.data;
    } catch (error) {
        console.error("Error saving onboarding:", error);
        throw error;
    }
};

export const updateUserProfile = async (userId: number, data: any) => {
    try {
        const response = await apiClient.put(`/users/${userId}`, data);
        return response.data;
    } catch (error: any) {
        throw error.response?.data || error.message;
    }
};

export const getPartnerSummary = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/partner-summary`);
        return response.data;
    } catch (error) {
        console.error("Error fetching partner summary:", error);
        return null;
    }
};

export const linkPartner = async (userId: number, code: string) => {
    try {
        const response = await apiClient.post(`/users/${userId}/partner/link`, { code });
        return response.data;
    } catch (error) {
        console.error("Error linking partner:", error);
        throw error;
    }
};

export const getPartnerDashboard = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/partner/dashboard`);
        return response.data;
    } catch (error) {
        console.error("Error fetching partner dashboard:", error);
        throw error;
    }
};

export const getProfile = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching profile:", error);
        throw error;
    }
};

export const getReminders = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/reminders`);
        return response.data;
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return [];
    }
};

export const createReminder = async (userId: number, reminderData: any) => {
    try {
        const response = await apiClient.post(`/users/${userId}/reminders`, reminderData);
        return response.data;
    } catch (error) {
        console.error("Error creating reminder:", error);
        throw error;
    }
};

export const deleteReminder = async (userId: number, reminderId: number) => {
    try {
        const response = await apiClient.delete(`/users/${userId}/reminders/${reminderId}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting reminder:", error);
        throw error;
    }
};
