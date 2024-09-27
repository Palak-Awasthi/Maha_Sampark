  import React, { useState, useEffect } from "react";
  import axios from "axios";
  import { FaSyncAlt, FaCheck, FaTimes } from "react-icons/fa";
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
      designation: ["Designation 1", "Designation 2", "Designation 3"], // Replace with actual options or fetch dynamically
      presentPosting: ["Posting 1", "Posting 2", "Posting 3"], // Replace with actual options
      postingDistrictLocation: ["District 1", "District 2", "District 3"], // Replace with actual options
      postingTaluka: ["Taluka 1", "Taluka 2", "Taluka 3"], // Replace with actual options
      homeDistrict: ["Home District 1", "Home District 2", "Home District 3"], // Replace with actual options
      homeTaluka: ["Home Taluka 1", "Home Taluka 2", "Home Taluka 3"], // Replace with actual options
      yearOfJoiningPresentCadre: ["2020", "2021", "2022"], // Replace with actual years
      dateOfJoiningRevenueDepartment: ["2019", "2020", "2021"], // Replace with actual dates or years
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
          await axios.delete(`http://localhost:8080/api/profiles/${id}`);
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
        await axios.put(`http://localhost:8080/api/profiles/${id}/status`, {
          status: newStatus,
        });
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

            {/* Simple HTML Table */}
            <div className="overflow-x-auto max-w-full">
              <table className="min-w-full bg-white border rounded-lg shadow-lg">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    {/* Table headings */}
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.length > 0 ? (
                    filteredProfiles.map((profile) => (
                      <tr key={profile.id}>
                        {/* Profile data */}
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="18" className="text-center py-4">No profiles found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <AdminFooter />
            <ToastContainer />
          </div>
        </div>
      </div>
    );
  };

  export default MCSOfficerProfileList;
