import React, { useState } from 'react';
import Sidebar from './Sidebar'; // Adjust the import path if needed
import DashboardContent from './DashboardContent'; // Adjust the import path if needed
import Header from './Header'; // Adjust the import path if needed
import Footer from './Footer'; // Adjust the import path if needed
import MCAOfficersProfile from './MCSOfficersProfile'; // Import MCAOfficersProfile component
import ProfileForm from './ProfileForm'; // Import ProfileForm component
import GovtOfficeContacts from './GovtOfficeContacts'; // Import GovtOfficeContacts component
import News from './News'; // Import News component
import DepartmentInformation from './DepartmentInformation'; 
import TodaysBirthday from './TodaysBirthday';
import TodaysJoining from './TodaysJoining';
import Feedback from './Feedback';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home'); // Manage current section view

  // Function to toggle sidebar open/close state
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // Function to handle section changes from the sidebar or header
  const handleSectionChange = (section) => {
    setSelectedSection(section); // Change section when clicked on Sidebar or DashboardContent
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSelectSection={handleSectionChange}
      />

      {/* Overlay for mobile view when sidebar is open */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar} // Clicking on overlay should close the sidebar
        />
      )}

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Header */}
        <Header onToggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {/* Dynamically load content based on selected section */}
          {selectedSection === 'home' && <DashboardContent onSelectSection={handleSectionChange} />}
          {selectedSection === 'officers-profile' && <MCAOfficersProfile />}
          {selectedSection === 'my-profile' && <ProfileForm />}
          {selectedSection === 'govt-offices' && <GovtOfficeContacts />}
          {selectedSection === 'news' && <News />}
          {selectedSection === 'department-information' && <DepartmentInformation />}
          {selectedSection === 'todays-birthday' && <TodaysBirthday />}
          {selectedSection === 'todays-joining' && <TodaysJoining />}
          {selectedSection === 'feedback' && <Feedback />}
        </main>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
