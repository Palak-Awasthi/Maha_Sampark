import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'; 
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const PostingMaster = () => {
  const [postings, setPostings] = useState([]);
  const [mainTypes, setMainTypes] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [formState, setFormState] = useState({ mainType: "", designation: "", post: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    fetchPostings();
    fetchMainTypes();
    fetchDesignations();
  }, []);

  // Fetch postings
  const fetchPostings = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/posting-master");
      setPostings(response.data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Main Types for dropdown
  const fetchMainTypes = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/nonofficialmaintypes");
      setMainTypes(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Fetch Designations for dropdown
  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/staff");
      setDesignations(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  // Add or Update Posting
  const handleAddOrUpdatePosting = async () => {
    const trimmedMainType = formState.mainType.trim();
    if (!trimmedMainType) {
      toast.error("Main Type is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/posting-master/${isEditing}`, formState);
        toast.success("Posting updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/posting-master", formState);
        toast.success("Posting added successfully!");
      }

      if (response.status === 200 || response.status === 201) {
        fetchPostings();
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
    handleAddOrUpdatePosting();
  };

  // Edit Posting
  const handleEditPosting = (id) => {
    const posting = postings.find((p) => p.id === id);
    setFormState({ mainType: posting.mainType, designation: posting.designation, post: posting.post, status: posting.status });
    setIsEditing(id);
  };

  // Delete Posting
  const handleDeletePosting = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    });

    if (result.isConfirmed) {
      setLoading(true);
      try {
        await axios.delete(`http://localhost:8080/api/posting-master/${id}`);
        setPostings(postings.filter((p) => p.id !== id));
        toast.success("Posting deleted successfully!");
      } catch (error) {
        handleError(error);
      } finally {
        setLoading(false);
      }
    }
  };

  // Toggle Status
// Toggle Status
const handleToggleStatus = async (id) => {
  const posting = postings.find((p) => p.id === id);
  setLoading(true);
  
  try {
    // API call to toggle status
    await axios.put(`http://localhost:8080/api/posting-master/toggle-status/${id}`);

    // Update the status in the frontend
    setPostings((prevPostings) =>
      prevPostings.map((p) =>
        p.id === id ? { ...p, status: p.status === "Active" ? "Inactive" : "Active" } : p
      )
    );
    toast.success(`Posting status toggled successfully!`);
  } catch (error) {
    handleError(error);
  } finally {
    setLoading(false);
  }
};


  // Search Handling
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Reset Form
  const resetForm = () => {
    setFormState({ mainType: "", designation: "", post: "", status: "Active" });
    setIsEditing(null);
  };

  // Error Handling
  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
    } else {
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  // Filter postings based on search term
  const filteredPostings = postings.filter((p) =>
    p.mainType && p.mainType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Posting Master</div>
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
                placeholder="Search Postings..."
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
                value={formState.mainType}
                onChange={(e) => setFormState({ ...formState, mainType: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select Main Type</option>
                {mainTypes.map((type) => (
                  <option key={type.id} value={type.mainType}>
                    {type.mainType}
                  </option>
                ))}
              </select>
              <select
                value={formState.designation}
                onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select Designation</option>
                {designations.map((designation) => (
                  <option key={designation.id} value={designation.designation}>
                    {designation.designation}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Post"
                value={formState.post}
                onChange={(e) => setFormState({ ...formState, post: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              />
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
          {/* Posting Table */}
          <div className="overflow-x-auto">
            {loading ? (
              <div>Loading...</div>
            ) : (
              <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr.No</th>
                    <th className="border border-gray-300 p-2">Main Type</th>
                    <th className="border border-gray-300 p-2">Designation</th>
                    <th className="border border-gray-300 p-2">Post</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPostings.map((posting, index) => (
                    <tr key={posting.id} className="text-center">
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{posting.mainType}</td>
                      <td className="border border-gray-300 p-2">{posting.designation}</td>
                      <td className="border border-gray-300 p-2">{posting.post}</td>
                      <td className="border border-gray-300 p-2">
                        <span
                          className={`inline-flex items-center px-2 py-1 text-sm font-bold rounded-full ${
                            posting.status === "Active" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                          }`}
                        >
                          {posting.status} {posting.status === "Active" ? <FaCheck className="ml-1" /> : <FaTimes className="ml-1" />}
                        </span>
                      </td>
                      <td className="border border-gray-300 px-4 py-2">
                        <button
                          onClick={() => handleEditPosting(posting.id)}
                          className="text-blue-600 hover:underline mx-2"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeletePosting(posting.id)}
                          className="text-red-600 hover:underline mx-2"
                        >
                          <FaTrash />
                        </button>
                        <button
                          onClick={() => handleToggleStatus(posting.id)}
                          className={`text-${posting.status === "Active" ? "red" : "green"}-600 hover:underline mx-2`}
                        >
                          {posting.status === "Active" ? <FaTimes /> : <FaCheck />}
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

export default PostingMaster;
