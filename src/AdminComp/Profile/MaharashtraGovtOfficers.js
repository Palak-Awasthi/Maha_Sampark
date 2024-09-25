import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";

const MaharashtraGovtOfficers = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    officeName: "",
    districtName: "",
    talukaName: "",
    stdCode: "",
    landline: "",
  });

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gom");
      setProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to fetch profiles.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchQuery((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    if (debounceTimeout) {
      clearTimeout(debounceTimeout); // Clear previous debounce
    }

    const newTimeout = setTimeout(() => {
      filterProfiles({ ...searchQuery, [name]: value });
    }, 300); // 300ms debounce delay

    setDebounceTimeout(newTimeout);
  };

  const filterProfiles = (searchValues) => {
    const filtered = profiles.filter((profile) => {
      return Object.keys(searchValues).every((key) => {
        if (!searchValues[key]) return true;
        return profile[key]?.toString().toLowerCase().includes(searchValues[key].toLowerCase());
      });
    });
    setFilteredProfiles(filtered);
  };

  const resetForm = () => {
    setSearchQuery({
      name: "",
      officeName: "",
      districtName: "",
      talukaName: "",
      stdCode: "",
      landline: "",
    });
    setFilteredProfiles(profiles);
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
            <div className="text-2xl sm:text-3xl font-bold">Maharashtra Govt Officers Profile List</div>
            <button
              onClick={resetForm}
              className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
              title="Reset"
            >
              <FaSyncAlt />
            </button>
          </div>

          {/* Search Fields */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Search Profiles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-striped-pattern">
              {/* First Row */}
              <div>
                <label className="font-bold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={searchQuery.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">Office Name</label>
                <input
                  type="text"
                  name="officeName"
                  value={searchQuery.officeName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">District Name</label>
                <input
                  type="text"
                  name="districtName"
                  value={searchQuery.districtName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              {/* Second Row */}
              <div>
                <label className="font-bold">Taluka Name</label>
                <input
                  type="text"
                  name="talukaName"
                  value={searchQuery.talukaName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">STD Code</label>
                <input
                  type="text"
                  name="stdCode"
                  value={searchQuery.stdCode}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">Landline</label>
                <input
                  type="text"
                  name="landline"
                  value={searchQuery.landline}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>
          </div>

          {/* HTML Table */}
          {/* HTML Table */}
          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="w-1/12 py-2">ID</th>
                  <th className="w-2/12 py-2">Name</th>
                  <th className="w-2/12 py-2">Designation</th>
                  <th className="w-2/12 py-2">Mobile Number 1</th>
                  <th className="w-2/12 py-2">Mobile Number 2</th>
                  <th className="w-2/12 py-2">Posting District Location</th>
                  <th className="w-2/12 py-2">Posting Taluka</th>
                  <th className="w-2/12 py-2">Office Name</th>
                  <th className="w-2/12 py-2">STD Code</th>
                  <th className="w-2/12 py-2">Landline</th>
                  <th className="w-2/12 py-2">Date of Birth</th>
                  <th className="w-2/12 py-2">Other Information</th>
                  <th className="w-2/12 py-2">Department</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border-b">
                      <td className="text-center py-2">{profile.id}</td>
                      <td className="text-center py-2">{profile.name}</td>
                      <td className="text-center py-2">{profile.designation}</td>
                      <td className="text-center py-2">{profile.mobileNumber1}</td>
                      <td className="text-center py-2">{profile.mobileNumber2}</td>
                      <td className="text-center py-2">{profile.postingDistrictLocation}</td>
                      <td className="text-center py-2">{profile.postingTaluka}</td>
                      <td className="text-center py-2">{profile.officeName}</td>
                      <td className="text-center py-2">{profile.stdCode}</td>
                      <td className="text-center py-2">{profile.landline}</td>
                      <td className="text-center py-2">{new Date(profile.dateOfBirth).toLocaleDateString()}</td>
                      <td className="text-center py-2">{profile.otherInformation}</td>
                      <td className="text-center py-2">{profile.department}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="13" className="text-center py-4">
                      No profiles found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
        <AdminFooter />
      </div>
      <ToastContainer />
    </div>
  );
};

export default MaharashtraGovtOfficers;
