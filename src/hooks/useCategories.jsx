import { useEffect, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext'; // Import transactions context

export const useCategories = () => {
  const { user } = useAuth();
  const { transactions } = useTransactions(); // Get the master list of transactions
  const [categories, setCategories] = useLocalStorage(`categories_${user?.id}`, [
    { id: 'cat-1', name: 'Food & Dining', transactions: [] },
    { id: 'cat-2', name: 'Shopping', transactions: [] },
    { id: 'cat-3', name: 'Utilities', transactions: [] },
    { id: 'cat-4', name: 'Uncategorized', transactions: [] },
  ]);

  // This effect will re-sync the categories whenever the master transaction list changes
  useEffect(() => {
    setCategories(prevCategories => {
      const transactionMap = new Map(transactions.map(t => [t.id, t]));
      return prevCategories.map(category => ({
        ...category,
        transactions: category.transactions
          .map(t => transactionMap.get(t.id)) // Get the latest transaction data
          .filter(Boolean), // Filter out any transactions that no longer exist
      }));
    });
  }, [transactions, setCategories]);

  const addCategory = (name) => {
    if (!name?.trim()) return;
    const newCategory = {
      id: `cat-${Date.now()}`,
      name: name.trim(),
      transactions: [],
    };
    setCategories(prev => [...prev, newCategory]);
  };

  const assignTransactionToCategory = useCallback((categoryId, transaction) => {
    setCategories(prev => {
      const newCategories = JSON.parse(JSON.stringify(prev));
      newCategories.forEach(cat => {
        cat.transactions = cat.transactions.filter(t => t.id !== transaction.id);
      });
      const targetCategory = newCategories.find(cat => cat.id === categoryId);
      if (targetCategory && !targetCategory.transactions.some(t => t.id === transaction.id)) {
        targetCategory.transactions.push(transaction);
      }
      return newCategories;
    });
  }, [setCategories]);
  
  const uncategorizeTransaction = useCallback((transactionId) => {
    setCategories(prev => {
      return prev.map(category => ({
        ...category,
        transactions: category.transactions.filter(t => t.id !== transactionId),
      }));
    });
  }, [setCategories]);

  const deleteCategory = useCallback((categoryIdToDelete) => {
    setCategories(prev => {
        const categoryToDelete = prev.find(c => c.id === categoryIdToDelete);
        const uncategorizedCategory = prev.find(c => c.name === 'Uncategorized');

        if (!categoryToDelete || categoryToDelete.name === 'Uncategorized') {
            alert("This category cannot be deleted.");
            return prev;
        }
        if (!uncategorizedCategory) {
            alert("An 'Uncategorized' category must exist to delete others.");
            return prev;
        }

        const transactionsToMove = categoryToDelete.transactions;

        const newCategories = prev
            .map(c => {
                if (c.id === uncategorizedCategory.id) {
                    return { ...c, transactions: [...c.transactions, ...transactionsToMove] };
                }
                return c;
            })
            .filter(c => c.id !== categoryIdToDelete);

        return newCategories;
    });
  }, [setCategories]);

  return { categories, addCategory, assignTransactionToCategory, uncategorizeTransaction, deleteCategory };
};
