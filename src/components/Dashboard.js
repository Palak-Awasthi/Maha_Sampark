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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section); // Change section when clicked on Sidebar or DashboardContent
  };

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSelectSection={handleSectionChange}
      />

      {/* Main Content Area */}
      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        {/* Toggle Button for Mobile */}
        <button
          className="lg:hidden fixed top-4 left-4 text-white bg-blue-600 p-3 rounded z-50"
          onClick={toggleSidebar}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Header */}
        <Header />

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
