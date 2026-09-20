import apiClient from './client';

export const saveBreathingSession = async (durationSec: number) => {
  try {
    const response = await apiClient.post('/breathing', {
      duration_sec: durationSec,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving breathing session:', error);
    throw error;
  }
};

export const getBreathingHistory = async () => {
  try {
    const response = await apiClient.get('/breathing');
    return response.data;
  } catch (error) {
    console.error('Error fetching breathing history:', error);
    throw error;
  }
};
