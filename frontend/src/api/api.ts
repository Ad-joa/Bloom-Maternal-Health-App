import axios from 'axios';
import { Platform } from 'react-native';

// We rely on Expo's environment variables to prevent hardcoding server URLs in the codebase.
// Define EXPO_PUBLIC_API_URL in a frontend/.env file.
const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }
    
    // Fallback for local development if .env is missing
    if (__DEV__) {
        // Typically 10.0.2.2 for Android emulator, or your local machine's IP (e.g., 172.20.10.3)
        return 'http://127.0.0.1:8000';
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

export const getAdvisory = async (symptoms: string[]) => {
    try {
        const response = await apiClient.post('/advisory', { symptoms });
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
        console.error("Error saving log:", error);
        throw error;
    }
};

export default apiClient;
