import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import Swal from "sweetalert2"; // Import SweetAlert
import AdminFooter from "../AdminFooter";

const StateMaster = () => {
  const [states, setStates] = useState([]);
  const [formState, setFormState] = useState({ state: "", status: "Inactive" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchStates();
  }, []);

  const fetchStates = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/states");
      setStates(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrUpdateState = async () => {
    const trimmedState = formState.state.trim();

    if (!trimmedState) {
      toast.error("State Name is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/states/${isEditing}`, {
          ...formState,
          state: trimmedState,
        });
        toast.success("State updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/states", {
          ...formState,
          state: trimmedState,
        });
        toast.success("State added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchStates();
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
    handleAddOrUpdateState();
  };

  const handleEditState = (id) => {
    const state = states.find((s) => s.id === id);
    if (state) {
      setFormState({ state: state.state, status: state.status });
      setIsEditing(id);
    }
  };

  const handleDeleteState = async (id) => {
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
        await axios.delete(`http://localhost:8080/api/states/${id}`);
        setStates(states.filter((s) => s.id !== id));
        toast.success("State deleted successfully!");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleToggleStatus = async (id) => {
    const state = states.find((s) => s.id === id);
    if (state) {
      const newStatus = state.status === "Active" ? "Inactive" : "Active";
      setLoading(true);
      try {
        await axios.put(`http://localhost:8080/api/states/${id}/status`, { status: newStatus });
        setStates((prevStates) =>
          prevStates.map((s) =>
            s.id === id ? { ...s, status: newStatus } : s
          )
        );
        toast.success(`State status updated to ${newStatus}`);
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
    setFormState({ state: "", status: "Inactive" });
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

  const filteredStates = states.filter((s) =>
    s.state && s.state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">State Master</div>
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
                  resetForm(); // Reset form fields when resetting search
                }}
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
                placeholder="Search States..."
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
                placeholder="State Name"
                value={formState.state}
                onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* State Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">State Name</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStates.map((state, index) => (
                    <tr key={state.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{state.state}</td>
                      <td className="border border-gray-300 p-2">
  <span
    className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${
      state.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
    }`}
  >
    {state.status} {state.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
  </span>
</td>
<td className="border border-gray-300 p-2 flex gap-2">
  <button
    className="text-yellow-500 hover:text-yellow-700 transition-all"
    onClick={() => handleEditState(state.id)}
  >
    <FaEdit />
  </button>
  <button
    className="text-red-500 hover:text-red-700 transition-all"
    onClick={() => handleDeleteState(state.id)}
  >
    <FaTrash />
  </button>
  <button
    onClick={() => handleToggleStatus(state.id)}
    className={`text-${state.status === "Active" ? "red" : "green"}-600 hover:underline mx-2`}
  >
    {state.status === "Active" ? <FaTimes /> : <FaCheck />}
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

export default StateMaster;
