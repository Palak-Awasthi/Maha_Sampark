import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'; 
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const PostingMaster = () => {
  const [postings, setPostings] = useState([]);
  const [formState, setFormState] = useState({ maintype: "", designation: "", post: "", status: "Active" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchPostings();
  }, []);

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

  const handleAddOrUpdatePosting = async () => {
    const trimmedMaintype = formState.maintype.trim();
    if (!trimmedMaintype) {
      toast.error("Maintype is required!");
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

  const handleEditPosting = (id) => {
    const posting = postings.find((p) => p.id === id);
    setFormState({ maintype: posting.maintype, designation: posting.designation, post: posting.post, status: posting.status });
    setIsEditing(id);
  };

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

  const handleToggleStatus = async (id) => {
    setLoading(true);
    try {
      // Update the status in the API
      await axios.put(`http://localhost:8080/api/posting-master/toggle-status/${id}`);
      
      // Update the status in local state to reflect the change
      setPostings((prevPostings) =>
        prevPostings.map((posting) =>
          posting.id === id ? { ...posting, status: posting.status === "Active" ? "Inactive" : "Active" } : posting
        )
      );

      toast.success("Posting status updated successfully!");
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
    setFormState({ maintype: "", designation: "", post: "", status: "Active" });
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

  const filteredPostings = postings.filter((p) =>
    p.maintype?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const totalPages = Math.ceil(filteredPostings.length / itemsPerPage);
  const currentPostings = filteredPostings.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold">Posting Master</div>
            <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
              {showSearch && (
                <input
                  type="text"
                  placeholder="Search Maintype"
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

          {/* Add/Update Posting Form */}
          <div className="bg-white rounded-lg shadow-md mb-6">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">{isEditing ? "Edit Posting" : "Add Posting"}</h3>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-2">
                  <div className="flex flex-row space-x-4">
                    {/* Type Dropdown */}
                    <div className="flex flex-col w-full">
                      <label className="mb-1 font-medium">Type</label>
                      <select
                        value={formState.maintype}
                        onChange={(e) => setFormState({ ...formState, maintype: e.target.value })}
                        className="p-2 border rounded hover:scale-105 transition-transform"
                        required
                      >
                        <option value="" disabled>Select Type</option>
                        <option value="Type 1">Type 1</option>
                        <option value="Type 2">Type 2</option>
                        <option value="Type 3">Type 3</option>
                      </select>
                    </div>

                    {/* Designation Dropdown */}
                    <div className="flex flex-col w-full">
                      <label className="mb-1 font-medium">Designation</label>
                      <select
                        value={formState.designation}
                        onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                        className="p-2 border rounded hover:scale-105 transition-transform"
                        required
                      >
                        <option value="" disabled>Select Designation</option>
                        <option value="Designation 1">Designation 1</option>
                        <option value="Designation 2">Designation 2</option>
                        <option value="Designation 3">Designation 3</option>
                      </select>
                    </div>
                  </div>

                  {/* Post Input */}
                  <div className="flex flex-col">
                    <label className="mb-1 font-medium">Post</label>
                    <input
                      type="text"
                      value={formState.post}
                      onChange={(e) => setFormState({ ...formState, post: e.target.value })}
                      className="p-2 border rounded hover:scale-105 transition-transform"
                      required
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    className="p-2 bg-green-500 text-white rounded-md transition-transform transform hover:scale-110"
                  >
                    {isEditing ? "Update Posting" : "Add Posting"}
                  </button>
                  <button
                    type="button"
                    onClick={resetForm}
                    className="p-2 bg-red-500 text-white rounded-md transition-transform transform hover:scale-110"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Postings Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
              <h3 className="text-lg sm:text-xl font-semibold">Postings List</h3>
            </div>
            <div className="p-6">
              {loading ? (
                <div>Loading...</div>
              ) : (
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    <tr>
                      <th className="border border-gray-300 p-2">Maintype</th>
                      <th className="border border-gray-300 p-2">Designation</th>
                      <th className="border border-gray-300 p-2">Post</th>
                      <th className="border border-gray-300 p-2">Status</th>
                      <th className="border border-gray-300 p-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentPostings.length > 0 ? (
                      currentPostings.map((posting) => (
                        <tr key={posting.id}>
                          <td className="border border-gray-300 p-2">{posting.maintype}</td>
                          <td className="border border-gray-300 p-2">{posting.designation}</td>
                          <td className="border border-gray-300 p-2">{posting.post}</td>
                          <td className="border border-gray-300 p-2">
                            <span
                              onClick={() => handleToggleStatus(posting.id)}
                              className={`cursor-pointer ${
                                posting.status === "Active" ? "text-green-500" : "text-red-500"
                              }`}
                            >
                              {posting.status}
                            </span>
                          </td>
                          <td className="border border-gray-300 p-2 flex space-x-2">
                            <button
                              onClick={() => handleEditPosting(posting.id)}
                              className="text-yellow-500 hover:text-yellow-600"
                              title="Edit"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeletePosting(posting.id)}
                              className="text-red-500 hover:text-red-600"
                              title="Delete"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="border border-gray-300 p-2 text-center">
                          No postings found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
              {/* Pagination */}
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
                                    disabled={currentPage === totalPages}
                                    className="p-2 bg-gray-300 rounded-md disabled:opacity-50"
                                  >
                                    Next
                                  </button>
                                </div>
                              </div>
                            </div>
                          </div>
                          <AdminFooter />
                        </div>
                      </div>
                    );
                  };
                  
                  export default PostingMaster;
                  
