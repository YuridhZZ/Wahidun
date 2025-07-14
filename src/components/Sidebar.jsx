import { useLocation, Link } from 'react-router-dom';
import {
  HomeIcon, ClockIcon, UserIcon, ArrowRightIcon, Cog6ToothIcon,
  ListBulletIcon, TagIcon, PaperAirplaneIcon, ShieldCheckIcon, ChartPieIcon
} from '@heroicons/react/24/solid';
import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

const MenuItem = ({ item, isOpen, setOpenMenuItem }) => {
  const hasSubItems = item.subItems && item.subItems.length > 0;
  const location = useLocation();

  const handleClick = (e) => {
    if (hasSubItems) {
      e.preventDefault();
      setOpenMenuItem();
    }
  };

  return (
    <li className="menu-item">
      <Link
        to={item.path || '#'}
        className={`menu-link flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-100 ${location.pathname === item.path ? 'bg-gray-100' : ''}`}
        onClick={handleClick}
      >
        <item.icon className="w-6 h-6 text-gray-500" />
        <span className="ml-3">{item.name}</span>
        {hasSubItems && (
          <span className={`ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
          </span>
        )}
      </Link>
      {hasSubItems && (
        <ul className={`pl-4 overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? 'max-h-96' : 'max-h-0'}`}>
          {item.subItems.map((subItem) => (
            <li key={subItem.id}>
              <Link
                to={subItem.path || '#'}
                className={`flex items-center p-2 text-base font-medium rounded-lg hover:bg-gray-200 ${location.pathname === subItem.path ? 'bg-gray-200' : ''}`}
              >
                {subItem.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </li>
  );
};

const menuData = [
  // Explicitly define which links are for admins and which are for users
  { id: 'admin', path: '/admin-dashboard', name: 'Admin Dashboard', icon: ShieldCheckIcon, adminOnly: true },
  { id: 'dashboard', path: '/dashboard', name: 'Dashboard', icon: HomeIcon, adminOnly: false },
  { id: 'analytics', path: '/analytics', name: 'Analytics', icon: ChartPieIcon, adminOnly: false },
  {
    id: 'transac', name: 'Transactions', icon: ClockIcon, adminOnly: false,
    subItems: [
        { id: 'transfer', path: '/transfer-wizard', name: 'New Transfer' },
        { id: 'transacList', path: '/transactions/lists', name: 'Transaction History' },
    ],
  },
  { id: 'categorize', path: '/categorize', name: 'Categorize', icon: TagIcon, adminOnly: false },
  { id: 'activity', path: '/activity-log', name: 'Activity Log', icon: ListBulletIcon, adminOnly: false },
  { id: 'profile', path: '/profile', name: 'Profile', icon: UserIcon, adminOnly: false },
  { id: 'edit-profile', path: '/edit-profile', name: 'Edit Profile', icon: Cog6ToothIcon, adminOnly: false },
];

export default function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation();
  const { isAdmin } = useAuth();
  const [openSubMenuName, setOpenSubMenuName] = useState(null);

  useEffect(() => {
    const currentPath = location.pathname;
    const parentMenu = menuData.find(item => item.subItems?.some(sub => sub.path === currentPath));
    if (parentMenu) {
      setOpenSubMenuName(parentMenu.id);
    }
  }, [location.pathname]);

  // Filter the menu items based on the user's role
  const visibleMenuData = menuData.filter(link => {
      if (isAdmin) {
          // If user is admin, only show links where adminOnly is true
          return link.adminOnly === true;
      } else {
          // If user is not admin, only show links where adminOnly is false
          return link.adminOnly === false;
      }
  });

  return (
    <aside
      className={`fixed top-0 left-0 z-40 w-64 h-screen pt-14 transition-transform ${isOpen ? '' : '-translate-x-full'
        } bg-white border-r border-gray-200 sm:translate-x-0`}
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto py-5 px-3 h-full bg-white">
        <ul className="space-y-2">
          {visibleMenuData.map((link) => (
            <MenuItem
              key={link.id}
              item={link}
              isOpen={openSubMenuName === link.id}
              setOpenMenuItem={() => setOpenSubMenuName(link.id === openSubMenuName ? null : link.id)}
            />
          ))}
        </ul>
      </div>
    </aside>
  );
}