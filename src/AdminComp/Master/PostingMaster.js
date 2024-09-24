import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import Swal from 'sweetalert2'; // Import SweetAlert
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";

const PostingMaster = () => {
  const [postings, setPostings] = useState([]);
  const [formState, setFormState] = useState({ postingName: "", type: "", designation: "", post: "", status: "Active" });
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
    const trimmedPostingName = formState.postingName.trim();

    if (!trimmedPostingName) {
      toast.error("Posting Name is required!");
      return;
    }

    setLoading(true);
    try {
      let response;
      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/posting-master/${isEditing}`, { ...formState, postingName: trimmedPostingName });
        toast.success("Posting updated successfully!");
      } else {
        response = await axios.post("http://localhost:8080/api/posting-master", { ...formState, postingName: trimmedPostingName });
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
    setFormState({ postingName: posting.postingName, type: posting.type, designation: posting.designation, post: posting.post, status: posting.status });
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

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    setLoading(true);
    try {
      await axios.put(`http://localhost:8080/api/posting-master/${id}/status`, { status: newStatus });
      fetchPostings();
      toast.success(`Posting status updated to ${newStatus} successfully!`);
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
    setFormState({ postingName: "", type: "", designation: "", post: "", status: "Active" });
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
    p.postingName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
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
                  placeholder="Search Posting"
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
                        value={formState.type}
                        onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                        className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                        required
                      >
                        <option value="">Select Type</option>
                        <option value="AIS">AIS</option>
                        <option value="MCS">MCS</option>
                      </select>
                    </div>

                    {/* Designation Dropdown */}
                    <div className="flex flex-col w-full">
                      <label className="mb-1 font-medium">Designation</label>
                      <select
                        value={formState.designation}
                        onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                        className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                        required
                      >
                        <option value="">Select Designation</option>
                        <option value="Designation 1">Designation 1</option>
                        <option value="Designation 2">Designation 2</option>
                        {/* Add more designation options as needed */}
                      </select>
                    </div>

                    {/* Post Input Field */}
                    <div className="flex flex-col w-full">
                      <label className="mb-1 font-medium">Post</label>
                      <input
                        type="text"
                        value={formState.post}
                        onChange={(e) => setFormState({ ...formState, post: e.target.value })}
                        className="p-2 border rounded hover:scale-105 transition duration-300 w-full"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition duration-300"
                  >
                    {isEditing ? "Update Posting" : "Submit"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="ml-4 px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition duration-300"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Postings Table */}
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-6">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr className="bg-blue-500 text-white">
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Posting Name</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Type</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Designation</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Post</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Status</th>
                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {loading ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">Loading...</td>
                    </tr>
                  ) : currentPostings.length > 0 ? (
                    currentPostings.map((posting) => (
                      <tr key={posting.id}>
                        <td className="px-4 py-2">{posting.postingName}</td>
                        <td className="px-4 py-2">{posting.type}</td>
                        <td className="px-4 py-2">{posting.designation}</td>
                        <td className="px-4 py-2">{posting.post}</td>
                        <td className="px-4 py-2">
                          <button
                            onClick={() => handleToggleStatus(posting.id, posting.status)}
                            className={`px-2 py-1 rounded ${posting.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                          >
                            {posting.status === "Active" ? <FaCheck /> : <FaTimes />}
                          </button>
                        </td>
                        <td className="px-4 py-2 flex space-x-2">
                          <button
                            onClick={() => handleEditPosting(posting.id)}
                            className="p-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-300"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeletePosting(posting.id)}
                            className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
                          >
                            <FaTrash />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-4">No postings found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="mt-4 flex justify-center">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
                >
                  Previous
                </button>
                <span className="px-4 py-2">Page {currentPage} of {totalPages}</span>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition duration-300"
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
