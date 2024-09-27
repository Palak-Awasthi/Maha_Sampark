import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaUser,
  FaRegAddressCard,
  FaRegBuilding,
  FaNewspaper,
  FaInfoCircle,
  FaCog,
  FaSlidersH,
} from 'react-icons/fa';

function AdminSidebar() {
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isMasterDropdownOpen, setIsMasterDropdownOpen] = useState(false);
  const [isOtherDropdownOpen, setIsOtherDropdownOpen] = useState(false); 
  const location = useLocation();

  // Function to check if the link is active
  const isActive = (path) => (location.pathname === path ? 'bg-blue-600 text-white' : '');

  return (
    <div className="bg-blue-800 text-white h-screen w-64 p-4 shadow-md ">
      <h2 className="text-3xl font-bold mb-8">Admin Dashboard</h2>
      <ul className="space-y-4">
        <li>
          <Link
            to="/AdminDashboard"
            className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${isActive('/AdminDashboard')}`}
          >
            <FaSlidersH className="mr-3" />
            Dashboard
          </Link>
        </li>
                {/* Master with Hover Dropdown */}
                <li
                className="relative group"
                onMouseEnter={() => setIsMasterDropdownOpen(true)}
                onMouseLeave={() => setIsMasterDropdownOpen(false)}
              >
                <span
                  className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-blue-700 transition ${isActive('/master')}`}
                >
                  <FaSlidersH className="mr-3" />
                  Master
                </span>
                {isMasterDropdownOpen && (
                  <ul className="absolute left-full top-0 mt-2 bg-blue-800 text-white shadow-lg p-2 rounded-md w-56 z-10">
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/mcsmaster">MCS & AIS Designation</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/desigmaster">Other Officer Designation</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/posting">Posting</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/maindeptmaster">Main Department</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/officename">Office Name</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/state">State</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/district">District</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/taluka">Taluka</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/officialtype">Non-Official Type</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/officialmain">Non-Official Main Type</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/govmaster">Govt Offices Department</Link>
                    </li>
                    <li className="p-2 hover:bg-blue-700 transition">
                      <Link to="/staffmaster">Staff Designation</Link>
                    </li>
                  </ul>
                )}
              </li>

        {/* Profile with Hover Dropdown */}
        <li
          className="relative group"
          onMouseEnter={() => setIsProfileDropdownOpen(true)}
          onMouseLeave={() => setIsProfileDropdownOpen(false)}
        >
          <span
            className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-blue-700 transition ${isActive(
              '/profile'
            )}`}
          >
            <FaUser className="mr-3" />
            Profile
          </span>
          {/* Dropdown Menu */}
          {isProfileDropdownOpen && (
            <ul className="absolute left-full top-0 mt-2 bg-blue-800 text-white shadow-lg p-2 rounded-md w-48 z-10">
              <li className="p-2 hover:bg-blue-700 transition">
                <Link to="/mcsofficerprofile">MCS Officers</Link>
              </li>
              <li className="p-2 hover:bg-blue-700 transition">
                <Link to="/aisofficerprofile">AIS Officers</Link>
              </li>
              <li className="p-2 hover:bg-blue-700 transition">
                <Link to="/mahagovofficer">Maharashtra Govt Officers</Link>
              </li>
            </ul>
          )}
        </li>
        

        <li>
          <Link
            to="/registeredusers"
            className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${isActive(
              '/registeredusers'
            )}`}
          >
            <FaRegAddressCard className="mr-3" />
            Registered Users
          </Link>
        </li>
        <li>
          <Link
            to="/govtoffices"
            className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${isActive(
              '/govtoffices'
            )}`}
          >
            <FaRegBuilding className="mr-3" />
            Govt Offices
          </Link>
        </li>
        <li>
          <Link
            to="/adminnews"
            className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${isActive(
              '/adminnews'
            )}`}
          >
            <FaNewspaper className="mr-3" />
            News
          </Link>
        </li>
         {/* Other with Hover Dropdown */}
         <li
         className="relative group"
         onMouseEnter={() => setIsOtherDropdownOpen(true)}
         onMouseLeave={() => setIsOtherDropdownOpen(false)}
       >
         <span
           className={`flex items-center p-3 rounded-md cursor-pointer hover:bg-blue-700 transition ${isActive('/other')}`}
         >
           <FaCog className="mr-3" />
           Other
         </span>
         {isOtherDropdownOpen && (
           <ul className="absolute left-full top-0 mt-2 bg-blue-800 text-white shadow-lg p-2 rounded-md w-56 z-10">
             <li className="p-2 hover:bg-blue-700 transition">
               <Link to="/revenue-forum">Revenue Forum</Link>
             </li>
             <li className="p-2 hover:bg-blue-700 transition">
               <Link to="/quick-alert">Quick Alert</Link>
             </li>
             <li className="p-2 hover:bg-blue-700 transition">
               <Link to="/feedback">Feedback</Link>
             </li>
             <li className="p-2 hover:bg-blue-700 transition">
               <Link to="/notification">Notification</Link>
             </li>
           </ul>
         )}
       </li>
        <li>
          <Link
            to="/department-info"
            className={`flex items-center p-3 rounded-md hover:bg-blue-700 transition ${isActive(
              '/department-info'
            )}`}
          >
            <FaInfoCircle className="mr-3" />
            Department Info
          </Link>
        </li>
        
       


      </ul>
    </div>
  );
}

export default AdminSidebar;
