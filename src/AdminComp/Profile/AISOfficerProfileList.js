import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa"; // Import necessary icons
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const AISOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    cadre: "",
    postingState: "",
    postingDistrictLocation: "",
    batchYearOfAppointment: "",
    homeState: "",
    payMatrixLevel: "",
    sourceOfRecruitment: "",
  });

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/ais");
      setProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    filterProfiles({ ...formState, [name]: value });
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
    setFormState({
      name: "",
      designation: "",
      cadre: "",
      postingState: "",
      postingDistrictLocation: "",
      batchYearOfAppointment: "",
      homeState: "",
      payMatrixLevel: "",
      sourceOfRecruitment: "",
    });
    fetchProfiles();
  };

  const handleError = (error) => {
    console.error("Error:", error);
    const message = error.response
      ? `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`
      : "An unexpected error occurred. Please try again.";
    alert(message);
  };

  const handleView = (id) => {
    console.log(`View profile with ID: ${id}`);
  };

  const handleEdit = (id) => {
    console.log(`Edit profile with ID: ${id}`);
  };

  const handleDelete = (id) => {
    console.log(`Delete profile with ID: ${id}`);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold">AIS Officers Profile List</h1>
            <button
              onClick={resetForm}
              className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
              title="Reset"
            >
              <FaSyncAlt />
            </button>
          </div>
          <div className="p-6">
            {/* Search Fields */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(formState).map((key) => (
                  <div key={key}>
                    <label className="font-bold">{key.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type="text"
                      name={key}
                      value={formState[key]}
                      onChange={handleInputChange}
                      className="border p-1 rounded-md w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Responsive Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border table-auto">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="py-2 px-4 border">ID</th>
                    <th className="py-2 px-4 border">Name</th>
                    <th className="py-2 px-4 border">Designation</th>
                    <th className="py-2 px-4 border">ID Number</th>
                    <th className="py-2 px-4 border">Present Posting</th>
                    <th className="py-2 px-4 border">Mobile Number 1</th>
                    <th className="py-2 px-4 border">Mobile Number 2</th>
                    <th className="py-2 px-4 border">Batch Year of Appointment</th>
                    <th className="py-2 px-4 border">Cadre State</th>
                    <th className="py-2 px-4 border">Posting State</th>
                    <th className="py-2 px-4 border">Posting District Location</th>
                    <th className="py-2 px-4 border">Date of Birth</th>
                    <th className="py-2 px-4 border">Date of Appointment</th>
                    <th className="py-2 px-4 border">Date of Present Posting</th>
                    <th className="py-2 px-4 border">Home State</th>
                    <th className="py-2 px-4 border">Source of Recruitment</th>
                    <th className="py-2 px-4 border">Pay Matrix Level</th>
                    <th className="py-2 px-4 border">Email ID</th>
                    <th className="py-2 px-4 border">Educational Qualification</th>
                    <th className="py-2 px-4 border">Information Updated Date</th>
                    <th className="py-2 px-4 border">Past Posting</th>
                    <th className="py-2 px-4 border">Other Information</th>
                    <th className="py-2 px-4 border">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProfiles.map((profile) => (
                    <tr key={profile.id} className="border">
                      <td className="py-2 px-4 border">{profile.id}</td>
                      <td className="py-2 px-4 border">{profile.name}</td>
                      <td className="py-2 px-4 border">{profile.designation}</td>
                      <td className="py-2 px-4 border">{profile.idNumber}</td>
                      <td className="py-2 px-4 border">{profile.presentPosting}</td>
                      <td className="py-2 px-4 border">{profile.mobileNumber1}</td>
                      <td className="py-2 px-4 border">{profile.mobileNumber2}</td>
                      <td className="py-2 px-4 border">{profile.batchYearOfAppointment}</td>
                      <td className="py-2 px-4 border">{profile.cadreState}</td>
                      <td className="py-2 px-4 border">{profile.postingState}</td>
                      <td className="py-2 px-4 border">{profile.postingDistrictLocation}</td>
                      <td className="py-2 px-4 border">{profile.dateOfBirth}</td>
                      <td className="py-2 px-4 border">{profile.dateOfAppointment}</td>
                      <td className="py-2 px-4 border">{profile.dateOfPresentPosting}</td>
                      <td className="py-2 px-4 border">{profile.homeState}</td>
                      <td className="py-2 px-4 border">{profile.sourceOfRecruitment}</td>
                      <td className="py-2 px-4 border">{profile.payMatrixLevel}</td>
                      <td className="py-2 px-4 border">{profile.emailId}</td>
                      <td className="py-2 px-4 border">{profile.educationalQualification}</td>
                      <td className="py-2 px-4 border">{profile.informationUpdatedDate}</td>
                      <td className="py-2 px-4 border">{profile.pastPosting}</td>
                      <td className="py-2 px-4 border">{profile.otherInformation}</td>
                      <td className="py-2 px-4 border text-center">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleView(profile.id)}
                            className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition-transform transform hover:scale-105"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => handleEdit(profile.id)}
                            className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-transform transform hover:scale-105"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDelete(profile.id)}
                            className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition-transform transform hover:scale-105"
                          >
                            <FaTrash />
                          </button>
                        </div>
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
      <ToastContainer />
    </div>
  );
};

export default AISOfficerProfileList;
