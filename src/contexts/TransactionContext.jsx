import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { getLocalTransactions, bulkAddTransactions, clearTransactions } from '../utils/indexedDB';

const TransactionContext = createContext();

export function useTransactions() {
  return useContext(TransactionContext);
}

export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const refreshTransactions = useCallback(async () => {
    if (!user?.id) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    
    try {
      // 1. Optimistic UI: Load from local DB first
      const localTxs = await getLocalTransactions();
      const userLocalTxs = localTxs.filter(tx => 
        String(tx.accountSourceId) === String(user.id) || 
        String(tx.accountDestinationId) === String(user.id)
      );
      if (userLocalTxs.length > 0) {
        setTransactions(userLocalTxs.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      }

      // 2. Fetch from network
      const response = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction`);
      if (!response.ok) throw new Error("Network fetch failed, using local data.");
      
      const allTransactions = await response.json();
      const userTransactions = allTransactions.filter(tx =>
        String(tx.accountSourceId) === String(user.id) || 
        String(tx.accountDestinationId) === String(user.id)
      );

      // 3. Update local DB and state
      await clearTransactions();
      await bulkAddTransactions(userTransactions);
      setTransactions(userTransactions.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    } catch (error) {
      console.error(error.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);

  const value = {
    transactions,
    loading,
    refreshTransactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}