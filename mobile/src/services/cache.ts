import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('bloom_cache.db');

export const initDB = () => {
  db.transaction(tx => {
    tx.executeSql(
      'CREATE TABLE IF NOT EXISTS health_content (id INTEGER PRIMARY KEY NOT NULL, trimester INTEGER, title TEXT, body TEXT, image_url TEXT);'
    );
  });
};

export const cacheContent = (content: any[]) => {
  db.transaction(tx => {
    content.forEach(item => {
      tx.executeSql(
        'INSERT OR REPLACE INTO health_content (id, trimester, title, body, image_url) VALUES (?, ?, ?, ?, ?);',
        [item.id, item.trimester, item.title, item.body, item.image_url]
      );
    });
  });
};

export const getCachedContent = (trimester: number): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction((tx: any) => {
      tx.executeSql(
        'SELECT * FROM health_content WHERE trimester = ?;',
        [trimester],
        (_: any, { rows: { _array } }: { rows: { _array: any[] } }) => resolve(_array),
        (_: any, error: any) => {
          reject(error);
          return false;
        }
      );
    });
  });
};
