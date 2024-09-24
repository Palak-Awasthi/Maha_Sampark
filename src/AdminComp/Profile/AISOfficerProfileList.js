import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
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
    // Implement view functionality
    console.log(`View profile with ID: ${id}`);
  };

  const handleEdit = (id) => {
    // Implement edit functionality
    console.log(`Edit profile with ID: ${id}`);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log(`Delete profile with ID: ${id}`);
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Designation", selector: (row) => row.designation, sortable: true },
    { name: "ID Number", selector: (row) => row.idNumber, sortable: true },
    { name: "Present Posting", selector: (row) => row.presentPosting, sortable: true },
    { name: "Mobile Number 1", selector: (row) => row.mobileNumber1, sortable: true },
    { name: "Mobile Number 2", selector: (row) => row.mobileNumber2, sortable: true },
    { name: "Batch Year of Appointment", selector: (row) => row.batchYearOfAppointment, sortable: true },
    { name: "Cadre State", selector: (row) => row.cadreState, sortable: true },
    { name: "Posting State", selector: (row) => row.postingState, sortable: true },
    { name: "Posting District Location", selector: (row) => row.postingDistrictLocation, sortable: true },
    { name: "Date of Birth", selector: (row) => row.dateOfBirth, sortable: true },
    { name: "Date of Appointment", selector: (row) => row.dateOfAppointment, sortable: true },
    { name: "Date of Present Posting", selector: (row) => row.dateOfPresentPosting, sortable: true },
    { name: "Home State", selector: (row) => row.homeState, sortable: true },
    { name: "Source of Recruitment", selector: (row) => row.sourceOfRecruitment, sortable: true },
    { name: "Pay Matrix Level", selector: (row) => row.payMatrixLevel, sortable: true },
    { name: "Email ID", selector: (row) => row.emailId, sortable: true },
    { name: "Educational Qualification", selector: (row) => row.educationalQualification, sortable: true },
    { name: "Information Updated Date", selector: (row) => row.informationUpdatedDate, sortable: true },
    { name: "Past Posting", selector: (row) => row.pastPosting, sortable: true },
    { name: "Other Information", selector: (row) => row.otherInformation, sortable: true },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button
            onClick={() => handleView(row.id)}
            className="p-1 bg-green-500 text-white rounded-md hover:bg-green-600 transition"
            title="View"
          >
            <FaEye />
          </button>
          <button
            onClick={() => handleEdit(row.id)}
            className="p-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
            title="Edit"
          >
            <FaEdit />
          </button>
          <button
            onClick={() => handleDelete(row.id)}
            className="p-1 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
            title="Delete"
          >
            <FaTrash />
          </button>
        </div>
      ),
    },
  ];

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
            </div>
           

           <div>
            {/* DataTable for displaying profiles */}
            <DataTable
              columns={columns}
              data={filteredProfiles}
              pagination
              striped
              highlightOnHover
              dense
              customStyles={{
                headRow: {
                  style: {
                    backgroundColor: '#1E90FF',
                    color: 'white',
                    fontWeight: 'bold',
                  },
                },
                cells: {
                  style: {
                    fontSize: '14px',
                  },
                },
              }}
            />
            </div>
            <ToastContainer />
         
          <AdminFooter />
        </div>
      </div>
    </div>
  );
};

export default AISOfficerProfileList;
