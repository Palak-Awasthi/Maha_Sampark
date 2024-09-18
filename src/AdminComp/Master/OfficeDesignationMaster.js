import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrashAlt, FaSearch, FaSyncAlt, FaCheck, FaTimes } from "react-icons/fa";
import Swal from 'sweetalert2';  // Import SweetAlert

const OfficeDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({
    mainDepartment: "",
    designation: "",
  });

  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch designations from the API on component mount
  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/designation/all"); 
      setDesignations(response.data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const handleAddDesignation = async () => {
    if (!formState.mainDepartment || !formState.designation) {
      Swal.fire("Error", "Both fields are required!", "error");  // Show error alert
      return;
    }

    try {
      const response = await axios.post("http://localhost:8080/api/designation/save", formState); 
      setDesignations([...designations, response.data]);
      setFormState({ mainDepartment: "", designation: "" });

      Swal.fire("Success", "Designation added successfully!", "success");  // Show success alert
    } catch (error) {
      console.error("Error adding designation:", error);
      Swal.fire("Error", "There was an error adding the designation.", "error");  // Show error alert
    }
  };

  const handleEditDesignation = (id) => {
    const designation = designations.find((d) => d.id === id);
    setFormState({
      mainDepartment: designation.mainDepartment,
      designation: designation.designation,
    });
  };

  const handleDeleteDesignation = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/designation/delete/${id}`);
          setDesignations(designations.filter((d) => d.id !== id));

          Swal.fire("Deleted!", "Designation has been deleted.", "success");  // Show success alert
        } catch (error) {
          console.error("Error deleting designation:", error);
          Swal.fire("Error", "There was an error deleting the designation.", "error");  // Show error alert
        }
      }
    });
  };

  const toggleStatus = async (id) => {
    try {
      const response = await axios.put(`http://localhost:8080/api/designation/toggle-status/${id}`); 
      setDesignations(
        designations.map((d) =>
          d.id === id ? { ...d, status: response.data.status } : d
        )
      );
    } catch (error) {
      console.error("Error toggling status:", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDesignations = designations.filter((d) =>
    d.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Office</span>
            <span className="mx-2">Designation</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Designation"
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

      {/* Designation Form Section */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-xl font-semibold">Add Office Designation</h3>
        </div>

        <div className="p-6 grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Main Department</label>
            <select
              value={formState.mainDepartment}
              onChange={(e) => setFormState({ ...formState, mainDepartment: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Main Department</option>
              <option value="Revenue Department">Revenue Department</option>
              <option value="Finance Department">Finance Department</option>
              <option value="Forest Department">Forest Department</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Designation</label>
            <input
              type="text"
              placeholder="Designation Name"
              value={formState.designation}
              onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex justify-center col-span-2 mt-4">
            <button
              onClick={handleAddDesignation}
              className="bg-blue-500 text-white p-2 rounded w-32"
            >
              Submit
            </button>
          </div>
        </div>
      </div>

      {/* Designation Table Section */}
      <table className="w-full bg-white rounded-lg shadow-md mb-6">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-4">Sr No</th>
            <th className="p-4">Main Department</th>
            <th className="p-4">Designation</th>
            <th className="p-4">Status</th>
            <th className="p-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredDesignations.map((d, index) => (
            <tr key={d.id} className="border-b">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{d.mainDepartment}</td>
              <td className="p-4">{d.designation}</td>
              <td className="p-4">
                <button
                  className={`p-2 rounded ${d.status ? "text-green-500" : "text-red-500"}`}
                  onClick={() => toggleStatus(d.id)}
                >
                  {d.status ? <FaCheck /> : <FaTimes />}
                </button>
              </td>
              <td className="p-4 space-x-2">
                <button onClick={() => handleEditDesignation(d.id)} className="text-blue-500">
                  <FaEdit />
                </button>
                <button onClick={() => handleDeleteDesignation(d.id)} className="text-red-500">
                  <FaTrashAlt />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OfficeDesignationMaster;
