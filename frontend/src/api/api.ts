import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// We rely on Expo's environment variables to prevent hardcoding server URLs in the codebase.
// Define EXPO_PUBLIC_API_URL in a frontend/.env file.
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    
    // Fallback for local development if .env is missing
    if (__DEV__) {
        // Typically 10.0.2.2 for Android emulator, or your local machine's IP (e.g., 172.20.10.3)
        // Since we know your IP is 172.20.10.3, we'll hardcode the fallback here so it works instantly
        return 'http://172.20.10.3:8000';
    }
    
    // Production fallback (should ideally be injected via EXPO_PUBLIC_API_URL in CI/CD)
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

export const saveSymptomLog = async (userId: number, symptoms: string) => {
    try {
        const response = await apiClient.post(`/users/${userId}/logs`, { symptoms });
        return response.data;
    } catch (error) {
        console.error("Error saving log, attempting to save offline:", error);
        // Fallback: save to offline queue
        try {
            const queueStr = await AsyncStorage.getItem(`@offline_logs_${userId}`);
            const queue = queueStr ? JSON.parse(queueStr) : [];
            queue.push({ symptoms, timestamp: new Date().toISOString() });
            await AsyncStorage.setItem(`@offline_logs_${userId}`, JSON.stringify(queue));
            return { message: "Saved offline. Will sync when connection is restored." };
        } catch (storageError) {
            console.error("Offline save failed too:", storageError);
            throw error;
        }
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
        const response = await apiClient.post('/register', userData);
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

export default apiClient;
