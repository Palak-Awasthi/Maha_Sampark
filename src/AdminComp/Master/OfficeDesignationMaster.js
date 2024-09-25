import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaSyncAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const OfficeDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({
    id: null, // To keep track of the id for editing
    mainDepartment: "",
    designation: "",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all designations when the component mounts
  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/designation/all");
      const data = await response.json();
      setDesignations(data);
    } catch (error) {
      console.error("Error fetching designations:", error);
    }
  };

  const handleAddDesignation = async () => {
    if (!formState.mainDepartment || !formState.designation) {
      alert("Both fields are required!");
      return;
    }

    const designationData = {
      mainDepartment: formState.mainDepartment,
      designation: formState.designation,
      status: "Inactive", // Default to Inactive
    };

    try {
      const response = await fetch(
        "http://localhost:8080/api/designation/save",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(designationData),
        }
      );
      const newDesignation = await response.json();
      setDesignations([...designations, newDesignation]);
      setFormState({ id: null, mainDepartment: "", designation: "" }); // Reset form
    } catch (error) {
      console.error("Error adding designation:", error);
    }
  };

  const handleEditDesignation = (id) => {
    const designation = designations.find((d) => d.id === id);
    setFormState({
      id: designation.id,
      mainDepartment: designation.mainDepartment,
      designation: designation.designation,
    });
  };

  const handleDeleteDesignation = async (id) => {
    if (window.confirm("Are you sure you want to delete this designation?")) {
      try {
        await fetch(`http://localhost:8080/api/designation/delete/${id}`, {
          method: "DELETE",
        });
        setDesignations(designations.filter((d) => d.id !== id));
      } catch (error) {
        console.error("Error deleting designation:", error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await fetch(`http://localhost:8080/api/designation/toggle-status/${id}`, {
        method: "PUT",
      });
      setDesignations(
        designations.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
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
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="relative overflow-hidden whitespace-nowrap">
              <marquee className="text-2xl font-bold">
                Other Office Designation Master
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
              {/* Main Department Dropdown */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Main Department</label>
                <select
                  value={formState.mainDepartment}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      mainDepartment: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select Main Department</option>
                  <option value="Revenue Department">Revenue Department</option>
                  <option value="Finance Department">Finance Department</option>
                  <option value="Forest Department">Forest Department</option>
                  {/* Add more options as needed */}
                </select>
              </div>

              {/* Designation Field */}
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Designation</label>
                <input
                  type="text"
                  placeholder="Designation Name"
                  value={formState.designation}
                  onChange={(e) =>
                    setFormState({ ...formState, designation: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              {/* Submit Button */}
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

          {/* Office Designation List Table */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">
                      Sr No
                    </th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">
                      Main Department
                    </th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">
                      Designation
                    </th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">
                      Status
                    </th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesignations.map((designation, index) => (
                    <tr key={designation.id} className="border-b">
                      <td className="px-6 py-3 text-center">{index + 1}</td>
                      <td className="px-6 py-3 text-center">
                        {designation.mainDepartment}
                      </td>
                      <td className="px-6 py-3 text-center">
                        {designation.designation}
                      </td>
                      <td className="px-6 py-3 text-center">
                        <span
                          className={`font-bold ${
                            designation.status === "Active"
                              ? "text-green-500"
                              : "text-red-500"
                          }`}
                        >
                          {designation.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center space-x-2">
                          <span
                            onClick={() =>
                              handleToggleStatus(
                                designation.id,
                                designation.status
                              )
                            }
                            className="cursor-pointer"
                            title={`Mark as ${
                              designation.status === "Active"
                                ? "Inactive"
                                : "Active"
                            }`}
                          >
                            {designation.status === "Active" ? (
                              <FaCheck className="text-green-400" />
                            ) : (
                              <FaTimes className="text-red-500" />
                            )}
                          </span>
                          <span
                            onClick={() =>
                              handleEditDesignation(designation.id)
                            }
                            className="cursor-pointer text-blue-500"
                            title="Edit"
                          >
                            <FaEdit />
                          </span>
                          <span
                            onClick={() =>
                              handleDeleteDesignation(designation.id)
                            }
                            className="cursor-pointer text-red-500"
                            title="Delete"
                          >
                            <FaTrashAlt />
                          </span>
                        </div>
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
  );
};

export default OfficeDesignationMaster;
