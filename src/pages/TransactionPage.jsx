import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Navigate, Link } from 'react-router';

/**
 * TransactionForm Component
 * A React functional component for managing and displaying transaction details.
 * It includes state for balance transfer, transfer time, and account number.
 */
function TransactionForm() {
  // State variables for transaction details
  const { user, logout } = useAuth();
  const [balanceTransfer, setBalanceTransfer] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();


  const handleBalanceTransferChange = (e) => {
    // Allow only numbers and a single decimal point
    const value = e.target.value;
    if (/^\d*\.?\d*$/.test(value)) {
      setBalanceTransfer(value);
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

    const userData = {
        accountSourceName: user.name,
        accountDestinationNumber: accountNumber,
        transferNominal : balanceTransfer,
        transferTime : new Date().toISOString(),
        createdAt: new Date().toISOString()
    };

    const response = await fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    navigate('/dashboard'); 
    return { success: true, message: 'Transaction details submitted!'};

    // You would typically send this data to an API or update global state here
    // alert('Transaction details submitted! Check console for values.'); // Using alert for demonstration, replace with a custom modal in production
  };

  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white font-bold">Transaction</h1>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <Link to='/transaction'
                    className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                    back to transaction
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto my-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-auto rounded-lg border-4 border-dashed border-gray-200 p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-800 text-center">Transaction Details</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
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

                    {/* Submit Button */}
                    <button
                    type="submit"
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ease-in-out"
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
                    <strong>Balance Transfer:</strong> {balanceTransfer || 'N/A'}
                    </p>
                    {/* <p className="text-sm text-gray-600">
                    <strong>Transfer Time:</strong> {transferTime || 'N/A'}
                    </p> */}
                    
                </div>
            </div>
          </div>
        </div>
      </main>

    </div>
  );
}

export default TransactionForm