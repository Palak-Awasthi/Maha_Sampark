import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const DistrictMaster = () => {
  const [districts, setDistricts] = useState([]);
  const [formState, setFormState] = useState({ stateName: "", districtName: "" });
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
    const trimmedStateName = formState.stateName.trim();
    const trimmedDistrictName = formState.districtName.trim();

    if (!trimmedStateName || !trimmedDistrictName) {
      toast.error("Both State Name and District Name fields are required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      const districtData = { state: trimmedStateName, district: trimmedDistrictName };
      
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/districts/${isEditing}`, districtData);
        toast.success("District updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/districts", districtData);
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
    if (district) {
      setFormState({ stateName: district.state, districtName: district.district });
      setIsEditing(id);
    }
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

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const resetForm = () => {
    setFormState({ stateName: "", districtName: "" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const filteredDistricts = districts.filter((d) =>
    d.district && d.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">District Master</div>
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
                title="Refresh"
              >
                <FaSyncAlt />
              </button>
            </div>
          </div>

          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="State Name"
                value={formState.stateName}
                onChange={(e) => setFormState({ ...formState, stateName: e.target.value })}
                className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <input
                type="text"
                placeholder="District Name"
                value={formState.districtName}
                onChange={(e) => setFormState({ ...formState, districtName: e.target.value })}
                className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                required
              />
              <button
                type="submit"
                className={`p-2 bg-green-500 text-white rounded-md ${loading && "opacity-50 cursor-not-allowed"}`}
                disabled={loading}
              >
                {isEditing ? "Update District" : "Add District"}
              </button>
              {isEditing && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="p-2 bg-red-500 text-white rounded-md"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          {/* District Table Section */}
          <table className="min-w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">District</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((district) => (
                  <tr key={district.id}>
                    <td className="border px-4 py-2">{district.state}</td>
                    <td className="border px-4 py-2">{district.district}</td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleEditDistrict(district.id)}
                        className="text-blue-500 hover:underline"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteDistrict(district.id)}
                        className="text-red-500 hover:underline ml-2"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="border text-center py-4">No districts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default DistrictMaster;
