import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const MaharashtraGovtOfficers = () => {
  const [officers, setOfficers] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    postingDistrict: "",
    homeState: "",
    yearOfAppointment: "",
    payScaleGroup: "",
    sourceOfRecruitment: "",
    phoneNumber: "",
    email: "",
    approvalStatus: "Pending"
  });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const homeStateOptions = ["State A", "State B", "State C"];
  const yearOfAppointmentOptions = ["2020", "2021", "2022", "2023", "2024"];
  const payScaleGroupOptions = ["Group A", "Group B", "Group C"];
  const sourceOfRecruitmentOptions = ["Exam", "Direct Recruitment", "Promotion"];

  useEffect(() => {
    fetchOfficers();
  }, []);

  const fetchOfficers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/officers");
      setOfficers(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateOfficer = async () => {
    if (!formState.name || !formState.designation) {
      alert("Name and Designation fields are required!");
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/officers/${isEditing}`, formState);
        alert("Officer updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/officers", formState);
        alert("Officer added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchOfficers();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateOfficer();
  };

  const handleEditOfficer = (id) => {
    const officer = officers.find((o) => o.id === id);
    setFormState({
      name: officer.name,
      designation: officer.designation,
      postingDistrict: officer.postingDistrict,
      homeState: officer.homeState,
      yearOfAppointment: officer.yearOfAppointment,
      payScaleGroup: officer.payScaleGroup,
      sourceOfRecruitment: officer.sourceOfRecruitment,
      phoneNumber: officer.phoneNumber,
      email: officer.email,
      approvalStatus: officer.approvalStatus
    });
    setIsEditing(id);
  };

  const handleDeleteOfficer = async (id) => {
    if (window.confirm("Are you sure you want to delete this officer?")) {
      try {
        await axios.delete(`http://localhost:8080/api/officers/${id}`);
        setOfficers(officers.filter((o) => o.id !== id));
        alert("Officer deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      await axios.put(`http://localhost:8080/api/officers/${id}/status`, { status: newStatus });
      fetchOfficers();
      alert(`Officer status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredOfficers = officers.filter((o) =>
    o.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({
      name: "",
      designation: "",
      postingDistrict: "",
      homeState: "",
      yearOfAppointment: "",
      payScaleGroup: "",
      sourceOfRecruitment: "",
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
            <span className="mx-2">Maharashtra Government</span>
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
              setSearchTerm("");
              setShowSearch(false);
            }}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Reset"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Add/Update Officer Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">
            {isEditing ? "Edit Officer" : "Add Officer"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Form Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                <input
                  type="text"
                  id="designation"
                  value={formState.designation}
                  onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                  placeholder="Designation"
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="postingDistrict" className="block text-gray-700"><strong>Posting District</strong></label>
                <input
                  type="text"
                  id="postingDistrict"
                  value={formState.postingDistrict}
                  onChange={(e) => setFormState({ ...formState, postingDistrict: e.target.value })}
                  placeholder="Posting District"
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="homeState" className="block text-gray-700"><strong>Home State</strong></label>
                <select
                  id="homeState"
                  value={formState.homeState}
                  onChange={(e) => setFormState({ ...formState, homeState: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Home State</option>
                  {homeStateOptions.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="yearOfAppointment" className="block text-gray-700"><strong>Year of Appointment</strong></label>
                <select
                  id="yearOfAppointment"
                  value={formState.yearOfAppointment}
                  onChange={(e) => setFormState({ ...formState, yearOfAppointment: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Year</option>
                  {yearOfAppointmentOptions.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="payScaleGroup" className="block text-gray-700"><strong>Pay Scale Group</strong></label>
                <select
                  id="payScaleGroup"
                  value={formState.payScaleGroup}
                  onChange={(e) => setFormState({ ...formState, payScaleGroup: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Pay Scale Group</option>
                  {payScaleGroupOptions.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="sourceOfRecruitment" className="block text-gray-700"><strong>Source of Recruitment</strong></label>
                <select
                  id="sourceOfRecruitment"
                  value={formState.sourceOfRecruitment}
                  onChange={(e) => setFormState({ ...formState, sourceOfRecruitment: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Source</option>
                  {sourceOfRecruitmentOptions.map((source, index) => (
                    <option key={index} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="phoneNumber" className="block text-gray-700"><strong>Phone Number</strong></label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={(e) => setFormState({ ...formState, phoneNumber: e.target.value })}
                  placeholder="Phone Number"
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="email" className="block text-gray-700"><strong>Email</strong></label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="Email"
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="approvalStatus" className="block text-gray-700"><strong>Approval Status</strong></label>
                <select
                  id="approvalStatus"
                  value={formState.approvalStatus}
                  onChange={(e) => setFormState({ ...formState, approvalStatus: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                </select>
              </div>
            </div>
            <div className="mt-6">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md">
                {isEditing ? "Update Officer" : "Add Officer"}
              </button>
          
            </div>
          </form>
        </div>
      </div>

      {/* Officers List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Officers List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="text-left py-2">Name</th>
                <th className="text-left py-2">Designation</th>
                <th className="text-left py-2">Posting District</th>
                <th className="text-left py-2">Home State</th>
                <th className="text-left py-2">Year of Appointment</th>
                <th className="text-left py-2">Phone Number</th>
                <th className="text-left py-2">Email</th>
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOfficers.map((officer) => (
                <tr key={officer.id}>
                  <td className="border-b py-2">{officer.name}</td>
                  <td className="border-b py-2">{officer.designation}</td>
                  <td className="border-b py-2">{officer.postingDistrict}</td>
                  <td className="border-b py-2">{officer.homeState}</td>
                  <td className="border-b py-2">{officer.yearOfAppointment}</td>
                  <td className="border-b py-2">{officer.phoneNumber}</td>
                  <td className="border-b py-2">{officer.email}</td>
                  <td className="border-b py-2">{officer.approvalStatus}</td>
                  <td className="border-b py-2 flex space-x-2">
                    <button onClick={() => handleEditOfficer(officer.id)} title="Edit">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteOfficer(officer.id)} title="Delete">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleToggleStatus(officer.id, officer.approvalStatus)} title="Toggle Status">
                      {officer.approvalStatus === "Approved" ? <FaTimes /> : <FaCheck />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MaharashtraGovtOfficers;
