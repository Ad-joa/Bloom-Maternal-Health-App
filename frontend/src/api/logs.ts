import apiClient from './client';

export const saveSymptomLog = async (userId: number, logData: any) => {
    try {
        const response = await apiClient.post(`/logs`, logData);
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
        const response = await apiClient.get(`/logs`);
        return response.data;
    } catch (error) {
        console.error("Error fetching logs:", error);
        throw error;
    }
};

export const syncSymptoms = async (logs: any[]) => {
    try {
        const response = await apiClient.post(`/sync/symptoms`, { logs });
        return response;
    } catch (error) {
        console.error("Error syncing symptoms:", error);
        throw error;
    }
};

export const createSymptomLog = async (userId: number, logData: any) => {
    try {
        const response = await apiClient.post(`/logs`, logData);
        return response.data;
    } catch (error) {
        console.error("Error creating log:", error);
        throw error;
    }
};
