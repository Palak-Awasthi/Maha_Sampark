import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

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
    phoneNumber: "",
    email: "",
    approvalStatus: "Pending"
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetching profiles on initial render
  useEffect(() => {
    fetchProfiles();
  }, []);

  // Fetch all profiles from the backend
  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/profiles");
      setProfiles(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Handle add or update profile based on form state and editing status
  const handleAddOrUpdateProfile = async () => {
    if (!formState.name || !formState.designation || !formState.presentPost) {
      alert("Name, Designation, and Present Post fields are required!");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/profiles/${isEditing}`, formState);
        alert("Profile updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/profiles", formState);
        alert("Profile added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchProfiles();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateProfile();
  };

  const handleEditProfile = (id) => {
    const profile = profiles.find((p) => p.id === id);
    setFormState({
      name: profile.name,
      designation: profile.designation,
      presentPost: profile.presentPost,
      postingDistrict: profile.postingDistrict,
      postingTaluka: profile.postingTaluka,
      homeDistrict: profile.homeDistrict,
      homeTaluka: profile.homeTaluka,
      yearOfPromotion: profile.yearOfPromotion,
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      approvalStatus: profile.approvalStatus
    });
    setIsEditing(id);
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

  // Toggle profile status (approved/pending)
  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      await axios.put(`http://localhost:8080/api/profiles/${id}/status`, { status: newStatus });
      fetchProfiles();
      alert(`Profile status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredProfiles = profiles.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

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
      phoneNumber: "",
      email: "",
      approvalStatus: "Pending"
    });
    setIsEditing(null);
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
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">MCS</span>
            <span className="mx-2">Officers</span>
            <span className="mx-2">Profile</span>
            <span className="mx-2">List</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Officer"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Search"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => {
              setSearchTerm("")
              setShowSearch(false)
            }}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Reset"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Add/Update Profile Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Profile" : "Add Profile"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Row 1 - First three fields */}
              <div>
                <label className="font-bold">Name</label>
                <input
                  type="text"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="font-bold">Designation</label>
                <input
                  type="text"
                  value={formState.designation}
                  onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div>
                <label className="font-bold">Present Post</label>
                <input
                  type="text"
                  value={formState.presentPost}
                  onChange={(e) => setFormState({ ...formState, presentPost: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                />
              </div>

              {/* Row 2 - Next three fields */}
              <div>
                <label className="font-bold">Posting District</label>
                <input
                  type="text"
                  value={formState.postingDistrict}
                  onChange={(e) => setFormState({ ...formState, postingDistrict: e.target.value })}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="font-bold">Posting Taluka</label>
                <input
                  type="text"
                  value={formState.postingTaluka}
                  onChange={(e) => setFormState({ ...formState, postingTaluka: e.target.value })}
                  className="p-2 border rounded w-full"
                />
              </div>
              <div>
                <label className="font-bold">Home District</label>
                <input
                  type="text"
                  value={formState.homeDistrict}
                  onChange={(e) => setFormState({ ...formState, homeDistrict: e.target.value })}
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            {/* Centered Submit Button */}
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isEditing ? "Update Profile" : "Add Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Profiles Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">Profiles List</h3>
        </div>
        <div className="p-6 overflow-x-auto">
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Designation</th>
                <th className="border px-4 py-2">Present Post</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.length > 0 ? (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id}>
                    <td className="border px-4 py-2">{profile.name}</td>
                    <td className="border px-4 py-2">{profile.designation}</td>
                    <td className="border px-4 py-2">{profile.presentPost}</td>
                    <td className="border px-4 py-2 flex space-x-2">
                      <button
                        onClick={() => handleEditProfile(profile.id)}
                        className="p-2 bg-green-500 text-white rounded-md"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDeleteProfile(profile.id)}
                        className="p-2 bg-red-500 text-white rounded-md"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                      <button
                        onClick={() => handleToggleStatus(profile.id, profile.approvalStatus)}
                        className={`p-2 ${
                          profile.approvalStatus === "Approved" ? "bg-blue-500" : "bg-yellow-500"
                        } text-white rounded-md`}
                        title={profile.approvalStatus === "Approved" ? "Set Pending" : "Approve"}
                      >
                        {profile.approvalStatus === "Approved" ? <FaTimes /> : <FaCheck />}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4">
                    No profiles found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MCSOfficerProfileList;
