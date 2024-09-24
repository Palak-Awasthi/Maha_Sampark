import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './components/Dashboard';
import ProfileForm from './components/ProfileForm';
import OtpLogin from './components/OtpLogin'; // Import your OTP Login component
import DashboardContent from './components/DashboardContent';
import MCAOfficersProfile from './components/MCSOfficersProfile';
import GovtOfficeContacts from './components/GovtOfficeContacts';
import DepartmentInformation from './components/DepartmentInformation';
import RegistrationForm from './components/RegistrationForm';
import AdminDashboard from './AdminComp/AdminDashboard';
import AdminLayout from './AdminComp/AdminLayout';
import MCSAISDesignationMaster from './AdminComp/Master/MCSAISDesignationMaster';
import StaffDesignationMaster from './AdminComp/Master/StaffDesignationMaster';
import GovernmentOfficeDepartmentMaster from './AdminComp/Master/GovernmentOfficeDepartmentMaster';
import NonOfficialTypeMaster from './AdminComp/Master/NonOfficialTypeMaster';
import TalukaMaster from './AdminComp/Master/TalukaMaster';
import NonOfficialMainTypeMaster from './AdminComp/Master/NonOfficialMainTypeMaster';
import DistrictMaster from './AdminComp/Master/DistrictMaster';
import StateMaster from './AdminComp/Master/StateMaster';
import OfficeNameMaster from './AdminComp/Master/OfficeNameMaster';
import MainDepartmentMaster from './AdminComp/Master/MainDepartmentMaster';
import PostingMaster from './AdminComp/Master/PostingMaster';
import OfficeDesignationMaster from './AdminComp/Master/OfficeDesignationMaster';
import AdminGovtOfficeContact from './AdminComp/AdminGovtOfficeContact';
import RegisteredUsersList from './AdminComp/RegisteredUsersList';
import AdminNews from './AdminComp/AdminNews';
import MCSOfficerProfileList from './AdminComp/Profile/MCSOfficerProfileList';
import AISOfficerProfileList from './AdminComp/Profile/AISOfficerProfileList';
import GovtOfficeContact from './AdminComp/AdminGovtOfficeContact';
import MaharashtraGovtOfficers from './AdminComp/Profile/MaharashtraGovtOfficers';
import AdminHeader from './AdminComp/AdminHeader';
import AdminFooter from './AdminComp/AdminFooter';




function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
        <Route path="/" element={<OtpLogin />} />
          {/* Define routes for different components */}
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/my-profile" element={<ProfileForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboardContent" element={<DashboardContent />} />
          <Route path="/officers-profile" element={<MCAOfficersProfile />} /> 
          <Route path="/govt-offices" element={<GovtOfficeContacts />} /> 
          <Route path="/department-information" element={<DepartmentInformation />} /> 
          <Route path="/adminDashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<AdminLayout />}></Route>
          <Route path="/mcsmaster" element={<MCSAISDesignationMaster />} />
          <Route path="/staffmaster" element={<StaffDesignationMaster />} />
          <Route path="/govmaster" element={<GovernmentOfficeDepartmentMaster />} />
          <Route path="/officialtype" element={<NonOfficialTypeMaster />} />
          <Route path="/taluka" element={<TalukaMaster />} />
          <Route path="/officialmain" element={< NonOfficialMainTypeMaster />} />
          <Route path="/district" element={< DistrictMaster />} />
          <Route path="/state" element={< StateMaster />} />
          <Route path="/officename" element={< OfficeNameMaster />} />
          <Route path="/maindeptmaster" element={< MainDepartmentMaster />} />
          <Route path="/posting" element={< PostingMaster />} />
          <Route path="/desigmaster" element={<  OfficeDesignationMaster />} />
          <Route path="/govtoffices" element={<AdminGovtOfficeContact />} />
          <Route path="/registeredusers" element={<RegisteredUsersList />} />
          <Route path="/adminnews" element={<AdminNews />} />
          <Route path="/mcsofficerprofile" element={<MCSOfficerProfileList/>} />
          <Route path="/aisofficerprofile" element={<AISOfficerProfileList/>} />
          <Route path="/govofficer"         element={<GovtOfficeContact/>} />
          <Route path="/mahagovofficer" element={<MaharashtraGovtOfficers />} />
          <Route path="/AdminHeader" element={<AdminHeader />} />
          <Route path="/AdminFooter" element={<AdminFooter />} />
          
          
          {/* Default Route */}
          
        </Routes>
      </div>
    </Router>
  );
}

export default App;


