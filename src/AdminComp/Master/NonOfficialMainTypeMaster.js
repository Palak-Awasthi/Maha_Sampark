import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import Swal from "sweetalert2"; // Import SweetAlert
import AdminFooter from "../AdminFooter";

const NonOfficialMainTypeMaster = () => {
  const [mainTypes, setMainTypes] = useState([]);
  const [formData, setFormData] = useState({ mainType: "", status: "Inactive" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchMainTypes();
  }, []);

  const fetchMainTypes = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/nonofficialmaintypes");
      setMainTypes(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmedMainType = formData.mainType.trim();

    if (!trimmedMainType) {
      toast.error("Main Type is required!");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${isEditing}`, { ...formData, mainType: trimmedMainType });
        toast.success("Main Type updated successfully!");
      } else {
        await axios.post("http://localhost:8080/api/nonofficialmaintypes", { ...formData, mainType: trimmedMainType });
        toast.success("Main Type added successfully!");
      }
      fetchMainTypes();
      resetForm();
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (id) => {
    const mainTypeToEdit = mainTypes.find((type) => type.id === id);
    setFormData({ mainType: mainTypeToEdit.mainType, status: mainTypeToEdit.status });
    setIsEditing(id);
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
        await axios.delete(`http://localhost:8080/api/nonofficialmaintypes/${id}`);
        fetchMainTypes();
        toast.success("Main Type deleted successfully!");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleStatus = async (id) => {
    const mainTypeToUpdate = mainTypes.find((type) => type.id === id);
    const updatedStatus = mainTypeToUpdate.status === "Active" ? "Inactive" : "Active";

    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/nonofficialmaintypes/${id}`, { ...mainTypeToUpdate, status: updatedStatus });
      fetchMainTypes();
      toast.success(`Main Type status updated to ${updatedStatus}`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredMainTypes = mainTypes.filter((type) =>
    type.mainType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetForm = () => {
    setFormData({ mainType: "", status: "Inactive" });
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

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Non-Official Main Type Master</div>
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
                placeholder="Search Main Types..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          )}
          {/* Form Section */}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Main Type Name"
                value={formData.mainType}
                onChange={(e) => setFormData({ ...formData, mainType: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* Main Type Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Main Type Name</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMainTypes.map((type, index) => (
                    <tr key={type.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{type.mainType}</td>
                      <td className="border border-gray-300 p-2">
  <span
    className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${
      type.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
    }`}
  >
    {type.status} {type.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
  </span>
</td>
<td className="border border-gray-300 p-2 flex gap-2">
  <button
    className="text-yellow-500 hover:text-yellow-700 transition-all"
    onClick={() => handleEdit(type.id)}
  >
    <FaEdit />
  </button>
  <button
    className="text-red-500 hover:text-red-700 transition-all"
    onClick={() => handleDelete(type.id)}
  >
    <FaTrash />
  </button>
  <button
    onClick={() => toggleStatus(type.id)}
    className={`text-${type.status === "Active" ? "red" : "green"}-600 hover:underline mx-2`}
  >
    {type.status === "Active" ? <FaTimes /> : <FaCheck />}
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

export default NonOfficialMainTypeMaster;
