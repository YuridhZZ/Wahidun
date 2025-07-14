import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import OfflineIndicator from './OfflineIndicator'; // Import the new component

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div className="min-h-screen">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
      <div className="pl-64 pt-14">
        <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <div className="px-6 pb-8">
          {children}
        </div>
        <Footer />
      </div>
      <OfflineIndicator /> {/* Add the indicator here */}
    </div>
  );
}
