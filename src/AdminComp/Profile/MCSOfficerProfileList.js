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
              {["name", "designation", "presentPosting"].map((field) => (
                <div key={field}>
                  <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full"
                  />
                </div>
              ))}
              {["postingDistrictLocation", "postingTaluka", "homeDistrict"].map((field) => (
                <div key={field}>
                  <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full"
                  />
                </div>
              ))}
              {["homeTaluka", "yearOfJoiningPresentCadre", "dateOfJoiningRevenueDepartment"].map((field) => (
                <div key={field}>
                  <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Simple HTML Table */}
          <div className="overflow-x-auto max-w-full">
            <table className="min-w-full bg-white border rounded-lg shadow-lg">
              <thead>
                <tr className="bg-blue-500 text-white">
                  <th className="py-2 px-4 border">ID</th>
                  <th className="py-2 px-4 border">Name</th>
                  <th className="py-2 px-4 border">Designation</th>
                  <th className="py-2 px-4 border">Present Posting</th>
                  <th className="py-2 px-4 border">Mobile Number 1</th>
                  <th className="py-2 px-4 border">Mobile Number 2</th>
                  <th className="py-2 px-4 border">Year of Joining</th>
                  <th className="py-2 px-4 border">Posting District</th>
                  <th className="py-2 px-4 border">Posting Taluka</th>
                  <th className="py-2 px-4 border">Home District</th>
                  <th className="py-2 px-4 border">Home Taluka</th>
                  <th className="py-2 px-4 border">Date of Birth</th>
                  <th className="py-2 px-4 border">Date of Joining Revenue Department</th>
                  <th className="py-2 px-4 border">Date of Joining Present Posting</th>
                  <th className="py-2 px-4 border">Information Data Updated Date</th>
                  <th className="py-2 px-4 border">Past Posting</th>
                  <th className="py-2 px-4 border">Other Information</th>
                  <th className="py-2 px-4 border">Educational Qualification</th>
                  <th className="py-2 px-4 border">Email ID</th>
                  <th className="py-2 px-4 border">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProfiles.length > 0 ? (
                  filteredProfiles.map((profile) => (
                    <tr key={profile.id}>
                      <td className="border px-4 py-2">{profile.id}</td>
                      <td className="border px-4 py-2">{profile.name}</td>
                      <td className="border px-4 py-2">{profile.designation}</td>
                      <td className="border px-4 py-2">{profile.presentPosting}</td>
                      <td className="border px-4 py-2">{profile.mobileNumber1}</td>
                      <td className="border px-4 py-2">{profile.mobileNumber2}</td>
                      <td className="border px-4 py-2">{profile.yearOfJoiningPresentCadre}</td>
                      <td className="border px-4 py-2">{profile.postingDistrictLocation}</td>
                      <td className="border px-4 py-2">{profile.postingTaluka}</td>
                      <td className="border px-4 py-2">{profile.homeDistrict}</td>
                      <td className="border px-4 py-2">{profile.homeTaluka}</td>
                      <td className="border px-4 py-2">{profile.dateOfBirth}</td>
                      <td className="border px-4 py-2">{profile.dateOfJoiningRevenueDepartment}</td>
                      <td className="border px-4 py-2">{profile.dateOfJoiningPresentPosting}</td>
                      <td className="border px-4 py-2">{profile.informationDataUpdatedDate}</td>
                      <td className="border px-4 py-2">{profile.pastPosting}</td>
                      <td className="border px-4 py-2">{profile.otherInformation}</td>
                      <td className="border px-4 py-2">{profile.educationalQualification}</td>
                      <td className="border px-4 py-2">{profile.emailId}</td>
                      <td className="border px-4 py-2">
                        <button
                          onClick={() => handleToggleStatus(profile.id, profile.status)}
                          className={`px-2 py-1 rounded text-white ${
                            profile.status === "Approved" ? "bg-green-500" : "bg-orange-500"
                          }`}
                        >
                          {profile.status === "Approved" ? <FaCheck /> : <FaTimes />}
                        </button>
                        <button
                          onClick={() => handleDeleteProfile(profile.id)}
                          className="ml-2 px-2 py-1 bg-red-500 text-white rounded"
                        >
                          Delete
                        </button>
                      </td>
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
