import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaRedo, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const TalukaMaster = () => {
  const [talukas, setTalukas] = useState([]);
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [filteredDistricts, setFilteredDistricts] = useState([]);
  const [formState, setFormState] = useState({ talukaName: "", districtId: "", stateId: "", status: "Inactive" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTalukas();
    fetchDistricts();
    fetchStates();
  }, []);

  useEffect(() => {
    if (formState.stateId) {
      const filtered = districts.filter(district => district.state.id === Number(formState.stateId));
      setFilteredDistricts(filtered);
    } else {
      setFilteredDistricts([]);
    }
  }, [formState.stateId, districts]);

  const fetchTalukas = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/talukas");
      setTalukas(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
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

  const handleAddOrUpdateTaluka = async () => {
    const trimmedTalukaName = formState.talukaName.trim();

    if (!trimmedTalukaName || !formState.districtId || !formState.stateId) {
      toast.error("Taluka Name, District, and State are required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      const selectedDistrict = filteredDistricts.find(district => district.id === Number(formState.districtId));
      const selectedState = states.find(state => state.id === Number(formState.stateId));

      const talukaData = {
        talukaName: trimmedTalukaName,
        districtName: selectedDistrict ? selectedDistrict.districtName : "",
        state: selectedState ? selectedState.state : "",
        status: formState.status
      };

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/talukas/${isEditing}`, talukaData);
        toast.success("Taluka updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/talukas", talukaData);
        toast.success("Taluka added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchTalukas();
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
    handleAddOrUpdateTaluka();
  };

  const handleEditTaluka = (id) => {
    const taluka = talukas.find((t) => t.id === id);
    if (taluka) {
      setFormState({ talukaName: taluka.talukaName, districtId: taluka.districtId, stateId: taluka.stateId, status: taluka.status });
      setIsEditing(id);
    }
  };

  const handleDeleteTaluka = async (id) => {
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
        await axios.delete(`http://localhost:8080/api/talukas/${id}`);
        setTalukas(talukas.filter((t) => t.id !== id));
        toast.success("Taluka deleted successfully!");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  const toggleStatus = async (id) => {
    setLoading(true);
    try {
      const response = await axios.put(`http://localhost:8080/api/talukas/${id}/status`);
      const updatedTalukas = talukas.map(t => 
        t.id === id ? { ...t, status: response.data.status } : t
      );
      setTalukas(updatedTalukas);
      toast.success(`Taluka status updated to ${response.data.status}!`);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormState({ talukaName: "", districtId: "", stateId: "", status: "Inactive" });
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

  const filteredTalukas = talukas.filter((t) =>
    t.talukaName && t.talukaName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">Taluka Master</div>
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
                <FaRedo className="mr-1" /> Reset
              </button>
            </div>
          </div>
          {showSearch && (
            <div className="mb-4">
              <input
                type="text"
                placeholder="Search Talukas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border border-gray-300 rounded p-2"
              />
            </div>
          )}
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex gap-4">
              <select
                value={formState.stateId}
                onChange={(e) => {
                  setFormState({ ...formState, stateId: e.target.value, districtId: "" });
                }}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select State</option>
                {states.map((state) => (
                  <option key={state.id} value={state.id}>
                    {state.state}
                  </option>
                ))}
              </select>
              <select
                value={formState.districtId}
                onChange={(e) => setFormState({ ...formState, districtId: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select District</option>
                {filteredDistricts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.districtName}
                  </option>
                ))}
              </select>
              <input
                type="text"
                value={formState.talukaName}
                onChange={(e) => setFormState({ ...formState, talukaName: e.target.value })}
                placeholder="Taluka Name"
                className="border border-gray-300 rounded p-2 flex-grow"
                required
              />
              <button
                type="submit"
                className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600"
              >
                {isEditing ? "Update Taluka" : "Add Taluka"}
              </button>
            </div>
          </form>
          <div className="overflow-x-auto">
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
                <tr className="bg-blue-500 text-white">
                  <th className="py-2 px-4">SR No.</th>
                  
                  
                  <th className="py-2 px-4">State Name</th>
                  <th className="py-2 px-4">District Name</th>
                  <th className="py-2 px-4">Taluka Name</th>
                  <th className="py-2 px-4">Status</th>
                  <th className="py-2 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">Loading...</td>
                  </tr>
                ) : filteredTalukas.length > 0 ? (
                  filteredTalukas.map((taluka, index) => (
                    <tr key={taluka.id} className="border-b">
                      <td className="py-2 px-4">{index + 1}</td>
                      
                      
                      <td className="py-2 px-4">{taluka.state}</td>
                      <td className="py-2 px-4">{taluka.districtName}</td>
                      <td className="py-2 px-4">{taluka.talukaName}</td>
                     <td className="border border-gray-300 p-2">
  <span
    className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${
      taluka.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
    }`}
  >
    {taluka.status} {taluka.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
  </span>
</td>
<td className="border border-gray-300 px-4 py-2 flex space-x-2">
  <button onClick={() => handleEditTaluka(taluka.id)} className="text-blue-600 hover:underline">
    <FaEdit />
  </button>
  <button
    onClick={() => toggleStatus(taluka.id)}
    className={`text-${taluka.status === "Active" ? "red" : "green"}-600 hover:underline`}
  >
    {taluka.status === "Active" ? <FaTimes /> : <FaCheck />}
  </button>
  <button onClick={() => handleDeleteTaluka(taluka.id)} className="text-red-600 hover:underline">
    <FaTrash />
  </button>
</td>

                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-4">No Talukas found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default TalukaMaster;
