export const DB_NAME = 'CoupleBucketListDB';
export const STORE_NAME = 'bucketListItems';
export const VOUCHER_STORE = 'vouchers';

export const initDB = (): Promise<IDBDatabase> => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'id' });
            }
            if (!db.objectStoreNames.contains(VOUCHER_STORE)) {
                db.createObjectStore(VOUCHER_STORE, { keyPath: 'id' });
            }
        };

        request.onsuccess = (event) => {
            resolve((event.target as IDBOpenDBRequest).result);
        };

        request.onerror = (event) => {
            reject('IndexedDB error: ' + (event.target as IDBOpenDBRequest).error);
        };
    });
};

export const saveItems = async (items: any[]) => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    // Clear and rewrite (simplest for this app)
    store.clear();
    items.forEach(item => store.put(item));

    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

export const getItems = async (): Promise<any[]> => {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};

export const saveVouchers = async (vouchers: any[]) => {
    const db = await initDB();
    const tx = db.transaction(VOUCHER_STORE, 'readwrite');
    const store = tx.objectStore(VOUCHER_STORE);

    store.clear();
    vouchers.forEach(v => store.put(v));

    return new Promise<void>((resolve, reject) => {
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
    });
};

export const getVouchers = async (): Promise<any[]> => {
    const db = await initDB();
    const tx = db.transaction(VOUCHER_STORE, 'readonly');
    const store = tx.objectStore(VOUCHER_STORE);
    const request = store.getAll();

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
};
