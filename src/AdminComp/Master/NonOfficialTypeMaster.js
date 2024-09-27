import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css'; // Import Toastify CSS
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";
import Swal from "sweetalert2"; // Import SweetAlert

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
    fetchMainTypes(); // Fetch main types from the API
  }, []);

  // Fetch Non-Official Types
  const fetchTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/nonOfficialTypes/all");
      setTypes(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Main Types from the API
  const fetchMainTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/nonofficialmaintypes");
      setMainTypes(response.data); // Set the fetched main types
    } catch (error) {
      handleError(error);
    }
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
        await axios.put(`http://localhost:8080/api/nonOfficialTypes/update/${editingId}`, {
          mainType: form.mainType,
          subType: form.subType,
          status: form.status,
        });
        toast.success("Type updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/nonOfficialTypes/save", form);
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

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`http://localhost:8080/api/nonOfficialTypes/${id}`);
      const typeToEdit = response.data;
      setForm({ mainType: typeToEdit.mainType, subType: typeToEdit.subType, status: typeToEdit.status });
      setEditingId(id); // Set editing ID to the current ID
    } catch (error) {
      handleError(error);
    }
  };

  const handleDelete = async (id) => {
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
        await axios.delete(`http://localhost:8080/api/nonOfficialTypes/delete/${id}`);
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
      await axios.put(`http://localhost:8080/api/nonOfficialTypes/toggle-status/${id}`, { status: newStatus });
      fetchTypes();
      toast.success(`Status updated to ${newStatus}`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const resetForm = () => {
    setForm({ mainType: "", subType: "", status: "Inactive" });
    setEditingId(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  const filteredTypes = types.filter((t) =>
    (t.mainType && t.mainType.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (t.subType && t.subType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Non-Official Type Master</div>
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-all hover:bg-blue-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch className="inline" /> {showSearch ? "Hide Search" : "Show Search"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center transition-all hover:bg-gray-600"
                onClick={resetForm}
              >
                <FaSyncAlt className="mr-1" /> Reset
              </button>
            </div>
          </div>
          {/* Search Bar */}
          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Types..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          )}
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <select
                value={form.mainType}
                onChange={(e) => setForm({ ...form, mainType: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select Main Type</option>
                {mainTypes.map((mainType) => (
                  <option key={mainType.id} value={mainType.mainType}>{mainType.mainType}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Sub Type"
                value={form.subType}
                onChange={(e) => setForm({ ...form, subType: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {editingId ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* Type Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Main Type</th>
                    <th className="border border-gray-300 p-2">Sub Type</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTypes.map((type, index) => (
                    <tr key={type.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{type.mainType}</td>
                      <td className="border border-gray-300 p-2">{type.subType}</td>
                      <td className="border border-gray-300 p-2">{type.status}</td>
                      <td className="border border-gray-300 p-2">
                        <button onClick={() => handleEdit(type.id)} className="text-blue-500 hover:underline mr-2">
                          <FaEdit />
                        </button>
                        <button onClick={() => handleDelete(type.id)} className="text-red-500 hover:underline mr-2">
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(type.id, type.status)}
                          className={`${
                            type.status === "Active" ? "text-green-500" : "text-red-500"
                          } hover:underline mr-2`}
                        >
                          {type.status === "Active" ? <FaCheck /> : <FaTimes />}
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

export default NonOfficialTypeMaster;
