
import AdminSidebar from './AdminSidebar'; // Import the sidebar
import Header from './AdminHeader'; // Import Header
import Footer from './AdminFooter'; // Import Footer
import RegisteredUsersList from './RegisteredUsersList';
import React, { useState } from 'react';
import AdminContent from './AdminContent'
function AdminDashboard() {
  const [selectedSection, setSelectedSection] = useState('adminCnt');
  const handleSectionChange = (section) => {
    setSelectedSection(section); // Change section when clicked on Sidebar or DashboardContent
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar with gradient background */}
      <AdminSidebar className="bg-gradient-to-b from-black to-white text-white" />
      
      {/* Main content */}
      <div className="flex-1 flex flex-col">
        <Header /> {/* Include Header */}
        
        <main className="flex-1 p-6">
          <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>

          {selectedSection === 'admincnt' && <AdminContent onSelectSection={handleSectionChange} />}
          
          
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default AdminDashboard;
