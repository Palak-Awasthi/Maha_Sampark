import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";

const StateMaster = () => {
  const [states, setStates] = useState([]);
  const [formState, setFormState] = useState({ stateName: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
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

  const handleAddOrUpdateState = async () => {
    if (!formState.stateName) {
      alert("State name is required!");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/states/${isEditing}`, {
          ...formState,
          status: "Inactive"
        });
        alert("State updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/states", {
          ...formState,
          status: "Inactive"
        });
        alert("State added successfully!");
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
    setFormState({ stateName: state.name });
    setIsEditing(id);
  };

  const handleDeleteState = async (id) => {
    if (window.confirm("Are you sure you want to delete this state?")) {
      try {
        await axios.delete(`http://localhost:8080/api/states/${id}`);
        setStates(states.filter((st) => st.id !== id));
        alert("State deleted successfully!");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/states/${id}/status`, { status: newStatus });
      fetchStates();
      alert(`State status updated to ${newStatus} successfully!`);
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStates = states.filter((st) =>
    st.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ stateName: "" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      alert(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else if (error.request) {
      alert("No response received from the server. Please try again.");
    } else {
      alert("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl font-bold">State Master</marquee>
        </div>
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

      {/* Add/Update State Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">
            {isEditing ? "Edit State" : "Add State"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col mb-4">
              <label className="mb-1 font-medium">State Name</label>
              <input
                type="text"
                value={formState.stateName}
                onChange={(e) => setFormState({ ...formState, stateName: e.target.value })}
                className="p-2 border rounded hover:scale-105 transition duration-300"
                required
              />
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

      {/* State List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6 overflow-x-auto">
        <div className="px-6 py-4">
          <table className="min-w-full bg-white rounded-lg shadow-md mb-6">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 hover:text-black cursor-pointer">Sr No</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">State</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Status</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((state) => (
                <tr key={state.id}>
                  <td className="px-4 py-2">{state.id}</td>
                  <td className="px-4 py-2">{state.name}</td>
                  <td className="px-4 py-2">
                    <span className={`font-bold ${state.status === "Active" ? "text-green-500" : "text-red-500"}`}>
                      {state.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    {state.status === "Active" ? (
                      <FaCheck
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(state.id, state.status)}
                      />
                    ) : (
                      <FaTimes
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(state.id, state.status)}
                      />
                    )}
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEditState(state.id)}
                    />
                    <FaTrash
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleDeleteState(state.id)}
                    />
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

export default StateMaster;
