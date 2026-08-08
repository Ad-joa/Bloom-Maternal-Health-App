import NetInfo from '@react-native-community/netinfo';
import { getUnsyncedLogs, markLogsAsSynced } from './database';
import { api } from '../api/api';

export const startSyncEngine = () => {
  // Listen for network changes
  const unsubscribe = NetInfo.addEventListener(async (state) => {
    if (state.isConnected && state.isInternetReachable) {
      console.log('SyncEngine: Internet restored. Checking for unsynced logs...');
      await syncOfflineData();
    }
  });

  return unsubscribe; // Call this on unmount
};

const syncOfflineData = async () => {
  try {
    const unsyncedLogs = await getUnsyncedLogs();
    
    if (unsyncedLogs.length === 0) {
      console.log('SyncEngine: No unsynced logs found.');
      return;
    }

    console.log(`SyncEngine: Found ${unsyncedLogs.length} unsynced logs. Pushing to backend...`);
    
    // Push the batch to the backend
    const response = await api.post('/sync/symptoms', { logs: unsyncedLogs });
    
    if (response.data.success) {
      // Mark as synced locally
      const syncedIds = unsyncedLogs.map(log => log.id);
      await markLogsAsSynced(syncedIds);
      console.log('SyncEngine: Successfully synced and marked local logs.');
    }
  } catch (error) {
    console.error('SyncEngine Error: Failed to sync offline data:', error);
  }
};
