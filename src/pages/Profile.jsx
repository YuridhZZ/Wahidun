import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';
import {
    CreditCardIcon,
    CalendarIcon,
    EnvelopeIcon,
    BanknotesIcon,
    ArrowTrendingUpIcon,
    ArrowTrendingDownIcon
} from '@heroicons/react/24/outline';

export default function Profile() {
    const { user } = useAuth();
    const { transactions } = useTransactions();

    // 👇 CORRECTED LOGIC: Count transactions based on the user's role
    const incomeTransactionsCount = transactions.filter(
        (tx) => String(tx.accountDestinationId) === String(user.id)
    ).length;

    const expenseTransactionsCount = transactions.filter(
        (tx) => String(tx.accountSourceId) === String(user.id)
    ).length;

    // The pie chart data now uses the correct counts
    const pieData = [
        { name: 'Income', value: incomeTransactionsCount, color: '#10B981' },
        { name: 'Expenses', value: expenseTransactionsCount, color: '#EF4444' }
    ];

    return (
        <div className="min-h-full">
            <main>
                <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                    <h2 className="text-2xl font-bold px-4 mb-6">My Profile</h2>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4">
                        {/* Account Information */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold mb-4">Account Information</h3>
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                        <p className="flex text-sm font-medium text-gray-500">Account Number</p>
                                        <p className="text-lg font-semibold">{user?.accountNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <BanknotesIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Account Type</p>
                                        <p className="flex text-lg font-semibold">{user?.accountType}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Member Since</p>
                                        <p className="text-lg font-semibold">
                                            {new Date(user?.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                        <p className="flex text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg font-semibold">{user?.email}</p>
                                    </div>
                                </div>
                                <div className="flex items-center">
                                    <EnvelopeIcon className="h-5 w-5 text-gray-500 mr-2" />
                                    <div>
                                        <p className="text-sm font-medium text-gray-500">Email</p>
                                        <p className="text-lg font-semibold">{user?.role}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Transaction Statistics */}
                        <div className="bg-white rounded-lg shadow p-6">
                            <h3 className="text-lg font-bold mb-4">Transaction Statistics</h3>
                            <div className="h-64 mb-4">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={pieData.filter(d => d.value > 0)}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={80}
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="bg-green-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <ArrowTrendingUpIcon className="h-5 w-5 text-green-500 mr-2" />
                                        <p className="text-sm font-medium text-gray-500">Total Income Transactions</p>
                                    </div>
                                    <p className="text-2xl font-bold text-green-600 mt-2">
                                        {incomeTransactionsCount}
                                    </p>
                                </div>

                                <div className="bg-red-50 p-4 rounded-lg">
                                    <div className="flex items-center">
                                        <ArrowTrendingDownIcon className="h-5 w-5 text-red-500 mr-2" />
                                        <p className="text-sm font-medium text-gray-500">Total Expense Transactions</p>
                                    </div>
                                    <p className="text-2xl font-bold text-red-600 mt-2">
                                        {expenseTransactionsCount}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}