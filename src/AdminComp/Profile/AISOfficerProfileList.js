import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaEdit, FaTrash } from "react-icons/fa";
import AdminHeader from "../AdminHeader"; // Import Header
import AdminFooter from "../AdminFooter"; // Import Footer
import AdminSidebar from "../AdminSidebar"; // Import Sidebar

const AISOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    postingDistrict: "",
    homeState: "",
    yearOfAppointment: "",
    payScaleGroup: "",
    sourceOfRecruitment: "",
    otherInfo: "",
    phoneNumber: "",
    email: "",
    approvalStatus: "Pending",
  });

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(formState);

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/profiles", {
          params: debouncedSearchTerm,
        });
        setProfiles(response.data);
      } catch (error) {
        handleError(error);
      }
    };

    fetchProfiles();
  }, [debouncedSearchTerm]);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(formState);
    }, 300); // Adjust delay as needed

    return () => {
      clearTimeout(handler);
    };
  }, [formState]);

  const resetForm = () => {
    setFormState({
      name: "",
      designation: "",
      postingDistrict: "",
      homeState: "",
      yearOfAppointment: "",
      payScaleGroup: "",
      sourceOfRecruitment: "",
      otherInfo: "",
      phoneNumber: "",
      email: "",
      approvalStatus: "Pending",
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
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
              <div className="text-2xl sm:text-3xl font-bold">
                <span className="mx-2">AIS Officers Profile List</span>
              </div>
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

            {/* Search Profile Form */}
            <div className="bg-white rounded-lg shadow-md mb-6">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
                <h3 className="text-lg sm:text-xl font-semibold">Search Profile</h3>
              </div>
              <div className="p-6">
                <form>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="col-span-1">
                      <label htmlFor="name" className="block text-gray-700"><strong>Name</strong></label>
                      <input
                        type="text"
                        id="name"
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                        placeholder="Name"
                        className="p-2 border rounded w-full"
                      />
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="designation" className="block text-gray-700"><strong>Designation</strong></label>
                      <select
                        id="designation"
                        value={formState.designation}
                        onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                        className="p-2 border rounded w-full"
                      >
                        <option value="">Select Designation</option>
                        <option value="IAS">IAS</option>
                        <option value="IPS">IPS</option>
                        <option value="IFS">IFS</option>
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="postingDistrict" className="block text-gray-700"><strong>Posting District</strong></label>
                      <select
                        id="postingDistrict"
                        value={formState.postingDistrict}
                        onChange={(e) => setFormState({ ...formState, postingDistrict: e.target.value })}
                        className="p-2 border rounded w-full"
                      >
                        <option value="">Select District</option>
                        <option value="District A">District A</option>
                        <option value="District B">District B</option>
                        <option value="District C">District C</option>
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                    <div className="col-span-1">
                      <label htmlFor="homeState" className="block text-gray-700"><strong>Home State</strong></label>
                      <select
                        id="homeState"
                        value={formState.homeState}
                        onChange={(e) => setFormState({ ...formState, homeState: e.target.value })}
                        className="p-2 border rounded w-full"
                      >
                        <option value="">Select State</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                    <div className="col-span-1">
                      <label htmlFor="yearOfAppointment" className="block text-gray-700"><strong>Year of Appointment</strong></label>
                      <select
                        id="yearOfAppointment"
                        value={formState.yearOfAppointment}
                        onChange={(e) => setFormState({ ...formState, yearOfAppointment: e.target.value })}
                        className="p-2 border rounded w-full"
                      >
                        <option value="">Select Year</option>
                        {/* Add more options as needed */}
                      </select>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Profiles List */}
            <div className="bg-white rounded-lg shadow-md">
              <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
                <h3 className="text-lg sm:text-xl font-semibold">Profiles List</h3>
              </div>
              <div className="p-6">
                {profiles.length === 0 ? (
                  <p>No profiles available.</p>
                ) : (
                  <table className="min-w-full">
                    <thead>
                      <tr>
                        <th className="border-b px-4 py-2">Name</th>
                        <th className="border-b px-4 py-2">Designation</th>
                        <th className="border-b px-4 py-2">Approval Status</th>
                        <th className="border-b px-4 py-2">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {profiles.map((profile) => (
                        <tr key={profile.id}>
                          <td className="border-b px-4 py-2">{profile.name}</td>
                          <td className="border-b px-4 py-2">{profile.designation}</td>
                          <td className="border-b px-4 py-2">{profile.approvalStatus}</td>
                          <td className="border-b px-4 py-2">
                            <button className="text-blue-500 hover:underline" title="Edit"><FaEdit /></button>
                            <button className="text-red-500 hover:underline ml-2" title="Delete"><FaTrash /></button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AISOfficerProfileList;
