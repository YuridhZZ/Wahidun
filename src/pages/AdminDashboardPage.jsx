import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { ArrowPathIcon, TrashIcon, UserCircleIcon, BanknotesIcon } from '@heroicons/react/24/outline';

// A reusable card for displaying key statistics
const StatCard = ({ title, value, icon: Icon }) => (
  <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
    <div className="bg-indigo-500 rounded-full p-3">
      <Icon className="h-6 w-6 text-white" />
    </div>
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
    </div>
  </div>
);

function AdminDashboardPage() {
  // State is now managed directly in this component
  const [users, setUsers] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { user: adminUser } = useAuth();

  // Function to fetch all data from the APIs
  const fetchAllData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [usersResponse, transactionsResponse] = await Promise.all([
        fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user'),
        fetch('https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/transaction')
      ]);

      if (!usersResponse.ok || !transactionsResponse.ok) {
        throw new Error('Failed to fetch all required data.');
      }

      const usersData = await usersResponse.json();
      const transactionsData = await transactionsResponse.json();

      setUsers(usersData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setTransactions(transactionsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch data when the component first mounts
  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  const handleDeleteUser = async (userIdToDelete) => {
    if (window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
        if (String(userIdToDelete) === String(adminUser.id)) {
            alert("For safety, you cannot delete your own admin account.");
            return;
        }

        try {
            const response = await fetch(`https://6870d44c7ca4d06b34b83a49.mockapi.io/api/core/user/${userIdToDelete}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete user.');
            }

            // Update the UI immediately by filtering out the deleted user
            setUsers(currentUsers => currentUsers.filter(user => user.id !== userIdToDelete));
            alert("User deleted successfully.");

        } catch (err) {
            alert(`Error: ${err.message}`);
        }
    }
  };

  const totalBalanceInSystem = users.reduce((sum, user) => sum + parseFloat(user.balance || 0), 0);

  return (
    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center px-4 mb-6">
            <h2 className="text-2xl font-bold">Admin Dashboard</h2>
            <button
                onClick={fetchAllData}
                disabled={loading}
                className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 disabled:bg-indigo-300"
            >
                <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                <span>Refresh Data</span>
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-6">
            <StatCard title="Total Users" value={users.length} icon={UserCircleIcon} />
            <StatCard title="Total Transactions" value={transactions.length} icon={BanknotesIcon} />
            <StatCard title="Total System Balance" value={`Rp. ${totalBalanceInSystem.toLocaleString()}`} icon={BanknotesIcon} />
        </div>

        {error && <p className="text-red-500 px-4 mb-4">{error}</p>}

        <div className="px-4 mb-8">
            <h3 className="text-lg font-bold mb-4">All Users</h3>
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Account Number</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Balance</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="4" className="text-center py-4">Loading users...</td></tr>
                            ) : (
                                users.map(user => (
                                    <tr key={user.id}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.accountNumber}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">Rp. {parseFloat(user.balance || 0).toLocaleString()}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <button onClick={() => handleDeleteUser(user.id)} className="text-red-600 hover:text-red-900" title="Delete User">
                                                <TrashIcon className="h-5 w-5" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </div>
    </main>
  );
}

export default AdminDashboardPage;