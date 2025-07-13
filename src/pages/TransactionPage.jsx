import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router';
import { useTransactions } from '../contexts/TransactionContext';

/**
 * TransactionForm Component
 * A React functional component for managing and displaying transaction details.
 * It includes state for balance transfer, transfer time, and account number.
 */

function TransactionForm() {
  // State variables for transaction details
  const { user, logout } = useAuth();
  const [users, setUsers] = useState([]);
  const [balanceTransfer, setBalanceTransfer] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [transferTime, setTransferTime] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  // get data User
  useEffect(() => {
    fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user')
      .then(response => response.json())
      .then(data => { setUsers(data) })
      .catch(error => console.error('Error fetching user data:', error));
    }, []); // Empty dependency array to run only once on mount

  const handleBalanceTransferChange = (e) => {
    // Allow only numbers and a single decimal point
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBalanceTransfer(value);
      setTransferTime(new Date().toISOString())
    }
  };

  const handleAccountNumberChange = (e) => {
    // Allow only numbers for account number
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setAccountNumber(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const nominal = Number(balanceTransfer);

    if (nominal > Number(user.balance)) {
      setError('Insufficient balance for this transaction.');
      setIsLoading(false);
      return;
    }

    const destinationUser = users.find(u => String(u.accountNumber) === String(accountNumber));
    if (!destinationUser) {
      setError('Invalid account number.');
      setIsLoading(false);
      return;
    }

    
    const transactionPayload = {
        accountSourceId:user.id,
        accountSourceName: user.name,
        accountSourceNumber: user.accountNumber,
        accountDestinationId: destinationUser.id,
        accountDestinationNumber: destinationUser.accountNumber,
        accountDestinationName: destinationUser.name,
        category: 'transfer', // default
        nominal : nominal,
        transferTime : transferTime,
        createdAt: new Date().toISOString()
    };
    console.log(transactionPayload);

    try {
      const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionPayload),
      });

      if (!response.ok) throw new Error('Gagal menyimpan transaksi');

      // (Opsional) Update saldo user sumber di API
      const resSource = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${transactionPayload.accountSourceId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: user.name,
          email: user.email,
          accountNumber: user.accountNumber,
          accountType: user.accountType,
          password: user.password,
          balance: Number(user.balance) - nominal})
      });

      const updatedSource = await resSource.json();
      console.log('[UPDATED SOURCE USER]', updatedSource);

      // (Opsional) Tambahkan saldo ke user tujuan
      const restDest = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${transactionPayload.accountDestinationId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: destinationUser.name,
            email: destinationUser.email,
            password: destinationUser.password,
            accountNumber: destinationUser.accountNumber,
            accountType: destinationUser.accountType,
            balance: Number(destinationUser.balance) + Number(nominal)
          }),
      });

      const updatedDestination = await restDest.json();
      console.log('[UPDATED DESTINATION USER]', updatedDestination);


      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      setError('Terjadi error saat proses transaksi.');
    } finally {
      setIsLoading(false);
    }
};


  return (
    <div className="min-h-full">
      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold px-4 mb-6">Transaction Details</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Account Number Input */}
            <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text" // Using text to allow for numeric input validation
                  id="accountNumber"
                  value={accountNumber}
                  onChange={handleAccountNumberChange}
                  placeholder="e.g., 1234567890"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  aria-label="Account Number"
                  required
                />
            </div>
            {/* Balance Transfer Input */}
            <div>
                <label htmlFor="balanceTransfer" className="block text-sm font-medium text-gray-700 mb-1">
                  Balance Transfer ($)
                </label>
                <input
                  type="text" // Using text to allow for decimal input validation
                  id="balanceTransfer"
                  value={balanceTransfer}
                  onChange={handleBalanceTransferChange}
                  placeholder="e.g., 100.50"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  aria-label="Balance Transfer Amount"
                  required
                />
            </div>
            {/* Submit Button */}
            <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
              >
                Submit Transaction
            </button>
          </form>

          {/* Display Current State (for demonstration purposes) */}
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-200">
            <h3 className="text-lg font-medium text-gray-800 mb-2">Current Transaction State:</h3>
            <p className="text-sm text-gray-600">
              <strong>Account Number:</strong> {accountNumber || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Balance Transfer:</strong> Rp {balanceTransfer || 'N/A'}
            </p>
            <p className="text-sm text-gray-600">
              <strong>Transfer Time:</strong> {transferTime || 'N/A'}
            </p>
          </div> 
        </div>
      </main>

    </div>
  );
}

export default TransactionForm;