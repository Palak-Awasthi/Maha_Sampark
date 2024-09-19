import React, { useState, useEffect } from "react";
import { FaCheck, FaTimes, FaSyncAlt, FaSearch, FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";

const PostingMaster = () => {
  const [postings, setPostings] = useState([]);
  const [designations, setDesignations] = useState([]);
  const [postingFormState, setPostingFormState] = useState({
    type: "",
    designation: "",
    postingName: "",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPostings();
    fetchDesignations();
  }, []);

  const fetchPostings = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/postings");
      setPostings(response.data);
    } catch (error) {
      console.error("Error fetching postings", error);
    }
  };

  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/designations");
      setDesignations(response.data);
    } catch (error) {
      console.error("Error fetching designations", error);
    }
  };

  const handleAddPosting = async (e) => {
    e.preventDefault();
    try {
      if (!postingFormState.type || !postingFormState.designation || !postingFormState.postingName) {
        alert("All fields are required!");
        return;
      }

      const response = await axios.post("http://localhost:8080/api/postings", {
        maintype: postingFormState.type,
        designation: { id: postingFormState.designation },  // Send designation as an object
        post: postingFormState.postingName,
        status: "Inactive",  // Set status to "Inactive" by default
      });

      setPostings([...postings, response.data]);
      setPostingFormState({ type: "", designation: "", postingName: "" });

      alert("Data added successfully!");
    } catch (error) {
      if (error.response) {
        console.error("Error response:", error.response);
        alert(`Failed to add data: ${error.response.data.message || error.message}`);
      } else if (error.request) {
        console.error("Error request:", error.request);
        alert("Failed to add data. No response from server.");
      } else {
        console.error("Error message:", error.message);
        alert("Failed to add data. Please check your input or try again.");
      }
    }
  };

  const handleEditPosting = (id) => {
    const posting = postings.find((p) => p.id === id);
    setPostingFormState({
      type: posting.type,
      designation: posting.designation.id,  // Store designation id
      postingName: posting.postingName,
    });
  };

  const handleDeletePosting = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/postings/${id}`);
      setPostings(postings.filter((posting) => posting.id !== id));
    } catch (error) {
      console.error("Error deleting posting", error);
    }
  };

  const togglePostingStatus = async (id) => {
    const posting = postings.find((p) => p.id === id);
    try {
      const updatedStatus = posting.status === "Active" ? "Inactive" : "Active";
      const response = await axios.put(`http://localhost:8080/api/postings/${id}`, {
        ...posting,
        status: updatedStatus,
      });
      setPostings(postings.map((p) => (p.id === id ? response.data : p)));
    } catch (error) {
      console.error("Error toggling status", error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredPostings = postings.filter((posting) =>
    posting.postingName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl font-bold">Posting Master</marquee>
        </div>
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

      {/* Posting Form Section */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-xl font-semibold">Add Posting</h3>
        </div>

        <form onSubmit={handleAddPosting} className="p-6 grid grid-cols-3 gap-4">
          <div className="flex flex-col">
            <label className="mb-1 font-medium">Type</label>
            <select
              value={postingFormState.type}
              onChange={(e) => setPostingFormState({ ...postingFormState, type: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Type</option>
              <option value="MCS">MCS</option>
              <option value="AIS">AIS</option>
              <option value="FIS">FIS</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Designation</label>
            <select
              value={postingFormState.designation}
              onChange={(e) => setPostingFormState({ ...postingFormState, designation: e.target.value })}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Designation</option>
              <option value="Deputy Collector">Deputy Collector</option>
              <option value="District Collector">District Collector</option>
              <option value="Palak">Palak</option>
              <option value="ais">ais</option>
              {designations.map((designation) => (
                <option key={designation.id} value={designation.id}>
                  {designation.designationName}  {/* Send the designation name as the value */}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="mb-1 font-medium">Posting Name</label>
            <input
              type="text"
              placeholder="Posting Name"
              value={postingFormState.postingName}
              onChange={(e) => setPostingFormState({ ...postingFormState, postingName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
        </form>

        <div className="flex justify-center mt-5">
          <button
            type="submit"
            onClick={handleAddPosting}
            className="bg-blue-500 text-white p-3 rounded-lg w-40 hover:bg-blue-600 shadow-lg"
          >
            Submit
          </button>
        </div>
      </div>

      {/* Posting Table Section */}
      <table className="w-full bg-white rounded-lg shadow-md mb-6">
        <thead>
          <tr className="bg-blue-500 text-white">
            <th className="p-4">Sr No</th>
            <th className="p-4">Type</th>
            <th className="p-4">Designation</th>
            <th className="p-4">Posting Name</th>
            <th className="p-4">Status</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPostings.map((posting, index) => (
            <tr key={posting.id} className="border-b hover:bg-gray-100">
              <td className="p-4">{index + 1}</td>
              <td className="p-4">{posting.maintype}</td>
              <td className="p-4">{posting.designation.designationName}</td>
              <td className="p-4">{posting.post}</td>
              <td className="p-4">
                <button onClick={() => togglePostingStatus(posting.id)}>
                  {posting.status === "Active" ? (
                    <FaCheck className="text-green-500" />
                  ) : (
                    <FaTimes className="text-red-500" />
                  )}
                </button>
              </td>
              <td className="p-4">
                <button onClick={() => handleEditPosting(posting.id)}>
                  <FaEdit className="text-blue-500" />
                </button>
                <button onClick={() => handleDeletePosting(posting.id)}>
                  <FaTrash className="text-red-500 ml-2" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostingMaster;
