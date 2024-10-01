import React, { useState } from 'react';
import Sidebar from './Sidebar'; 
import DashboardContent from './DashboardContent'; 
import Header from './Header'; 
import Footer from './Footer'; 
import MCAOfficersProfile from './MCSOfficersProfile'; 
import ProfileForm from './ProfileForm'; 
import GovtOfficeContacts from './GovtOfficeContacts'; 
import News from './News'; 
import DepartmentInformation from './DepartmentInformation'; 
import TodaysBirthday from './TodaysBirthday';
import TodaysJoining from './TodaysJoining';
import Feedback from './Feedback';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState('home');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSectionChange = (section) => {
    setSelectedSection(section);
  };

  const renderSection = () => {
    switch (selectedSection) {
      case 'home': return <DashboardContent onSelectSection={handleSectionChange} />;
      case 'officers-profile': return <MCAOfficersProfile />;
      case 'my-profile': return <ProfileForm />;
      case 'govt-offices': return <GovtOfficeContacts />;
      case 'news': return <News />;
      case 'department-information': return <DepartmentInformation />;
      case 'todays-birthday': return <TodaysBirthday />;
      case 'todays-joining': return <TodaysJoining />;
      case 'feedback': return <Feedback />;
      default: return <DashboardContent onSelectSection={handleSectionChange} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden relative">
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        onSelectSection={handleSectionChange}
      />

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-50 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      <div className={`flex flex-col flex-1 transition-all duration-300 ${isSidebarOpen ? 'lg:ml-64' : 'ml-0'}`}>
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 p-6 bg-gray-100 overflow-auto">
          {/* Transition for section changes */}
          <TransitionGroup>
            <CSSTransition
              key={selectedSection} // Unique key to trigger animation on section change
              classNames="fade" // Refers to the fade-in/out classes
              timeout={500} // Duration of the transition
            >
              <div>{renderSection()}</div> 
            </CSSTransition>
          </TransitionGroup>
        </main>

        <Footer />
      </div>

      {/* Inline style tag for fade-in/out CSS */}
      <style jsx="true">{`
        .fade-enter {
          opacity: 0;
        }
        .fade-enter-active {
          opacity: 1;
          transition: opacity 500ms ease-in;
        }
        .fade-exit {
          opacity: 1;
        }
        .fade-exit-active {
          opacity: 0;
          transition: opacity 300ms ease-out;
        }
      `}</style>
    </div>
  );
}

export default Dashboard;
