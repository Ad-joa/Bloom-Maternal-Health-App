import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We rely on Expo's environment variables to prevent hardcoding server URLs in the codebase.
// Define EXPO_PUBLIC_API_URL in a frontend/.env file.
import Constants from 'expo-constants';

const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    // Fallback for local development
    if (__DEV__) {
        // If testing on a physical device via Expo Go, this grabs my computer's local Wi-Fi IP automatically
        const debuggerHost = Constants.expoConfig?.hostUri;
        if (debuggerHost) {
            const localhost = debuggerHost.split(':')[0];
            return `http://${localhost}:8000`;
        }

        // Emulators fallback
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:8000';
        }
        return 'http://127.0.0.1:8000';
    }

    // Production fallback
    return '';
};

const apiClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

export const getTrimesterInfo = async (trimesterId: number) => {
    try {
        const response = await apiClient.get(`/trimester/${trimesterId}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching trimester info:", error);
        throw error;
    }
};

export const getAdvisory = async (symptoms: string[], userId?: number) => {
    try {
        const payload: any = { symptoms };
        if (userId) payload.user_id = userId;
        const response = await apiClient.post('/advisory', payload);
        return response.data;
    } catch (error) {
        console.error("Error fetching advisory:", error);
        throw error;
    }
};

export const loginUser = async (credentials: any) => {
    try {
        const response = await apiClient.post('/login', credentials);
        return response.data;
    } catch (error) {
        console.error("Error logging in:", error);
        throw error;
    }
};

export const saveSymptomLog = async (userId: number, logData: any) => {
    try {
        const response = await apiClient.post(`/users/${userId}/logs`, logData);
        return response.data;
    } catch (error) {
        console.error("Error saving log, attempting to save offline:", error);
        try {
            const { saveSymptomLogLocal } = require('../utils/database');
            await saveSymptomLogLocal(
              userId.toString(), 
              logData.symptoms, 
              String(logData.severity), 
              "",
              logData.blood_pressure,
              logData.weight
            );
            return { message: "Saved offline. Will sync when connection is restored." };
        } catch (storageError) {
            console.error("Offline save failed too:", storageError);
            throw error;
        }
    }
};

export const getSymptomLogs = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/logs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs:", error);
        return [];
    }
};

export const getInsights = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/insights`);
        // Cache the successful response
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

export const registerUser = async (userData: any) => {
    try {
        const response = await apiClient.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        console.error("Error registering:", error);
        throw error;
    }
};

export const onboardUser = async (
    userId: number,
    data: {
        trimester?: number;
        due_date?: string;
        is_first_pregnancy?: boolean;
        medical_conditions?: string;
        age?: number;
        weight?: string;
        primary_goal?: string;
        dietary_preferences?: string;
        emergency_contact_name?: string;
        emergency_contact_phone?: string;
    }
) => {
    try {
        const response = await apiClient.put(`/users/${userId}/onboard`, data);
        return response.data;
    } catch (error) {
        console.error("Error saving onboarding:", error);
        throw error;
    }
};

export const getAncVisits = async (userId: number) => {
    try {
        const response = await apiClient.get(`/users/${userId}/anc-visits`);
        return response.data;
    } catch (error) {
        console.error("Error fetching ANC visits:", error);
        return [];
    }
};

export const createAncVisit = async (userId: number, visitData: any) => {
    try {
        const response = await apiClient.post(`/users/${userId}/anc-visits`, visitData);
        return response.data;
    } catch (error) {
        console.error("Error creating ANC visit:", error);
        throw error;
    }
};

export const updateAncVisit = async (userId: number, visitId: number, updateData: any) => {
    try {
        const response = await apiClient.put(`/users/${userId}/anc-visits/${visitId}`, updateData);
        return response.data;
    } catch (error) {
        console.error("Error updating ANC visit:", error);
        throw error;
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

export default apiClient;
