import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
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
    const state = states.find((st) => st.id === id);
    setFormState({ state: state.state, status: state.status });
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
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/states/${id}/status`);
      fetchStates();
      toast.success(`State status updated to ${currentStatus === "Active" ? "Inactive" : "Active"} successfully!`);
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

  const filteredStates = states.filter((st) =>
    st.state ? st.state.toLowerCase().includes(searchTerm.toLowerCase()) : false
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">State Master</h2>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search State"
                  value={searchTerm}
                  onChange={handleSearch}
                  className="px-3 py-2 border rounded-md"
                />
              )}
              <button onClick={() => setShowSearch(!showSearch)} className="p-2 bg-blue-500 text-white rounded-md">
                <FaSearch />
              </button>
              <button onClick={() => { setSearchTerm(""); setShowSearch(false); }} className="p-2 bg-blue-500 text-white rounded-md">
                <FaSyncAlt />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block mb-1">State Name</label>
              <input
                type="text"
                value={formState.state}
                onChange={(e) => setFormState({ ...formState, state: e.target.value })}
                className="border p-2 rounded w-full"
                required
              />
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
              {isEditing ? "Update" : "Submit"}
            </button>
          </form>

          {loading && <div>Loading...</div>}

          <table className="min-w-full bg-white border border-gray-200 mt-6">
            <thead>
              <tr>
                <th className="py-2 border-b">State</th>
                <th className="py-2 border-b">Status</th>
                <th className="py-2 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredStates.map((state) => (
                <tr key={state.id}>
                  <td className="py-2 border-b">{state.state}</td>
                  <td className="py-2 border-b">{state.status}</td>
                  <td className="py-2 border-b">
                    <button onClick={() => handleEditState(state.id)} className="text-blue-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleToggleStatus(state.id, state.status)} className="text-green-500 mx-2">
                      {state.status === "Active" ? <FaCheck /> : <FaTimes />}
                    </button>
                    <button onClick={() => handleDeleteState(state.id)} className="text-red-500">
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default StateMaster;
