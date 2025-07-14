import { useLocation } from 'react-router-dom';
import {
  HomeIcon,
  ClockIcon,
  UserIcon,
  ArrowRightIcon,
  ArrowLeftIcon,
  ListBulletIcon,
  TagIcon,
  PaperAirplaneIcon // New Icon
} from '@heroicons/react/24/solid';
import MenuItem from './MenuItems';
import { useEffect, useState } from 'react';

const menuData = [
  { id: 'dashboard', path: '/dashboard', name: 'Dashboard', icon: HomeIcon },
  // New top-level link for the wizard
  { id: 'transfer', path: '/transfer-wizard', name: 'New Transfer', icon: PaperAirplaneIcon },
  {
    id: 'transac', name: 'Transactions', icon: ClockIcon,
    subItems: [
      { id: 'transacNew', path: '/transactions/new', name: 'New Transaction' },
      { id: 'transacList', path: '/transactions/lists', name: 'Transaction History' },
    ],
  },
  { id: 'categorize', path: '/categorize', name: 'Categorize', icon: TagIcon },
  { id: 'activity', path: '/activity-log', name: 'Activity Log', icon: ListBulletIcon },
  { id: 'profile', path: '/profile', name: 'Profile', icon: UserIcon }
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const [openSubMenuName, setOpenSubMenuName] = useState(null);

  // Logic to automatically open the 'Transactions' accordion if on a sub-route
  useEffect(() => {
    const currentPath = location.pathname;
    const parentMenu = menuData.find(item => item.subItems?.some(sub => sub.path === currentPath));
    if (parentMenu) {
      setOpenSubMenuName(parentMenu.id);
    }
  }, [location.pathname]);

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
              setOpenMenuItem={() => setOpenSubMenuName(link.id === openSubMenuName ? null : link.id)}
              closeCurrentSubMenu={() => setOpenSubMenuName(null)}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}

