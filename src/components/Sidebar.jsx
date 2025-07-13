import { useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ListBulletIcon // Import the new icon
} from '@heroicons/react/24/solid';
import MenuItem from './MenuItems';
import { useState } from 'react';

const menuData = [
  { id: 'dashboard', path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
  {
    id: 'transac', name: 'Transactions', icon: ClockIcon,
    subItems: [
      { id: 'transacNew', path: '/transactions/new', name: 'New Transaction' },
      { id: 'transacList', path: '/transactions/lists', name: 'Transaction History' },
    ],
  },
  { id: 'activity', path: '/activity-log', name: 'Activity Log', icon: ListBulletIcon }, // Add new menu item
  { id: 'profile', path: '/profile', name: 'Profile', icon: UserIcon }
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [openSubMenuName, setOpenSubMenuName] = useState(null);

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${isOpen ? '' : '-translate-x-full'
        } bg-white border-r border-gray-200 sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white">
        <ul className="space-y-2">
          {menuData.map((link) => (
            <MenuItem
              key={link.id}
              item={link}
              isOpen={openSubMenuName === link.id}
              setOpenMenuItem={() => setOpenSubMenuName(link.id)}
              closeCurrentSubMenu={() => setOpenSubMenuName(null)}
            />
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