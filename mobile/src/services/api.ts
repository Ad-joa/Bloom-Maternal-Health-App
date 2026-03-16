import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = 'https://your-backend-render-url.com/api/v1';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token
apiClient.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync('userToken', token);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync('userToken');
};
