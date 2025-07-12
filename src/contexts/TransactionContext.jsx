import { createContext, useContext, useState, useEffect } from 'react';

const TransactionContext = createContext();

export function TransactionProvider({ children, userId }) {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction');
            const data = await response.json();
            const userTransactions = data.filter(tx => tx.idUser == userId);
            setTransactions(userTransactions);
        } catch (err) {
            setError('Failed to fetch transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const makeTransaction = async (transactionData) => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...transactionData,
                    idUser: userId,
                    createdAt: new Date().toISOString()
                }),
            });

            if (!response.ok) throw new Error('Transaction failed');

            const newTransaction = await response.json();
            setTransactions(prev => [newTransaction, ...prev]);
            return { success: true, transaction: newTransaction };
        } catch (err) {
            setError(err.message);
            return { success: false, message: err.message };
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchTransactions();
        }
    }, [userId]);

    return (
        <TransactionContext.Provider value={{
            transactions,
            loading,
            error,
            fetchTransactions,
            // makeTransaction
        }}>
            {children}
        </TransactionContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionContext);
    if (!context) {
        throw new Error('useTransactions must be used within a TransactionProvider');
    }
    return context;
}