const DB_NAME = 'BankTechProDB';
const DB_VERSION = 1;
const TRANSACTIONS_STORE = 'transactions';
const PENDING_TRANSACTIONS_STORE = 'pending_transactions';

let db;

// This function opens the database connection and creates the tables if they don't exist.
export const initDB = () => {
  return new Promise((resolve, reject) => {
    // Prevent errors on server-side rendering environments
    if (typeof window === 'undefined' || !window.indexedDB) {
        console.warn("IndexedDB is not supported in this environment.");
        return resolve(null);
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // This event runs only when the database version changes,
    // which is how we create or update the schema.
    request.onupgradeneeded = (event) => {
      const dbInstance = event.target.result;
      if (!dbInstance.objectStoreNames.contains(TRANSACTIONS_STORE)) {
        dbInstance.createObjectStore(TRANSACTIONS_STORE, { keyPath: 'id' });
      }
      if (!dbInstance.objectStoreNames.contains(PENDING_TRANSACTIONS_STORE)) {
        // Use autoIncrementing key for the offline queue
        dbInstance.createObjectStore(PENDING_TRANSACTIONS_STORE, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      db = event.target.result;
      resolve(db);
    };

    request.onerror = (event) => {
      console.error('Database error:', event.target.errorCode);
      reject(event.target.errorCode);
    };
  });
};

// A helper function to wrap database operations in Promises for easier use with async/await.
const performDbOperation = (storeName, mode, operation) => {
  return new Promise((resolve, reject) => {
    if (!db) {
        // If db is not initialized, initialize it first and then retry the operation.
        initDB().then(() => performDbOperation(storeName, mode, operation).then(resolve).catch(reject)).catch(reject);
        return;
    }
    try {
        const transaction = db.transaction(storeName, mode);
        const store = transaction.objectStore(storeName);
        operation(store, resolve, reject);
    } catch (error) {
        reject(error);
    }
  });
};


// --- Public Functions to Interact with the Database ---

export const getLocalTransactions = () => {
    return performDbOperation(TRANSACTIONS_STORE, 'readonly', (store, resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const bulkAddTransactions = (transactions) => {
    return performDbOperation(TRANSACTIONS_STORE, 'readwrite', (store, resolve) => {
        transactions.forEach(tx => store.put(tx));
        resolve();
    });
};

export const clearTransactions = () => {
    return performDbOperation(TRANSACTIONS_STORE, 'readwrite', (store, resolve) => {
        store.clear();
        resolve();
    });
};

export const getPendingTransactions = () => {
    return performDbOperation(PENDING_TRANSACTIONS_STORE, 'readonly', (store, resolve) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = (e) => reject(e.target.error);
    });
};

export const addPendingTransaction = (tx) => {
    // We remove the 'id' field because the store is auto-incrementing
    const { id, ...payload } = tx;
    return performDbOperation(PENDING_TRANSACTIONS_STORE, 'readwrite', (store, resolve) => {
        const request = store.add(payload);
        request.onsuccess = () => resolve();
        request.onerror = (e) => reject(e.target.error);
    });
};

export const deletePendingTransaction = (id) => {
    return performDbOperation(PENDING_TRANSACTIONS_STORE, 'readwrite', (store, resolve) => {
        store.delete(id);
        resolve();
    });
};