import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { useActivityLog } from '../hooks/useActivityLog';
import { useNavigate } from 'react-router-dom';

function TransactionForm() {
  const { user, refreshUserData } = useAuth();
  const { refreshTransactions } = useTransactions();
  const { logActivity } = useActivityLog();
  const [users, setUsers] = useState([]);
  const [balanceTransfer, setBalanceTransfer] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transferTime, setTransferTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user')
      .then(response => response.json())
      .then(data => { setUsers(data) })
      .catch(error => console.error('Error fetching user data:', error));
  }, []);

  const handleBalanceTransferChange = (e) => {
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBalanceTransfer(value);
      setTransferTime(new Date().toISOString());
    }
  };

  const handleAccountNumberChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAccountNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!user) {
      setError('You must be logged in to perform this action.');
      setIsLoading(false);
      return;
    }

    const nominal = Number(balanceTransfer);
    if (isNaN(nominal) || nominal <= 0) {
      setError('Please enter a valid transfer amount.');
      setIsLoading(false);
      return;
    }

    if (nominal > Number(user.balance)) {
      setError('Insufficient balance for this transaction.');
      setIsLoading(false);
      return;
    }

    const destinationUser = users.find(u => String(u.accountNumber) === String(accountNumber));
    if (!destinationUser) {
      setError('Invalid destination account number.');
      setIsLoading(false);
      return;
    }
    
    if (destinationUser.id === user.id) {
        setError('You cannot transfer money to your own account.');
        setIsLoading(false);
        return;
    }

    const transactionPayload = {
      accountSourceId: user.id,
      accountSourceName: user.name,
      accountSourceNumber: user.accountNumber,
      accountDestinationId: destinationUser.id,
      accountDestinationNumber: destinationUser.accountNumber,
      accountDestinationName: destinationUser.name,
      category: 'transfer',
      nominal: nominal,
      transferTime: transferTime,
      createdAt: new Date().toISOString()
    };

    try {
      await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });

      await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: Number(user.balance) - nominal }),
      });

      await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${destinationUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ balance: Number(destinationUser.balance) + nominal }),
      });
      
      logActivity(`Transferred Rp. ${nominal.toLocaleString()} to account ${destinationUser.accountNumber}`);

      await Promise.all([refreshUserData(), refreshTransactions()]);

      navigate('/dashboard');

    } catch (err) {
      console.error(err);
      setError('An error occurred during the transaction. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-full">
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold px-4 mb-6">New Transaction</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                value={accountNumber}
                onChange={handleAccountNumberChange}
                placeholder="e.g., 1234567890"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            <div>
              <label htmlFor="balanceTransfer" className="block text-sm font-medium text-gray-700 mb-1">
                Amount to Transfer (Rp)
              </label>
              <input
                type="text"
                id="balanceTransfer"
                value={balanceTransfer}
                onChange={handleBalanceTransferChange}
                placeholder="e.g., 100000"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400"
            >
              {isLoading ? 'Processing...' : 'Submit Transaction'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default TransactionForm;