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

const MCSOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([]);
  const [filteredProfiles, setFilteredProfiles] = useState([]);
  const [searchQuery, setSearchQuery] = useState({});

  useEffect(() => {
    fetchProfiles();
  }, []);

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/mcs");
      setProfiles(response.data);
      setFilteredProfiles(response.data);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      toast.error("Failed to fetch profiles."); // Notify user of the error
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

  const handleDeleteProfile = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/profiles/${id}`);
        setProfiles(profiles.filter((p) => p.id !== id));
        setFilteredProfiles(filteredProfiles.filter((p) => p.id !== id));
        Swal.fire("Deleted!", "Profile has been deleted.", "success");
      } catch (error) {
        console.error("Error deleting profile:", error);
        toast.error("Failed to delete profile."); // Notify user of the error
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
      toast.success(`Profile status updated to ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating profile status:", error);
      toast.error("Failed to update status."); // Notify user of the error
    }
  };

  const resetForm = () => {
    setSearchQuery({});
    setFilteredProfiles(profiles);
  };

  const customStyles = {
    headRow: {
      style: {
        backgroundColor: '#007BFF', // Blue background for header
        color: '#FFFFFF', // White text for header
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
      },
    },
  };

  const columns = [
    { name: "ID", selector: (row) => row.id, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Designation", selector: (row) => row.designation, sortable: true },
    { name: "Present Posting", selector: (row) => row.presentPosting, sortable: true },
    { name: "Mobile Number 1", selector: (row) => row.mobileNumber1, sortable: true },
    { name: "Mobile Number 2", selector: (row) => row.mobileNumber2, sortable: true },
    { name: "Year of Joining", selector: (row) => row.yearOfJoiningPresentCadre, sortable: true },
    { name: "Posting District", selector: (row) => row.postingDistrictLocation, sortable: true },
    { name: "Posting Taluka", selector: (row) => row.postingTaluka, sortable: true },
    { name: "Home District", selector: (row) => row.homeDistrict, sortable: true },
    { name: "Home Taluka", selector: (row) => row.homeTaluka, sortable: true },
    { name: "Date of Birth", selector: (row) => row.dateOfBirth, sortable: true },
    { name: "Date of Joining Revenue Department", selector: (row) => row.dateOfJoiningRevenueDepartment, sortable: true },
    { name: "Date of Joining Present Posting", selector: (row) => row.dateOfJoiningPresentPosting, sortable: true },
    { name: "Information Data Updated Date", selector: (row) => row.informationDataUpdatedDate, sortable: true },
    { name: "Past Posting", selector: (row) => row.pastPosting, sortable: true },
    { name: "Other Information", selector: (row) => row.otherInformation, sortable: true },
    { name: "Educational Qualification", selector: (row) => row.educationalQualification, sortable: true },
    { name: "Email ID", selector: (row) => row.emailID, sortable: true },
    { name: "Actions", cell: (row) => (
      <>
        <button
          onClick={() => handleToggleStatus(row.id, row.status)}
          className="text-blue-500 hover:underline"
          title="Toggle Status"
        >
          <FaCheck className={`${row.status === "Approved" ? "text-green-500" : "text-red-500"}`} />
        </button>
        <button
          onClick={() => handleDeleteProfile(row.id)}
          className="text-red-500 hover:underline ml-2"
          title="Delete"
        >
          <FaTimes />
        </button>
      </>
    )},
  ];

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
            <div className="text-2xl sm:text-3xl font-bold">MCS Officers Profile List</div>
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
        {["name", "designation", "presentPosting"].map((field) => (
            <div key={field}>
                <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                    type="text"
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full" // Reduced padding
                />
            </div>
        ))}
        {["postingDistrictLocation", "postingTaluka", "homeDistrict"].map((field) => (
            <div key={field}>
                <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                    type="text"
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full" // Reduced padding
                />
            </div>
        ))}
        {["homeTaluka", "yearOfJoiningPresentCadre", "dateOfJoiningRevenueDepartment"].map((field) => (
            <div key={field}>
                <label className="font-bold">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input
                    type="text"
                    name={field}
                    value={searchQuery[field] || ""}
                    onChange={handleInputChange}
                    className="border p-1 rounded-md w-full" // Reduced padding
                />
            </div>
        ))}
    </div>
</div>


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

export default MCSOfficerProfileList;
