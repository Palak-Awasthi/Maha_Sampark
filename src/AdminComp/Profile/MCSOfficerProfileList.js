import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaCheck, FaTimes, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";

const MCSOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});
  const [dropdownOptions, setDropdownOptions] = useState({
    designation: [""],
    presentPosting: [""],
    postingDistrictLocation: [""],
    postingTaluka: [""],
    homeDistrict: [""],
    homeTaluka: [""],
    yearOfJoiningPresentCadre: [""],
    dateOfJoiningRevenueDepartment: [""],
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/mcs");
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
    filterProfiles({ ...searchQuery, [name]: value });
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

  const handleDeleteProfile = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        // Updated API endpoint for deletion
        await axios.delete(`http://localhost:8080/api/mcs/${id}`);
        setProfiles(profiles.filter((p) => p.id !== id));
        setFilteredProfiles(filteredProfiles.filter((p) => p.id !== id));
        Swal.fire("Deleted!", "Profile has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error("Failed to delete profile.");
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      await axios.put(`http://localhost:8080/api/profiles/${id}/status`, { status: newStatus });
      fetchProfiles();
      toast.success(`Profile status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating profile status:", error);
      toast.error("Failed to update status.");
    }
  };

  const resetForm = () => {
    setSearchQuery({});
    setFilteredProfiles(profiles);
  };

  return (
    <div className="flex flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="container mx-auto p-4 max-w-7xl">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
            <div className="text-2xl sm:text-3xl font-bold">MCS Officers Profile List</div>
            <button
              onClick={resetForm}
              className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
              title="Reset"
            >
              <FaSyncAlt />
            </button>
          </div>

          {/* Search Fields */}
          <div className="bg-white rounded-lg shadow-md mb-6 max-w-full">
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Search Profiles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-striped-pattern">
              <div>
                <label className="font-bold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={searchQuery.name || ""}
                  onChange={handleInputChange}
                  className="border p-1 rounded-md w-full"
                  placeholder="Enter Name"
                />
              </div>
              {["designation", "presentPosting", "postingDistrictLocation", "postingTaluka", "homeDistrict", "homeTaluka"].map((field) => (
                <div key={field}>
                  <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <select
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full"
                  >
                    <option value="">Select {field}</option>
                    {dropdownOptions[field].map((option, index) => (
                      <option key={index} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <div>
                <label className="font-bold">Year of Joining Present Cadre</label>
                <select
                  name="yearOfJoiningPresentCadre"
                  value={searchQuery.yearOfJoiningPresentCadre || ""}
                  onChange={handleInputChange}
                  className="border p-1 rounded-md w-full"
                >
                  <option value="">Select Year</option>
                  {dropdownOptions.yearOfJoiningPresentCadre.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="font-bold">Date of Joining Revenue Department</label>
                <select
                  name="dateOfJoiningRevenueDepartment"
                  value={searchQuery.dateOfJoiningRevenueDepartment || ""}
                  onChange={handleInputChange}
                  className="border p-1 rounded-md w-full"
                >
                  <option value="">Select Date</option>
                  {dropdownOptions.dateOfJoiningRevenueDepartment.map((date, index) => (
                    <option key={index} value={date}>
                      {date}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Profile Table */}
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full border-collapse border border-gray-300">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border border-gray-300 p-2">Sr No</th>
                  <th className="border border-gray-300 p-2">Name</th>
                  <th className="border border-gray-300 p-2">Mobile Number 1</th>
                  <th className="border border-gray-300 p-2">Mobile Number 2</th>
                  <th className="border border-gray-300 p-2">Designation</th>
                  <th className="border border-gray-300 p-2">Present Posting</th>
                  <th className="border border-gray-300 p-2">Posting District</th>
                  <th className="border border-gray-300 p-2">Posting Taluka</th>
                  <th className="border border-gray-300 p-2">Home District</th>
                  <th className="border border-gray-300 p-2">Home Taluka</th>
                  <th className="border border-gray-300 p-2">Educational Qualification</th>
                  <th className="border border-gray-300 p-2">Mail ID</th>
                  <th className="border border-gray-300 p-2">Date of Birth</th>
                  <th className="border border-gray-300 p-2">Date of Joining Revenue Department</th>
                  <th className="border border-gray-300 p-2">Year of Joining Present Cadre</th>
                  <th className="border border-gray-300 p-2">Date of Joining Present Post</th>
                  <th className="border border-gray-300 p-2">Data Updated On</th>
                  <th className="border border-gray-300 p-2">Past Posting</th>
                 
                  <th className="border border-gray-300 p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.map((profile, index) => (
                  <tr key={profile.id} className="bg-white hover:bg-gray-100">
                    <td className="border border-gray-300 p-2">{index + 1}</td>
                    <td className="border border-gray-300 p-2">{profile.name}</td>
                    <td className="border border-gray-300 p-2">{profile.mobileNumber1}</td>
                    <td className="border border-gray-300 p-2">{profile.mobileNumber2}</td>
                    <td className="border border-gray-300 p-2">{profile.designation}</td>
                    <td className="border border-gray-300 p-2">{profile.presentPosting}</td>
                    <td className="border border-gray-300 p-2">{profile.postingDistrictLocation}</td>
                    <td className="border border-gray-300 p-2">{profile.postingTaluka}</td>
                    <td className="border border-gray-300 p-2">{profile.homeDistrict}</td>
                    <td className="border border-gray-300 p-2">{profile.homeTaluka}</td>
                    <td className="border border-gray-300 p-2">{profile.educationalQualification}</td>
                    <td className="border border-gray-300 p-2">{profile.emailID}</td>
                    <td className="border border-gray-300 p-2">{profile.dateOfBirth}</td>
                    <td className="border border-gray-300 p-2">{profile.dateOfJoiningRevenueDepartment}</td>
                    <td className="border border-gray-300 p-2">{profile.yearOfJoiningPresentCadre}</td>
                    <td className="border border-gray-300 p-2">{profile.dateOfJoiningPresentPosting}</td>
                    <td className="border border-gray-300 p-2">{profile.informationDataUpdatedDate}</td>
                    <td className="border border-gray-300 p-2">{profile.pastPosting}</td>
                   
                    <td className="border border-gray-300 p-2">
                      
                      <button onClick={() => handleDeleteProfile(profile.id)} className="p-1 text-red-600 hover:text-red-800">
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

export default MCSOfficerProfileList;
