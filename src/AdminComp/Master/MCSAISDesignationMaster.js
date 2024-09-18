import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaTimes, FaCheck } from "react-icons/fa";

const MCSAISDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [addedDesignations, setAddedDesignations] = useState([]); // State for newly added designations
  const [formState, setFormState] = useState({ type: "", designationName: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchDesignations();
  }, []);

  const fetchDesignations = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/designations");
      setDesignations(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateDesignation = async () => {
    if (!formState.type || !formState.designationName) {
      Swal.fire("Error", "Both fields are required!", "error");
      return;
    }

    try {
      let response;

      if (isEditing) {
        // Update existing designation
        response = await axios.put(`http://localhost:8080/api/designations/${isEditing}`, {
          type: formState.type,
          designation: formState.designationName // Ensure the correct field name
        });
        Swal.fire("Success", "Designation updated successfully!", "success");
      } else {
        // Add new designation
        response = await axios.post("http://localhost:8080/api/designations", {
          type: formState.type,
          designation: formState.designationName // Ensure the correct field name
        });
        Swal.fire("Success", "Designation added successfully!", "success");

        setDesignations((prevDesignations) => [
          ...prevDesignations,
          {
            id: response.data.id, // Assuming the server returns the new ID
            type: formState.type,
            designationName: formState.designationName,
            status: "Inactive" // Set the default status as needed
          }
        ]);
      }

      if (response.status === 200 || response.status === 201) {
        resetForm(); // Reset form after successful add/update
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateDesignation();
  };

  const handleEditDesignation = (id) => {
    const designation = designations.find((d) => d.id === id);
    setFormState({
      type: designation.type,
      designationName: designation.designationName,
    });
    setIsEditing(id);
  };

  const handleDeleteDesignation = async (id) => {
    const confirmed = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!"
    });

    if (confirmed.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/designations/${id}`);
        setDesignations(designations.filter((d) => d.id !== id));
        Swal.fire("Deleted!", "Designation has been deleted.", "success");
      } catch (error) {
        handleError(error);
      }
    }
  };

  const toggleStatus = async (id) => {
    const designation = designations.find((d) => d.id === id);
    if (!designation) return;

    try {
      const updatedStatus = designation.status === "Active" ? "Inactive" : "Active";
      const response = await axios.patch(`http://localhost:8080/api/designations/${id}/status`, { status: updatedStatus });

      setDesignations((prevDesignations) =>
        prevDesignations.map((d) => (d.id === id ? { ...d, status: updatedStatus } : d))
      );
      Swal.fire("Success", `Status updated to ${updatedStatus}!`, "success");
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredDesignations = [...designations, ...addedDesignations].filter((d) =>
    d.designationName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ type: "", designationName: "" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      Swal.fire("Error", `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`, "error");
    } else if (error.request) {
      Swal.fire("Error", "No response received from the server. Please try again.", "error");
    } else {
      Swal.fire("Error", "An unexpected error occurred. Please try again.", "error");
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Rest of the JSX remains the same */}
    </div>
  );
};

export default MCSAISDesignationMaster;
