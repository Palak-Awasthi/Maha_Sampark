import React, { useState, useEffect } from "react";
import axios from "axios";
import swal from "sweetalert"; // Importing SweetAlert
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const DistrictMaster = () => {
  const [districts, setDistricts] = useState([]);
  const [formState, setFormState] = useState({ state: "", district: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/districts");
      setDistricts(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateDistrict = async () => {
    if (!formState.state || !formState.district) {
      swal("Error", "Both state and district fields are required!", "error");
      return;
    }

    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/districts/${isEditing}`, formState);
        swal("Success", "District updated successfully!", "success");
      } else {
        response = await axios.post("http://localhost:8080/api/districts", formState);
        swal("Success", "District added successfully!", "success");
      }

      if (response.status === 200 || response.status === 201) {
        fetchDistricts();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateDistrict();
  };

  const handleEditDistrict = (id) => {
    const district = districts.find((d) => d.id === id);
    setFormState({
      state: district.state,
      district: district.district,
    });
    setIsEditing(id);
  };

  const handleDeleteDistrict = async (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this district!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then(async (willDelete) => {
      if (willDelete) {
        try {
          await axios.delete(`http://localhost:8080/api/districts/${id}`);
          setDistricts(districts.filter((d) => d.id !== id));
          swal("Success", "District deleted successfully!", "success");
        } catch (error) {
          handleError(error);
        }
      }
    });
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/districts/${id}/status`, { status: newStatus });
      fetchDistricts();
      swal("Success", `District status updated to ${newStatus} successfully!`, "success");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDistricts = districts.filter((d) =>
    d.district?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ state: "", district: "" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      swal("Error", `${error.response.status} - ${error.response.data.message || "An error occurred."}`, "error");
    } else if (error.request) {
      swal("Error", "No response received from the server. Please try again.", "error");
    } else {
      swal("Error", "An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">District</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search District"
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

      {/* Add/Update District Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit District" : "Add District"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">State</label>
                <input
                  type="text"
                  value={formState.state}
                  onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
              <div className="flex flex-col">
                <label className="mb-1 font-medium">District</label>
                <input
                  type="text"
                  value={formState.district}
                  onChange={(e) => setFormState({ ...formState, district: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* District List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 hover:text-black cursor-pointer">ID</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">State</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">District</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Status</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((district) => (
                <tr key={district.id}>
                  <td className="px-4 py-2">{district.id}</td>
                  <td className="px-4 py-2">{district.state}</td>
                  <td className="px-4 py-2">{district.district}</td>
                  <td className="px-4 py-2">{district.status}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleEditDistrict(district.id)}
                      className="p-2 bg-yellow-500 text-white rounded-md mr-2"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteDistrict(district.id)}
                      className="p-2 bg-red-500 text-white rounded-md mr-2"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                    <button
                      onClick={() => handleToggleStatus(district.id, district.status)}
                      className={`p-2 text-white rounded-md mr-2 ${
                        district.status === "Active" ? "bg-green-500" : "bg-gray-500"
                      }`}
                      title={district.status === "Active" ? "Deactivate" : "Activate"}
                    >
                      {district.status === "Active" ? <FaTimes /> : <FaCheck />}
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

export default DistrictMaster;
