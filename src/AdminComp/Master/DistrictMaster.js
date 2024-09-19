import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";

const DistrictMaster = () => {
  const [districts, setDistricts] = useState([]);
  const [formState, setFormState] = useState({ stateName: "", districtName: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDistricts();
  }, []);

  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/districts");
      setDistricts(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateDistrict = async () => {
    if (!formState.stateName || !formState.districtName) {
      toast.error("Both State Name and District Name fields are required!");
      return;
    }

    setLoading(true);
    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/districts/${isEditing}`, formState);
        toast.success("District updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/districts", formState);
        toast.success("District added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchDistricts();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateDistrict();
  };

  const handleEditDistrict = (id) => {
    const district = districts.find((d) => d.id === id);
    setFormState({ stateName: district.stateName, districtName: district.districtName, status: district.status });
    setIsEditing(id);
  };

  const handleDeleteDistrict = async (id) => {
    if (window.confirm("Are you sure you want to delete this district?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/districts/${id}`);
        setDistricts(districts.filter((d) => d.id !== id));
        toast.success("District deleted successfully!");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/districts/${id}/status`, { status: newStatus });
      fetchDistricts();
      toast.success(`District status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDistricts = districts.filter((d) =>
    d.districtName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ stateName: "", districtName: "", status: "Active" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      toast.error("No response received from the server. Please try again.");
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl font-bold">District Master</marquee>
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
              <div className="flex flex-col md:flex-row md:space-x-4">
                <div className="flex flex-col w-full">
                  <label className="mb-1 font-medium">State Name</label>
                  <input
                    type="text"
                    value={formState.stateName}
                    onChange={(e) => setFormState({ ...formState, stateName: e.target.value })}
                    className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                    required
                  />
                </div>
                <div className="flex flex-col w-full">
                  <label className="mb-1 font-medium">District Name</label>
                  <input
                    type="text"
                    value={formState.districtName}
                    onChange={(e) => setFormState({ ...formState, districtName: e.target.value })}
                    className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-center mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                disabled={loading} // Disable button while loading
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

     

      {/* District List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Sr No</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">State Name</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">District Name</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Status</th>
                <th className="px-6 py-3 text-center  hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.map((district, index) => (
                <tr key={district.id} className="border-b">
                  <td className="px-6 py-3 text-center">{index + 1}</td>
                  <td className="px-6 py-3 text-center">{district.stateName}</td>
                  <td className="px-6 py-3 text-center">{district.districtName}</td>
                  <td className="px-6 py-3 text-center">
                    <span className={`font-bold ${district.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                      {district.status}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-center">
                    <div className="flex justify-center space-x-4">
                      <span onClick={() => handleEditDistrict(district.id)} className="cursor-pointer text-blue-500" title="Edit">
                        <FaEdit />
                      </span>
                      <span onClick={() => handleToggleStatus(district.id, district.status)} className="cursor-pointer" title="Toggle Status">
                        {district.status === "Active" ? <FaTimes className="text-red-500" /> : <FaCheck className="text-green-500" />}
                      </span>
                      <span onClick={() => handleDeleteDistrict(district.id)} className="cursor-pointer text-red-500" title="Delete">
                        <FaTrash />
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
  );
};

export default DistrictMaster;
 