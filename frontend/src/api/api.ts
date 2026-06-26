import axios from 'axios';
import { Platform } from 'react-native';

// For Android emulator, localhost is 10.0.2.2. For iOS emulator, it's 127.0.0.1 or localhost.
const getBaseUrl = () => {
    if (__DEV__) {
        return Platform.OS === 'android' ? 'http://10.0.2.2:8000' : 'http://127.0.0.1:8000';
    }
    // Production URL here
    return 'https://api.yourdomain.com';
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

export default apiClient;
