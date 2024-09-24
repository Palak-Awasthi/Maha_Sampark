import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const NonOfficialTypeMaster = () => {
  const [types, setTypes] = useState([]);
  const [mainTypes, setMainTypes] = useState([]);
  const [form, setForm] = useState({ mainType: "", subType: "", status: "Inactive" });
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTypes();
    initializeMainTypes();
  }, []);

  // Fetch Non-Official Types
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/nonOfficialTypes");
      setTypes(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Initialize static main types
  const initializeMainTypes = () => {
    const staticMainTypes = [
      { id: "ais", name: "AIS" },
      { id: "ris", name: "RIS" },
      { id: "fis", name: "FIS" },
      { id: "itc", name: "ITC" },
    ];
    setMainTypes(staticMainTypes);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.mainType || !form.subType) {
      toast.error("Main Type and Sub-Type are required!");
      return;
    }

    setLoading(true);
    try {
      if (editingId) {
        await axios.put(`http://localhost:8080/api/nonOfficialTypes/${editingId}`, form);
        toast.success("Type updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/nonOfficialTypes", form);
        toast.success("Type added successfully!");
      }
      fetchTypes();
      resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const typeToEdit = types.find((type) => type.id === id);
    setForm({ mainType: typeToEdit.mainType, subType: typeToEdit.subType, status: typeToEdit.status });
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this type?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/nonOfficialTypes/${id}`);
        fetchTypes();
        toast.success("Type deleted successfully!");
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
      await axios.put(`http://localhost:8080/api/nonOfficialTypes/${id}/status`, { status: newStatus });
      fetchTypes();
      toast.success(`Type status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const resetForm = () => {
    setForm({ mainType: "", subType: "", status: "Inactive" });
    setEditingId(null);
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

  // Filter types based on the search term
  const filteredTypes = types.filter((type) =>
    type.mainType.toLowerCase().includes(searchTerm.toLowerCase())
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
              <marquee className="text-2xl font-bold">Non-Official Type Master</marquee>
            </div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search Type"
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

          {/* Add/Update Type Form */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
                {editingId ? "Edit Non-Official Type" : "Add Non-Official Type"}
              </h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Main Type</label>
                    <select
                      value={form.mainType}
                      onChange={(e) => setForm({ ...form, mainType: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                      required
                    >
                      <option value="">Select Main Type</option>
                      {mainTypes.map((mainType) => (
                        <option key={mainType.id} value={mainType.name}>
                          {mainType.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Sub-Type</label>
                    <input
                      type="text"
                      value={form.subType}
                      onChange={(e) => setForm({ ...form, subType: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                      placeholder="Enter Sub-Type"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
                    disabled={loading}
                  >
                    {editingId ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Non-Official Type Master Table */}
          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Sr No</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Main Type</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Sub-Type</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Status</th>
                    <th className="px-6 py-3 text-center hover:text-black cursor-pointer">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTypes.map((type, index) => (
                    <tr key={type.id} className="border-b">
                      <td className="px-6 py-3 text-center">{index + 1}</td>
                      <td className="px-6 py-3 text-center">{type.mainType}</td>
                      <td className="px-6 py-3 text-center">{type.subType}</td>
                      <td className="px-6 py-3 text-center">
                        <span className={`font-bold ${type.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                          {type.status}
                        </span>
                      </td>
                      <td className="px-6 py-3 text-center">
                        <div className="flex justify-center space-x-4">
                          <span onClick={() => handleEdit(type.id)} className="cursor-pointer text-blue-500" title="Edit">
                            <FaEdit />
                          </span>
                          <span onClick={() => handleToggleStatus(type.id, type.status)} className="cursor-pointer" title="Toggle Status">
                            {type.status === "Active" ? <FaTimes className="text-red-500" /> : <FaCheck className="text-green-500" />}
                          </span>
                          <span onClick={() => handleDelete(type.id)} className="cursor-pointer text-red-500" title="Delete">
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
        <AdminFooter />
      </div>
    </div>
  );
};

export default NonOfficialTypeMaster;
