import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaSyncAlt, FaCheck, FaTimes } from "react-icons/fa";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";

const MaharashtraGovtOfficers = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState({
    name: "",
    officeName: "",
    districtName: "",
    talukaName: "",
    stdCode: "",
    landline: "",
  });

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/gom");
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

  const resetForm = () => {
    setSearchQuery({
      name: "",
      officeName: "",
      districtName: "",
      talukaName: "",
      stdCode: "",
      landline: "",
    });
    setFilteredProfiles(profiles);
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#007BFF',
        color: '#FFFFFF',
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
      },
    },
  };

  // Updated column names
  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Designation", selector: (row) => row.designation, sortable: true },
    { name: "Mobile Number 1", selector: (row) => row.mobileNumber1, sortable: true },
    { name: "Mobile Number 2", selector: (row) => row.mobileNumber2, sortable: true },
    { name: "Posting District Location", selector: (row) => row.postingDistrictLocation, sortable: true },
    { name: "Posting Taluka", selector: (row) => row.postingTaluka, sortable: true },
    { name: "Date of Birth", selector: (row) => new Date(row.dateOfBirth).toLocaleDateString(), sortable: true },
    { name: "Other Information", selector: (row) => row.otherInformation, sortable: true },
    { name: "Department", selector: (row) => row.department, sortable: true }
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
            <div className="text-2xl sm:text-3xl font-bold">Maharashtra Govt Officers Profile List</div>
            <button
              onClick={resetForm}
              className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
              title="Reset"
            >
              <FaSyncAlt />
            </button>
          </div>

          {/* Search Fields */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white p-2 rounded-md">
              <h3 className="text-lg font-semibold mb-2">Search Profiles</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-striped-pattern">
              {/* First Row */}
              <div>
                <label className="font-bold">Name</label>
                <input
                  type="text"
                  name="name"
                  value={searchQuery.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">Office Name</label>
                <input
                  type="text"
                  name="officeName"
                  value={searchQuery.officeName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">District Name</label>
                <input
                  type="text"
                  name="districtName"
                  value={searchQuery.districtName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>

              {/* Second Row */}
              <div>
                <label className="font-bold">Taluka Name</label>
                <input
                  type="text"
                  name="talukaName"
                  value={searchQuery.talukaName}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">STD Code</label>
                <input
                  type="text"
                  name="stdCode"
                  value={searchQuery.stdCode}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
              <div>
                <label className="font-bold">Landline</label>
                <input
                  type="text"
                  name="landline"
                  value={searchQuery.landline}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md w-full"
                />
              </div>
            </div>
          </div>

          {/* Data Table */}
          <DataTable
            columns={columns}
            data={filteredProfiles}
            customStyles={customStyles}
            pagination
            highlightOnHover
            striped
          />
        </div>
        <AdminFooter />
      </div>
      <ToastContainer />
    </div>
  );
};

export default MaharashtraGovtOfficers;
