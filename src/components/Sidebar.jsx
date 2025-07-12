import { Link, useLocation } from 'react-router-dom';
import {
    HomeIcon,
    ClockIcon,
    UserIcon,
    ArrowRightIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/solid';

export default function Sidebar({ isOpen, toggleSidebar }) {
    const location = useLocation();
    const links = [
        { path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
        { path: '/transactions', name: 'Transactions', icon: ClockIcon },
        { path: '/profile', name: 'Profile', icon: UserIcon }
    ];

    return (
        <aside
            className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${isOpen ? '' : '-translate-x-full'
                } bg-white border-r border-gray-200 sm:translate-x-0`}
            aria-label="Sidebar"
        >
            <div className="overflow-y-auto py-5 px-3 h-full bg-white">
                <ul className="space-y-2">
                    {links.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-100 ${location.pathname === link.path ? 'bg-gray-100' : ''}`}
                            >
                                <link.icon className="w-6 h-6 text-gray-500" />
                                <span className="ml-3">{link.name}</span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
            <button
                onClick={toggleSidebar}
                className="sm:hidden absolute top-4 right-0 inline-flex items-center p-2 text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
            >
                {isOpen ? (
                    <ArrowLeftIcon className="w-6 h-6" />
                ) : (
                    <ArrowRightIcon className="w-6 h-6" />
                )}
            </button>
        </aside>
    );
}