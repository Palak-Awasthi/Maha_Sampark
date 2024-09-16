// AdminLayout.js
import React from 'react';
import Header from './AdminHeader'; // Adjust the import path as needed
import Footer from './AdminFooter'; // Adjust the import path as needed
import AdminSidebar from './AdminSidebar'; // Adjust the import path as needed

function AdminLayout({ children }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-4">
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}

export default AdminLayout;

