import { useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { useAuth } from '../contexts/AuthContext';

export const useCategories = () => {
  const { user } = useAuth();
  const [categories, setCategories] = useLocalStorage(`categories_${user?.id}`, [
    { id: 'cat-1', name: 'Food & Dining', transactions: [] },
    { id: 'cat-2', name: 'Shopping', transactions: [] },
    { id: 'cat-3', name: 'Utilities', transactions: [] },
  ]);

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

  // 👇 1. Add this new function to remove a transaction from a category
  const uncategorizeTransaction = useCallback((transactionId) => {
    setCategories(prev => {
      return prev.map(category => ({
        ...category,
        transactions: category.transactions.filter(t => t.id !== transactionId),
      }));
    });
  }, [setCategories]);

  // 2. Export the new function
  return { categories, addCategory, assignTransactionToCategory, uncategorizeTransaction };
};