import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaEye, FaEdit, FaTrash } from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
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

    // Update form state
    setFormState((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Filter profiles immediately based on the updated form state
    filterProfiles({ ...formState, [name]: value });
  };

  const filterProfiles = (searchValues) => {
    const filtered = profiles.filter((profile) => {
      return Object.keys(searchValues).every((key) => {
        if (!searchValues[key]) return true; // If the input is empty, do not filter
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
    toast.error(message); // Use toast instead of alert
  };

  const handleView = (id) => {
    console.log(`View profile with ID: ${id}`);
    // Implement view functionality (e.g., navigate to a profile detail page)
  };

  const handleEdit = (id) => {
    console.log(`Edit profile with ID: ${id}`);
    // Implement edit functionality (e.g., open a modal or navigate to an edit page)
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/ais/${id}`);
      toast.success("Profile deleted successfully.");
      fetchProfiles();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden"> {/* Main page structure, remove vertical scroll */}
      <ToastContainer />
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col max-w-7xl mx-auto">
          <AdminHeader />
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-bold">AIS Officers Profile List</h1>
              <button
                onClick={resetForm}
                className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
                title="Reset"
              >
                <FaSyncAlt />
              </button>
            </div>

            {/* Search Fields */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-4">
              <div className="bg-blue-500 text-white p-2 rounded-md">
                <h3 className="text-lg font-semibold mb-2">Search Profiles</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {Object.keys(formState).map((key) => (
                  <div className="flex flex-col" key={key}>
                    <label className="font-bold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                    <input
                      type="text"
                      name={key}
                      value={formState[key]}
                      onChange={handleInputChange}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Table with only Horizontal and Vertical Scrolling */}
            <div className="overflow-x-auto"> {/* Horizontal scroll */}
              <div className="overflow-y-auto max-h-96"> {/* Vertical scroll only for table */}
                <table className="min-w-full bg-white border border-gray-200">
                  <thead>
                    <tr className="bg-blue-500 text-white">
                      {["ID", "Name", "Designation", "ID Number", "Present Posting", "Mobile Number 1", "Mobile Number 2", "Batch Year of Appointment", "Cadre State", "Posting State", "Posting District Location", "Date of Birth", "Date of Appointment", "Date of Present Posting", "Home State", "Source of Recruitment", "Pay Matrix Level", "Email ID", "Educational Qualification", "Information Updated Date", "Past Posting", "Other Information", "Actions"].map((header) => (
                        <th className="py-2 px-4 border" key={header}>{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProfiles.map((profile) => (
                      <tr key={profile.id}>
                        <td className="py-2 px-4 border-b">{profile.id}</td>
                        <td className="py-2 px-4 border-b">{profile.name}</td>
                        <td className="py-2 px-4 border-b">{profile.designation}</td>
                        <td className="py-2 px-4 border-b">{profile.idNumber}</td>
                        <td className="py-2 px-4 border-b">{profile.presentPosting}</td>
                        <td className="py-2 px-4 border-b">{profile.mobileNumber1}</td>
                        <td className="py-2 px-4 border-b">{profile.mobileNumber2}</td>
                        <td className="py-2 px-4 border-b">{profile.batchYearOfAppointment}</td>
                        <td className="py-2 px-4 border-b">{profile.cadreState}</td>
                        <td className="py-2 px-4 border-b">{profile.postingState}</td>
                        <td className="py-2 px-4 border-b">{profile.postingDistrictLocation}</td>
                        <td className="py-2 px-4 border-b">{profile.dateOfBirth}</td>
                        <td className="py-2 px-4 border-b">{profile.dateOfAppointment}</td>
                        <td className="py-2 px-4 border-b">{profile.dateOfPresentPosting}</td>
                        <td className="py-2 px-4 border-b">{profile.homeState}</td>
                        <td className="py-2 px-4 border-b">{profile.sourceOfRecruitment}</td>
                        <td className="py-2 px-4 border-b">{profile.payMatrixLevel}</td>
                        <td className="py-2 px-4 border-b">{profile.emailId}</td>
                        <td className="py-2 px-4 border-b">{profile.educationalQualification}</td>
                        <td className="py-2 px-4 border-b">{profile.informationUpdatedDate}</td>
                        <td className="py-2 px-4 border-b">{profile.pastPosting}</td>
                        <td className="py-2 px-4 border-b">{profile.otherInformation}</td>
                        <td className="py-2 px-4 border-b flex space-x-2">
                          <button onClick={() => handleView(profile.id)} title="View">
                            <FaEye className="text-green-500" />
                          </button>
                          <button onClick={() => handleEdit(profile.id)} title="Edit">
                            <FaEdit className="text-blue-500" />
                          </button>
                          <button onClick={() => handleDelete(profile.id)} title="Delete">
                            <FaTrash className="text-red-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
