import { useAuth } from '../contexts/AuthContext';
import { useTransactions } from '../contexts/TransactionContext';
import CountUp from 'react-countup';
import {
  ArrowUpIcon,
  ArrowDownIcon,
  CreditCardIcon,
  CalendarIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from 'recharts';

function DashboardPage() {
  const { user } = useAuth();
  const { transactions, loading } = useTransactions();

  // Calculate income and expenses
  const income = transactions
    .filter(tx => tx.category === 'in')
    .reduce((sum, tx) => sum + parseFloat(tx.nominal), 0);

  const expenses = transactions
    .filter(tx => tx.category === 'out')
    .reduce((sum, tx) => sum + parseFloat(tx.nominal), 0);

  // Get recent transactions
  const recentTransactions = transactions.slice(0, 5);

  // Chart data
  const chartData = [
    { name: 'Income', value: income },
    { name: 'Expenses', value: expenses },
  ];

  const COLORS = ['#10B981', '#EF4444'];

  return (

    <main>
      <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        <h2 className="flex text-2xl font-bold px-4 mb-6">Welcome, {user?.name || 'User'}!</h2>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-500">Account Balance</h3>
            <p className="mt-2 text-2xl font-semibold">
              <CountUp
                end={user?.balance || 0}
                prefix="Rp. "
                separator=","
                decimals={2}
                duration={1}
              />
            </p>
            <p className="text-sm text-gray-500 mt-2">{user?.accountType} Account</p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ArrowUpIcon className="h-6 w-6 text-green-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-500">Total Income</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-green-500">
              <CountUp
                end={income}
                prefix="Rp. "
                separator=","
                decimals={2}
                duration={1}
              />
            </p>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ArrowDownIcon className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-medium text-gray-500">Total Expenses</h3>
            </div>
            <p className="mt-2 text-3xl font-semibold text-red-500">
              <CountUp
                end={expenses}
                prefix="Rp. "
                separator=","
                decimals={2}
                duration={1}
              />
            </p>
          </div>
        </div>

        {/* Charts and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 px-4 mb-6">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Income vs Expenses</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Recent Transactions</h3>
            {loading ? (
              <div className="mt-4 flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((tx) => (
                    <div key={tx.id} className="flex justify-between items-center p-3 border-b">
                      <div>
                        <p className="font-medium">
                          {tx.accountDestinationNumber ?
                            `Transfer to ${tx.accountDestinationNumber}` :
                            'Transaction'}
                        </p>
                        <p className="flex text-sm text-gray-500">
                          {new Date(tx.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <p className={`font-semibold ${tx.category === 'in' ? 'text-green-500' : 'text-red-500'}`}>
                        {tx.category === 'in' ? '+' : '-'}Rp. {parseFloat(tx.nominal).toLocaleString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No recent transactions</p>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Account Information */}
        <div className="px-4">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-bold mb-4">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Number</p>
                  <p className="text-lg font-semibold">{user?.accountNumber}</p>
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
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-lg font-semibold">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CreditCardIcon className="h-5 w-5 text-gray-500 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-500">Account Type</p>
                  <p className="text-lg font-semibold">{user?.accountType}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default DashboardPage;