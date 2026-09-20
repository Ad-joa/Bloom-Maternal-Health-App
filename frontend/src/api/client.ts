import axios from 'axios';
import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

export const getBaseUrl = () => {
    if (process.env.EXPO_PUBLIC_API_URL) {
        return process.env.EXPO_PUBLIC_API_URL;
    }

    if (__DEV__) {
        const debuggerHost = Constants.expoConfig?.hostUri;
        if (debuggerHost) {
            const localhost = debuggerHost.split(':')[0];
            return `http://${localhost}:8000`;
        }
        if (Platform.OS === 'android') {
            return 'http://10.0.2.2:8000';
        }
        return 'http://127.0.0.1:8000';
    }
    return '';
};

const apiClient = axios.create({
    baseURL: getBaseUrl(),
    headers: {
        'Content-Type': 'application/json',
    },
});

apiClient.interceptors.request.use(
    async (config) => {
        try {
            const token = await AsyncStorage.getItem('@bloom_token');
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        } catch (error) {
            console.error("Error reading token from storage:", error);
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
