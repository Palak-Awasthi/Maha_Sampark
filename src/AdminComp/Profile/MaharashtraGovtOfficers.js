import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaTrash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2"; // Import SweetAlert
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
    postingDistrictLocation: "",
    postingTaluka: "",
    stdCode: "",
    landline: "",
  });

  const [debounceTimeout, setDebounceTimeout] = useState(null);

  // Dropdown data state
  const [officeNames, setOfficeNames] = useState([]);
  const [postingDistrictLocation, setpostingDistrictLocation] = useState([]);
  const [talukaNames, setTalukaNames] = useState([]);
  const [stdCodes, setStdCodes] = useState([]);
  const [landlines, setLandlines] = useState([]);

  useEffect(() => {
    fetchProfiles();
    fetchDropdownData(); // Fetch dropdown data on component mount
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

  const fetchDropdownData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gom");
      // Assuming response.data contains the required dropdown data
      const dropdownData = response.data;

      // Populate dropdowns
      setOfficeNames([...new Set(dropdownData.map(item => item.officeName))]);
      setpostingDistrictLocation([...new Set(dropdownData.map(item => item.postingDistrictLocation))]);
      setTalukaNames([...new Set(dropdownData.map(item => item.postingTaluka))]);
      setStdCodes([...new Set(dropdownData.map(item => item.stdcode))]);
      setLandlines([...new Set(dropdownData.map(item => item.landline))]);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      toast.error("Failed to fetch dropdown data.");
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

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/gom/${id}`);
        setProfiles(profiles.filter(profile => profile.id !== id));
        setFilteredProfiles(filteredProfiles.filter(profile => profile.id !== id));
        toast.success("Profile deleted successfully!");
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error("Failed to delete profile.");
      }
    }
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <div className="container mx-auto p-4 flex-grow">
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
              
              {/* Office Name Dropdown */}
              <div>
                <label className="font-bold">Office Name</label>
                <select
                  name="officeName"
                  value={searchQuery.officeName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select Office</option>
                  {officeNames.map((office) => (
                    <option key={office} value={office}>
                      {office}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* District Name Dropdown */}
              <div>
                <label className="font-bold">District Name</label>
                <select
                  name="districtName"
                  value={searchQuery.districtName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select District</option>
                  {postingDistrictLocation.map((district) => (
                    <option key={district} value={district}>
                      {district}
                    </option>
                  ))}
                </select>
              </div>

              {/* Second Row */}
              {/* Taluka Name Dropdown */}
              <div>
                <label className="font-bold">Taluka Name</label>
                <select
                  name="talukaName"
                  value={searchQuery.talukaName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select Taluka</option>
                  {talukaNames.map((taluka) => (
                    <option key={taluka} value={taluka}>
                      {taluka}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* STD Code Dropdown */}
              <div>
                <label className="font-bold">STD Code</label>
                <select
                  name="stdCode"
                  value={searchQuery.stdCode}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select STD Code</option>
                  {stdCodes.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </select>
              </div>
              
              {/* Landline Dropdown */}
              <div>
                <label className="font-bold">Landline</label>
                <select
                  name="landline"
                  value={searchQuery.landline}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                >
                  <option value="">Select Landline</option>
                  {landlines.map((line) => (
                    <option key={line} value={line}>
                      {line}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto max-h-96">
            <table className="min-w-full bg-white">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-2 px-4">ID</th>
                  <th className="py-2 px-4">Name</th>
                  <th className="py-2 px-4">Designation</th>
                  <th className="py-2 px-4">Mobile No 1</th>
                  <th className="py-2 px-4">Mobile No 2</th>
                  <th className="py-2 px-4">Posting District Location</th>
                  <th className="py-2 px-4">Posting Taluka</th>
                  <th className="py-2 px-4">Office Name</th>
                  <th className="py-2 px-4">STD Code</th>
                  <th className="py-2 px-4">Landline</th>
                  
                  <th className="py-2 px-4">Action</th> {/* New Action Column */}
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-gray-100">
                    <td className="border-t py-2 px-4">{profile.id}</td>
                    <td className="border-t py-2 px-4">{profile.name}</td>
                    <td className="border-t py-2 px-4">{profile.designation}</td>
                    <td className="border-t py-2 px-4">{profile.mobileNumber1}</td>
                    <td className="border-t py-2 px-4">{profile.mobileNumber2}</td>
                    <td className="border-t py-2 px-4">{profile.postingDistrictLocation}</td>
                    <td className="border-t py-2 px-4">{profile.postingTaluka}</td>
                    <td className="border-t py-2 px-4">{profile.officeName}</td>
                    <td className="border-t py-2 px-4">{profile.stdcode}</td>
                    <td className="border-t py-2 px-4">{profile.landline}</td>
                   
                    <td className="border-t py-2 px-4">
                      <button
                        onClick={() => handleDelete(profile.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
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
