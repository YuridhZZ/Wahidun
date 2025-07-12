import { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';

export default function Layout({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="min-h-screen">
            <Sidebar isOpen={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

            {/* Page Content (with padding-left = sidebar width, padding-top = navbar height) */}
            <div className="pl-64 pt-14">
                <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

                <div className="px-6 pb-8">
                    {children}
                </div>

                <Footer />
            </div>
        </div>
    );
}
