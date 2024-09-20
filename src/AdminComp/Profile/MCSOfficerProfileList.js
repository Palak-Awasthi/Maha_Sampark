import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash, FaCheck, FaTimes, FaSyncAlt } from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";

const MCSOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    presentPost: "",
    postingDistrict: "",
    postingTaluka: "",
    homeDistrict: "",
    homeTaluka: "",
    yearOfPromotion: "",
  });

  useEffect(() => {
    fetchProfiles();
  }, [formState]);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/profiles", {
        params: formState,
      });
      setProfiles(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleDeleteProfile = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`http://localhost:8080/api/profiles/${id}`);
        setProfiles(profiles.filter((p) => p.id !== id));
        alert("Profile deleted successfully!");
      } catch (error) {
        handleError(error);
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
      alert(`Profile status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormState({
      name: "",
      designation: "",
      presentPost: "",
      postingDistrict: "",
      postingTaluka: "",
      homeDistrict: "",
      homeTaluka: "",
      yearOfPromotion: "",
    });
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      alert(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
            <div className="relative overflow-hidden whitespace-nowrap">
              <div className="text-2xl sm:text-3xl font-bold">
                <span className="mx-2">MCS</span>
                <span className="mx-2">Officers</span>
                <span className="mx-2">Profile</span>
                <span className="mx-2">List</span>
              </div>
            </div>

            {/* Reset Button */}
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              <button
                onClick={resetForm}
                className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
                title="Reset"
              >
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {/* Search Fields for Real-time Filtering */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">Search Profiles</h3>
            </div>
            <div className="p-6">
              <form>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-bold">Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formState.name}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Designation</label>
                    <input
                      type="text"
                      name="designation"
                      value={formState.designation}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Present Post</label>
                    <input
                      type="text"
                      name="presentPost"
                      value={formState.presentPost}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Posting District</label>
                    <input
                      type="text"
                      name="postingDistrict"
                      value={formState.postingDistrict}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Posting Taluka</label>
                    <input
                      type="text"
                      name="postingTaluka"
                      value={formState.postingTaluka}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Home District</label>
                    <input
                      type="text"
                      name="homeDistrict"
                      value={formState.homeDistrict}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Home Taluka</label>
                    <input
                      type="text"
                      name="homeTaluka"
                      value={formState.homeTaluka}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                  <div>
                    <label className="font-bold">Year of Promotion</label>
                    <input
                      type="text"
                      name="yearOfPromotion"
                      value={formState.yearOfPromotion}
                      onChange={handleInputChange}
                      className="p-2 border rounded w-full"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Profile List Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">Profiles List</h3>
            </div>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Designation</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {profiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.designation}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{profile.approvalStatus}</td>
                    <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                      <button onClick={() => handleDeleteProfile(profile.id)} className="text-red-500 hover:text-red-700">
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(profile.id, profile.approvalStatus)}
                        className="text-yellow-500 hover:text-yellow-700"
                      >
                        {profile.approvalStatus === "Approved" ? <FaTimes /> : <FaCheck />}
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
    </div>
  );
};

export default MCSOfficerProfileList;
