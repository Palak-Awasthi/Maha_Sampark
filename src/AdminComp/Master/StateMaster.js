import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const StateMaster = () => {
  const [states, setStates] = useState([]);
  const [formState, setFormState] = useState({ stateName: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
    const trimmedStateName = formState.stateName.trim();

    if (!trimmedStateName) {
      toast.error("State Name is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/states/${isEditing}`, {
          ...formState,
          stateName: trimmedStateName,
        });
        toast.success("State updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/states", {
          ...formState,
          stateName: trimmedStateName,
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
    const state = states.find((st) => st.id === id);
    setFormState({ stateName: state.stateName, status: state.status });
    setIsEditing(id);
  };

  const handleDeleteState = async (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/states/${id}`);
        setStates(states.filter((st) => st.id !== id));
        toast.success("State deleted successfully!");
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
      await axios.put(`http://localhost:8080/api/states/${id}/status`, { status: newStatus });
      fetchStates();
      toast.success(`State status updated to ${newStatus} successfully!`);
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
    setFormState({ stateName: "", status: "Active" });
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

  const filteredStates = states.filter((st) =>
    st.stateName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const totalPages = Math.ceil(filteredStates.length / itemsPerPage);
  const currentStates = filteredStates.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">State Master</div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search State"
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

          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">{isEditing ? "Edit State" : "Add State"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">State Name</label>
                    <input
                      type="text"
                      value={formState.stateName}
                      onChange={(e) => setFormState({ ...formState, stateName: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition duration-300 w-full sm:w-1/2"
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
                    {isEditing ? "Update" : "Submit"}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {loading && <div className="text-center">Loading...</div>}

          <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
            <div className="px-6 py-4">
              <table className="w-full bg-white rounded-lg shadow-md">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2">Sr No</th>
                    <th className="px-4 py-2">State</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentStates.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="text-center py-4">No records found.</td>
                    </tr>
                  ) : (
                    currentStates.map((state, index) => (
                      <tr key={state.id}>
                        <td className="border px-4 py-2">{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td className="border px-4 py-2">{state.stateName}</td>
                        <td className="border px-4 py-2 text-center">
                          {state.status === "Active" ? (
                            <FaCheck
                              className="text-green-500 cursor-pointer"
                              onClick={() => handleToggleStatus(state.id, state.status)}
                            />
                          ) : (
                            <FaTimes
                              className="text-red-500 cursor-pointer"
                              onClick={() => handleToggleStatus(state.id, state.status)}
                            />
                          )}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          <FaEdit
                            className="text-blue-500 cursor-pointer mx-2"
                            onClick={() => handleEditState(state.id)}
                          />
                          <FaTrash
                            className="text-red-500 cursor-pointer mx-2"
                            onClick={() => handleDeleteState(state.id)}
                          />
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex justify-center mb-6">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-blue-500 text-white rounded-md mr-2 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <AdminFooter />
    </div>
  );
};

export default StateMaster;
