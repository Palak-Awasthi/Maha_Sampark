import AdminSidebar from './AdminSidebar'; // Import the sidebar
import AdminHeader from './AdminHeader'; // Import Header
import AdminFooter from './AdminFooter'; // Import Footer

import React, { useState } from 'react';

function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('adminCnt');

  // Handle section change based on Sidebar selection
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // Define the content based on the selected section
  const renderContent = () => {
    switch (selectedSection) {
      case 'profile':
        return <h2 className="text-2xl font-semibold">Profile Section</h2>;
      case 'reports':
        return <h2 className="text-2xl font-semibold">Reports Section</h2>;
      case 'settings':
        return <h2 className="text-2xl font-semibold">Settings Section</h2>;
      default:
        return <h2 className="text-2xl font-semibold">Admin Content Section</h2>;
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with gradient background, handleSectionChange is passed as a prop */}
      <AdminSidebar 
        className="bg-gradient-to-b from-black to-white text-white" 
        onSectionChange={handleSectionChange} 
      />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader /> {/* Include Header */}
        
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
          
          {/* Render dynamic content */}
          {renderContent()}
          
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminDashboard;
