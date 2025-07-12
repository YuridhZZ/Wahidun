import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed left-0 right-0 top-0 z-50">
            <div className="flex flex-wrap justify-between items-center">
                <div className="flex justify-start items-center">
                    <Link to="/dashboard" className="flex items-center justify-between mr-4">
                        <span className="self-center text-xl font-semibold whitespace-nowrap">FlowBank</span>
                    </Link>
                </div>

                <div className="flex items-center lg:order-2">
                    <div className="flex items-center space-x-3">
                        <div>
                            <span className="text-sm font-medium text-gray-900">{user?.name}</span>
                            <span className="block text-sm text-gray-500">{user?.accountType} Account</span>
                        </div>
                        <button
                            onClick={logout}
                            className="text-gray-800 hover:bg-gray-50 focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-4 py-2"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
}