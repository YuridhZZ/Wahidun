import { useState, useEffect, useCallback } from 'react';
// 👇 FIX: The import path is corrected to point to the new utility file
import { getPendingTransactions, deletePendingTransaction } from '../utils/indexedDB';

export const useOfflineSync = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  const syncPendingTransactions = useCallback(async () => {
    // Use the imported helper to get pending transactions
    const pending = await getPendingTransactions();
    if (pending.length === 0) return;

    console.log(`Syncing ${pending.length} pending transaction(s)...`);
    
    for (const tx of pending) {
      try {
        // The payload is the transaction object, minus its temporary local id
        const { id, ...payload } = tx;

        const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        
        if (response.ok) {
            // If synced successfully, delete it from the local queue
            await deletePendingTransaction(id);
            console.log(`Transaction ${id} synced successfully.`);
        } else {
            throw new Error(`Server responded with status: ${response.status}`);
        }

      } catch (error) {
        console.error(`Failed to sync transaction ${tx.id}:`, error);
      }
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      console.log('Network status: Online');
      setIsOnline(true);
      syncPendingTransactions();
    };

    const handleOffline = () => {
      console.log('Network status: Offline');
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      syncPendingTransactions();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [syncPendingTransactions]);

  return { isOnline };
};