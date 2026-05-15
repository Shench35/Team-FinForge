const DB_NAME = 'FinForge_FileStorage';
const STORE_NAME = 'pending_verifications';

export interface StoredVerification {
  id: string;
  file: File;
  certType: string;
  timestamp: number;
}

const openDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
};

export const savePendingVerification = async (data: StoredVerification): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Save with its actual ID
    store.put(data);
    
    // Also save as "latest" for easy fallback
    const latestRequest = store.put({ ...data, id: 'latest_upload' });
    
    latestRequest.onsuccess = () => resolve();
    latestRequest.onerror = () => reject(latestRequest.error);
  });
};

export const getLatestVerification = async (): Promise<StoredVerification | null> => {
  return getPendingVerification('latest_upload');
};

export const getPendingVerification = async (id: string): Promise<StoredVerification | null> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(id);
    
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
};

export const clearPendingVerification = async (id: string): Promise<void> => {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(id);
    
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
};
