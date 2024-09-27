import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes, FaRedo } from "react-icons/fa"; // Import new icons
import { toast } from "react-toastify";
import Swal from "sweetalert2"; // Import SweetAlert
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const DistrictMaster = () => {
  const [districts, setDistricts] = useState([]);
  const [states, setStates] = useState([]);
  const [formState, setFormState] = useState({ stateId: "", districtName: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchDistricts();
    fetchStates();
  }, []);

  const fetchStates = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/states");
      setStates(response.data);
    } catch (error) {
      handleError(error);
    }
  };

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
    const { stateId, districtName } = formState;
    const trimmedDistrictName = districtName.trim();

    if (!stateId || !trimmedDistrictName) {
      toast.error("Both State and District Name fields are required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      const districtData = { state: { id: stateId }, districtName: trimmedDistrictName };

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
      setFormState({ stateId: district.state.id, districtName: district.districtName });
      setIsEditing(id);
    }
  };

  const handleDeleteDistrict = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
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

  const handleToggleStatus = async (id) => {
    const district = districts.find((d) => d.id === id);
    if (district) {
      const newStatus = district.status === "Active" ? "Inactive" : "Active";
      setLoading(true);
      try {
        await axios.put(`http://localhost:8080/api/districts/${id}/status`, { status: newStatus });
        setDistricts((prevDistricts) =>
          prevDistricts.map((d) =>
            d.id === id ? { ...d, status: newStatus } : d
          )
        );
        toast.success(`District status updated to ${newStatus}`);
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
    setFormState({ stateId: "", districtName: "" });
    setIsEditing(null);
  };

  const resetSearch = () => {
    setSearchTerm("");
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
    d.districtName && d.districtName.toLowerCase().includes(searchTerm.toLowerCase())
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
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-all hover:bg-blue-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch className="inline" /> {showSearch ? "Hide Search" : "Show Search"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center transition-all hover:bg-gray-600"
                onClick={() => {
                  resetSearch();
                  resetForm(); // Reset form fields when resetting search
                }}
              >
                <FaRedo className="mr-1" /> Reset
              </button>
            </div>
          </div>
          {/* Search Bar */}
          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Districts..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded p-2"
              />
            </div>
          )}
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <select
                value={formState.stateId}
                onChange={(e) => setFormState({ ...formState, stateId: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.state}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="District Name"
                value={formState.districtName}
                onChange={(e) => setFormState({ ...formState, districtName: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* District Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th> {/* New Sr. No. Column */}
                    <th className="border border-gray-300 p-2">District Name</th>
                    <th className="border border-gray-300 p-2">State</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDistricts.map((district, index) => (
                    <tr key={district.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td> {/* Serial Number */}
                      <td className="border border-gray-300 p-2">{district.districtName}</td>
                      <td className="border border-gray-300 p-2">{district.state.state}</td>
                      <td className="border border-gray-300 p-2">{district.status}</td>
                      <td className="border border-gray-300 p-2 flex gap-2">
                        <button
                          className="text-yellow-500 hover:text-yellow-700 transition-all"
                          onClick={() => handleEditDistrict(district.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500 hover:text-red-700 transition-all"
                          onClick={() => handleDeleteDistrict(district.id)}
                        >
                          <FaTrash />
                        </button>
                        <button
                          className={`text-${district.status === "Active" ? "green" : "gray"}-500 hover:text-${district.status === "Active" ? "green" : "gray"}-700 transition-all`}
                          onClick={() => handleToggleStatus(district.id)}
                        >
                          {district.status === "Active" ? <FaCheck /> : <FaTimes />}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default DistrictMaster;
