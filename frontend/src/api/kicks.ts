import apiClient from './client';

export const saveKickSession = async (kickCount: number, durationSec: number) => {
  try {
    const response = await apiClient.post('/kicks', {
      kick_count: kickCount,
      duration_sec: durationSec,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving kick session:', error);
    throw error;
  }
};

export const getKickHistory = async () => {
  try {
    const response = await apiClient.get('/kicks');
    return response.data;
  } catch (error) {
    console.error('Error fetching kick history:', error);
    throw error;
  }
};
