import React, { useState, useEffect } from "react";
import {
  FaEdit,
  FaTrashAlt,
  FaSearch,
  FaSyncAlt,
  FaCheck,
} from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";
import { toast } from "react-toastify"; // Import Toastify for notifications
import Swal from "sweetalert2"; // Import SweetAlert

const OfficeDesignationMaster = () => {
  const [designations, setDesignations] = useState([]);
  const [departments, setDepartments] = useState([]); // State for departments
  const [staffDesignations, setStaffDesignations] = useState([]); // State for staff designations
  const [formState, setFormState] = useState({
    id: null, // To keep track of the id for editing
    mainDepartment: "",
    designation: "",
  });
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch all designations, departments, and staff designations when the component mounts
  useEffect(() => {
    fetchDesignations();
    fetchDepartments();
    fetchStaffDesignations(); // Fetch staff designations
  }, []);

  const fetchDesignations = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/designation/all");
      const data = await response.json();
      setDesignations(data);
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/main-departments");
      const data = await response.json();
      setDepartments(data); // Set departments state
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStaffDesignations = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/staff");
      const data = await response.json();
      setStaffDesignations(data); // Set staff designations state
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDesignation = async () => {
    if (!formState.mainDepartment || !formState.designation) {
      toast.error("Both fields are required!");
      return;
    }

    const designationData = {
      mainDepartment: formState.mainDepartment,
      designation: formState.designation,
      status: "Inactive", // Default to Inactive
    };

    setLoading(true);
    try {
      const response = await fetch("http://localhost:8080/api/designation/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designationData),
      });
      const newDesignation = await response.json();
      setDesignations([...designations, newDesignation]);
      resetForm();
      toast.success("Designation added successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditDesignation = (id) => {
    const designation = designations.find((d) => d.id === id);
    setFormState({
      id: designation.id,
      mainDepartment: designation.mainDepartment,
      designation: designation.designation,
    });
  };

  const handleUpdateDesignation = async () => {
    if (!formState.mainDepartment || !formState.designation) {
      toast.error("Both fields are required!");
      return;
    }

    const designationData = {
      mainDepartment: formState.mainDepartment,
      designation: formState.designation,
      status: "Inactive", // Default to Inactive
    };

    setLoading(true);
    try {
      const response = await fetch(`http://localhost:8080/api/designation/update/${formState.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(designationData),
      });
      const updatedDesignation = await response.json();
      setDesignations(
        designations.map((d) =>
          d.id === formState.id ? updatedDesignation : d
        )
      );
      resetForm();
      toast.success("Designation updated successfully!");
    } catch (error) {
      handleError(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDesignation = async (id) => {
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
        await fetch(`http://localhost:8080/api/designation/delete/${id}`, {
          method: "DELETE",
        });
        setDesignations(designations.filter((d) => d.id !== id));
        toast.success("Designation deleted successfully!");
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
      await fetch(`http://localhost:8080/api/designation/toggle-status/${id}`, {
        method: "PUT",
      });
      setDesignations(
        designations.map((d) => (d.id === id ? { ...d, status: newStatus } : d))
      );
      toast.success(`Designation status updated to ${newStatus}`);
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
    setFormState({ id: null, mainDepartment: "", designation: "" }); // Reset form
  };

  const handleError = (error) => {
    console.error("Error:", error);
    toast.error("An unexpected error occurred. Please try again.");
  };

  const filteredDesignations = designations.filter((d) =>
    d.designation && d.designation.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="container mx-auto p-4">
          {/* Header Section */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-2xl font-bold text-black">Other Office Designation Master</div>
            <div className="flex items-center">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-all hover:bg-blue-600"
                onClick={() => setShowSearch(!showSearch)}
              >
                <FaSearch className="inline" /> {showSearch ? "Hide Search" : "Show Search"}
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center transition-all hover:bg-gray-600"
                onClick={() => resetForm()}
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
                placeholder="Search Designations..."
                value={searchTerm}
                onChange={handleSearch}
                className="border border-gray-300 rounded p-2 w-full"
              />
            </div>
          )}
          {/* Form Section */}
          <form onSubmit={(e) => { e.preventDefault(); formState.id ? handleUpdateDesignation() : handleAddDesignation(); }} className="mb-4">
            <div className="flex gap-4">
              <select
                value={formState.mainDepartment}
                onChange={(e) => setFormState({ ...formState, mainDepartment: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select Main Department</option>
                {departments.map((department) => (
                  <option key={department.id} value={department.mainDepartment}>
                    {department.mainDepartment}
                  </option>
                ))}
              </select>
              <select
                value={formState.designation}
                onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                className="border border-gray-300 rounded p-2 flex-grow"
              >
                <option value="">Select Designation</option>
                {staffDesignations.map((staff) => (
                  <option key={staff.id} value={staff.designation}>
                    {staff.designation}
                  </option>
                ))}
              </select>
              <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                {formState.id ? "Update" : "Add"}
              </button>
            </div>
          </form>
          {/* Designation List */}
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                  <tr>
                    <th className="border border-gray-300 p-2">Sr. No.</th>
                    <th className="border border-gray-300 p-2">Main Department</th>
                    <th className="border border-gray-300 p-2">Designation</th>
                    <th className="border border-gray-300 p-2">Status</th>
                    <th className="border border-gray-300 p-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredDesignations.map((designation, index) => (
                    <tr key={designation.id} className={designation.status === "Inactive" ? "" : ""}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{designation.mainDepartment}</td>
                      <td className="border border-gray-300 p-2">{designation.designation}</td>
                      <td className="border border-gray-300 p-2">{designation.status}</td>
                      <td className="border border-gray-300 p-2 flex gap-2">
                        <button
                          className="text-blue-500"
                          onClick={() => handleEditDesignation(designation.id)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="text-red-500"
                          onClick={() => handleDeleteDesignation(designation.id)}
                        >
                          <FaTrashAlt />
                        </button>
                        <button
                          className={`text-${designation.status === "Active" ? "red" : "green"}-500`}
                          onClick={() => handleToggleStatus(designation.id, designation.status)}
                        >
                          <FaCheck />
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

export default OfficeDesignationMaster;
