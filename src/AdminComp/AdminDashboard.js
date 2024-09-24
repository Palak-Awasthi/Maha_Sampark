import AdminSidebar from './AdminSidebar'; // Import the sidebar
import AdminHeader from './AdminHeader'; // Import Header
import AdminFooter from './AdminFooter'; // Import Footer

import React, { useState } from 'react';
import AdminContent from './AdminContent';

function AdminDashboard() {
  const [ setSelectedSection] = useState('adminCnt');

  // Handle section change based on Sidebar selection
  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  // Define the content based on the selected section

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
          <AdminContent></AdminContent>
          
        </main>

        {/* Footer */}
        <AdminFooter />
      </div>
    </div>
  );
}

export default AdminDashboard;
