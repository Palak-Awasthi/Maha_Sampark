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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProfiles();
  }, []);

  const debounce = (func, delay) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        func.apply(null, args);
      }, delay);
    };
  };

  const fetchProfiles = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/ais");
      setProfiles(response.data);
      setFilteredProfiles(response.data);
      setError(null);
    } catch (error) {
      handleError(error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = debounce((e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
    filterProfiles({ ...formState, [name]: value });
  }, 300);

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
    toast.error(message);
  };

  const handleView = (id) => {
    console.log(`View profile with ID: ${id}`);
  };

  const handleEdit = (id) => {
    console.log(`Edit profile with ID: ${id}`);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this profile?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:8080/api/ais/${id}`);
      toast.success("Profile deleted successfully.");
      fetchProfiles();
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col max-w-7xl mx-auto">
          <AdminHeader />
          <div className="container mx-auto p-4 max-w-7xl">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
              <div className="text-2xl sm:text-3xl font-bold">AIS Officers Profile List</div>
              <button
                onClick={resetForm}
                className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
                title="Reset"
              >
                <FaSyncAlt />
              </button>
            </div>
          
            {/* Main Content */}
            <div className="flex-1 flex flex-col p-6 overflow-hidden">
              
              {/* Search Profile Section */}
              <div className="bg-white rounded-lg shadow-md mb-4 p-4">
                <div className="bg-blue-500 text-white p-2 rounded-md">
                  <h3 className="text-lg font-semibold">Search Profiles</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
                  {Object.keys(formState).map((key) => (
                    <div className="flex flex-col" key={key}>
                      <label className="font-bold">{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</label>
                      {key === "name" ? (
                        <input
                          type="text"
                          name={key}
                          value={formState[key]}
                          onChange={handleInputChange}
                          className="p-2 border rounded-md"
                          placeholder={`Enter ${key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}`}
                        />
                      ) : (
                        <select
                          name={key}
                          value={formState[key]}
                          onChange={handleInputChange}
                          className="p-2 border rounded-md"
                        >
                          <option value="">Select {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}</option>
                          {/* Add options here for each field */}
                          {key === "designation" && (
                            <>
                              <option value="Officer">Officer</option>
                              <option value="Assistant">Assistant</option>
                              <option value="Director">Director</option>
                            </>
                          )}
                          {key === "cadre" && (
                            <>
                              <option value="Cadre 1">Cadre 1</option>
                              <option value="Cadre 2">Cadre 2</option>
                            </>
                          )}
                          {key === "postingState" && (
                            <>
                              <option value="State 1">State 1</option>
                              <option value="State 2">State 2</option>
                            </>
                          )}
                          {key === "postingDistrictLocation" && (
                            <>
                              <option value="District 1">District 1</option>
                              <option value="District 2">District 2</option>
                            </>
                          )}
                          {key === "batchYearOfAppointment" && (
                            <>
                              <option value="2020">2020</option>
                              <option value="2021">2021</option>
                              <option value="2022">2022</option>
                              <option value="2023">2023</option>
                            </>
                          )}
                          {key === "homeState" && (
                            <>
                              <option value="Home State 1">Home State 1</option>
                              <option value="Home State 2">Home State 2</option>
                            </>
                          )}
                          {key === "payMatrixLevel" && (
                            <>
                              <option value="Level 1">Level 1</option>
                              <option value="Level 2">Level 2</option>
                              <option value="Level 3">Level 3</option>
                              <option value="Level 4">Level 4</option>
                            </>
                          )}
                          {key === "sourceOfRecruitment" && (
                            <>
                              <option value="Source 1">Source 1</option>
                              <option value="Source 2">Source 2</option>
                            </>
                          )}
                        </select>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Table Section */}
              <div className="flex-grow overflow-auto">
                <table className="min-w-full bg-white border border-gray-200 overflow-y-auto">
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
                          <button onClick={() => handleView(profile.id)} className="text-blue-500"><FaEye /></button>
                          <button onClick={() => handleEdit(profile.id)} className="text-yellow-500"><FaEdit /></button>
                          <button onClick={() => handleDelete(profile.id)} className="text-red-500"><FaTrash /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {loading && <p className="text-center">Loading profiles...</p>}
                {error && <p className="text-red-500 text-center">{error}</p>}
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
