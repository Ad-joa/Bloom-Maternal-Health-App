import apiClient from './client';

export const saveContraction = async (
  startTime: Date,
  endTime: Date,
  durationSec: number,
  frequencySec?: number
) => {
  try {
    const response = await apiClient.post('/contractions', {
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString(),
      duration_sec: durationSec,
      frequency_sec: frequencySec ?? null,
    });
    return response.data;
  } catch (error) {
    console.error('Error saving contraction:', error);
    throw error;
  }
};

export const getContractionHistory = async () => {
  try {
    const response = await apiClient.get('/contractions');
    return response.data;
  } catch (error) {
    console.error('Error fetching contraction history:', error);
    throw error;
  }
};
