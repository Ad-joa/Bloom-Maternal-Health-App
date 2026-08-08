import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const initDatabase = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('bloom.db');
    
    // Create the local symptom logs table
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS symptom_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        symptoms TEXT NOT NULL,
        severity TEXT NOT NULL,
        notes TEXT,
        created_at TEXT NOT NULL,
        is_synced INTEGER DEFAULT 0
      );
    `);
  }
  return db;
};

export const saveSymptomLogLocal = async (userId: string, symptoms: string, severity: string, notes: string) => {
  const database = await initDatabase();
  const createdAt = new Date().toISOString();
  
  const result = await database.runAsync(
    'INSERT INTO symptom_logs (user_id, symptoms, severity, notes, created_at, is_synced) VALUES (?, ?, ?, ?, ?, 0)',
    [userId, symptoms, severity, notes, createdAt]
  );
  return result.lastInsertRowId;
};

export const getUnsyncedLogs = async () => {
  const database = await initDatabase();
  const logs = await database.getAllAsync<{
    id: number;
    user_id: string;
    symptoms: string;
    severity: string;
    notes: string | null;
    created_at: string;
    is_synced: number;
  }>('SELECT * FROM symptom_logs WHERE is_synced = 0');
  
  return logs;
};

export const markLogsAsSynced = async (ids: number[]) => {
  if (ids.length === 0) return;
  const database = await initDatabase();
  const placeholders = ids.map(() => '?').join(',');
  
  // We use type assertion to pass the array correctly, expo-sqlite expects an array of args
  await database.runAsync(`UPDATE symptom_logs SET is_synced = 1 WHERE id IN (${placeholders})`, ...ids);
};
