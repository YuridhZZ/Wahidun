import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext'; // Import useAuth to get the current user

const TransactionContext = createContext();

export function useTransactions() {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
}

// The userId prop is no longer needed
export function TransactionProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth(); // Get the user from the AuthContext

  // Renamed to refreshTransactions for clarity
  const refreshTransactions = useCallback(async () => {
    // If there's no logged-in user, there are no transactions to fetch.
    if (!user?.id) {
      setTransactions([]);
      setLoading(false);
      return;
    }
    
    setLoading(true);
    setError(null);
    try {
      // Fetch all transactions from the API
      const response = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction`);
      if (!response.ok) {
        throw new Error("Failed to fetch transactions");
      }
      const allTransactions = await response.json();

      // Correctly filter transactions related to the current user
      const userTransactions = allTransactions.filter(tx =>
        String(tx.accountSourceId) === String(user.id) || 
        String(tx.accountDestinationId) === String(user.id)
      ).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by most recent

      setTransactions(userTransactions);

    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError('Failed to fetch transactions');
      setTransactions([]); // Clear transactions on error
    } finally {
      setLoading(false);
    }
  }, [user]); // This function now depends on the user object

  // This useEffect will run whenever the user logs in or out
  useEffect(() => {
    refreshTransactions();
  }, [refreshTransactions]);


  // The value provided to the rest of the app
  const value = {
    transactions,
    loading,
    error,
    refreshTransactions, // Provide the refresh function
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}