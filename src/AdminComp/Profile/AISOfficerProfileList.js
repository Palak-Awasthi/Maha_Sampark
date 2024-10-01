import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSyncAlt, FaTrash } from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Swal from "sweetalert2"; // Import SweetAlert

const inputConfig = {
  name: { type: "text", placeholder: "Enter Name" },
  designation: {
    type: "select",
    options: [],
    placeholder: "Select Designation"
  },
  cadreState: {
    type: "select",
    options: [],
    placeholder: "Select Cadre"
  },
  postingState: {
    type: "select",
    options: [],
    placeholder: "Select Posting State"
  },
  postingDistrictLocation: {
    type: "select",
    options: [],
    placeholder: "Select Posting District Location"
  },
  batchYearOfAppointment: {
    type: "select",
    options: [],
    placeholder: "Select Batch Year of Appointment"
  },
  homeState: {
    type: "select",
    options: [],
    placeholder: "Select Home State"
  },
  payMatrixLevel: {
    type: "select",
    options: [],
    placeholder: "Select Pay Matrix Level"
  },
  sourceOfRecruitment: {
    type: "select",
    options: [],
    placeholder: "Select Source of Recruitment"
  }
};

const AISOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [formState, setFormState] = useState({});
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
    setFormState({});
    fetchProfiles();
  };

  const handleError = (error) => {
    console.error("Error:", error);
    const message = error.response
      ? `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`
      : "An unexpected error occurred. Please try again.";
    toast.error(message);
  };

  const handleDelete = async (id) => {
    const confirmDelete = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (confirmDelete.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/ais/${id}`);
        toast.success("Profile deleted successfully.");
        fetchProfiles();
      } catch (error) {
        handleError(error);
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <ToastContainer />
      <div className="flex flex-1 overflow-hidden">
        <AdminSidebar />
        <div className="flex-1 flex flex-col max-w-7xl mx-auto">
          <AdminHeader />
          <div className="container mx-auto p-4 max-w-7xl flex-grow">
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
                  {Object.keys(inputConfig).map((key) => {
                    const { type, placeholder, options } = inputConfig[key];
                    return (
                      <div className="flex flex-col" key={key}>
                        <label className="font-bold">{key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, ' $1')}</label>
                        {type === "text" ? (
                          <input
                            type="text"
                            name={key}
                            value={formState[key] || ""}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md"
                            placeholder={placeholder}
                          />
                        ) : (
                          <select
                            name={key}
                            value={formState[key] || ""}
                            onChange={handleInputChange}
                            className="p-2 border rounded-md"
                          >
                            <option value="">{placeholder}</option>
                            {options && options.map((option) => (
                              <option key={option} value={option}>{option}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Table Section */}
              <div className="flex-grow overflow-auto">
                <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                  <thead className="bg-blue-500 text-white">
                    <tr>
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
                        <td className="py-2 px-4 border-b">
                          <button
                            onClick={() => handleDelete(profile.id)}
                            className="text-red-500 hover:text-red-700"
                            title="Delete"
                          >
                            <FaTrash />
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
