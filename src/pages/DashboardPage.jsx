import { useAuth } from '../contexts/AuthContext';

function DashboardPage() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-full">
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-white font-bold">Dashboard</h1>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                onClick={logout}
                className="rounded-md bg-gray-700 px-3 py-2 text-sm font-medium text-white hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="h-96 rounded-lg border-4 border-dashed border-gray-200 p-8">
              <h2 className="text-2xl font-bold mb-4">Welcome, {user?.name || 'User'}!</h2>
              <p className="text-gray-600">You have successfully logged in.</p>
              <div className="mt-6">
                <p className="text-gray-500">Email: {user?.email}</p>
                <p className="text-gray-500">{user.accountType}</p>
                <p className="text-gray-500">No: {user.accountNumber}</p>
                <p className="text-gray-500">{user.balance}</p>
                <Link to='/transaction'
                    className="text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mx-2">
                    Transaction List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default DashboardPage;