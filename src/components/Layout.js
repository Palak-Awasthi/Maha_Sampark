import React, { useState } from 'react'; // Import useState
import Sidebar from './Sidebar'; // Adjust the import path if needed
import Header from './Header'; // Adjust the import path if needed
import Footer from './Footer'; // Adjust the import path if needed
import { FaBars } from 'react-icons/fa';

function Layout({ children, onSelectSection }) {
  // Step 1: Add state for sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Step 2: Function to toggle sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen); // Toggle between true and false
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSelectSection={onSelectSection}
      />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden top-4 left-4 text-white bg-blue-600 p-3 rounded z-50 fixed"
          onClick={toggleSidebar}
          aria-label="Toggle Sidebar"
        >
          <FaBars size={24} />
        </button>

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {children}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
