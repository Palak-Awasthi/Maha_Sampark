import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import Swal from 'sweetalert2';

const StaffMaster = () => {
  const [staffMembers, setStaffMembers] = useState([]);
  const [formState, setFormState] = useState({ designation: "" });
  const [isEditing, setIsEditing] = useState(null);
  const [showSearch, setShowSearch] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchStaffMembers();
  }, []);

  const fetchStaffMembers = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/staff");
      setStaffMembers(response.data);
    } catch (error) {
      handleError(error);
    }
  };

  const handleAddOrUpdateStaff = async () => {
    if (!formState.designation) {
      Swal.fire({
        icon: 'warning',
        title: 'Validation Error',
        text: 'Designation field is required!',
      });
      return;
    }

    try {
      let response;

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/staff/${isEditing}`, formState);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Staff member updated successfully!',
        });
      } else {
        response = await axios.post("http://localhost:8080/api/staff", formState);
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: 'Staff member added successfully!',
        });
      }

      if (response.status === 200 || response.status === 201) {
        fetchStaffMembers();
        resetForm();
      }
    } catch (error) {
      handleError(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddOrUpdateStaff();
  };

  const handleEditStaff = (id) => {
    const staffMember = staffMembers.find((s) => s.id === id);
    setFormState({
      designation: staffMember.designation,
    });
    setIsEditing(id);
  };

  const handleDeleteStaff = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this staff member!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/staff/${id}`);
        setStaffMembers(staffMembers.filter((s) => s.id !== id));
        Swal.fire('Deleted!', 'Staff member has been deleted.', 'success');
      } catch (error) {
        handleError(error);
      }
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await axios.put(`http://localhost:8080/api/staff/${id}/status`, { status: newStatus });
      fetchStaffMembers();
      Swal.fire('Success', `Staff member status updated to ${newStatus} successfully!`, 'success');
    } catch (error) {
      handleError(error);
    }
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredStaffMembers = staffMembers.filter((s) =>
    s.designation?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  );

  const resetForm = () => {
    setFormState({ designation: "" });
    setIsEditing(null);
  };

  const handleError = (error) => {
    console.error("Error:", error);
    if (error.response) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`,
      });
    } else if (error.request) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'No response received from the server. Please try again.',
      });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Staff</span>
            <span className="mx-2">Designation</span>
            <span className="mx-2">Master</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search District"
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

      {/* Add/Update Staff Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Staff Member" : "Add Staff Member"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-2">
              <div className="flex flex-col">
                <label className="mb-1 font-medium">Designation</label>
                <input
                  type="text"
                  value={formState.designation}
                  onChange={(e) => setFormState({ designation: e.target.value })}
                  className="p-2 border rounded hover:scale-105 transition duration-300 w-1/2"
                  required
                />
              </div>
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition duration-300"
              >
                {isEditing ? "Update" : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Staff List Table */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="px-6 py-4">
          <table className="w-full bg-white rounded-lg shadow-md mb-6 ">
            <thead>
              <tr className="bg-blue-500 text-white">
                <th className="px-4 py-2 hover:text-black cursor-pointer">Sr No</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Designation</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Status</th>
                <th className="px-4 py-2 hover:text-black cursor-pointer">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredStaffMembers.map((staff) => (
                <tr key={staff.id}>
                  <td className="px-4 py-2">{staff.id}</td>
                  <td className="px-4 py-2">{staff.designation}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`font-bold ${staff.status === "Active" ? "text-green-500" : "text-red-500"
                        }`}
                    >
                      {staff.status === "Active" ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex space-x-2">
                    {staff.status === "Active" ? (
                      <FaCheck
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(staff.id, staff.status)}
                      />
                    ) : (
                      <FaTimes
                        className="text-blue-500 cursor-pointer"
                        onClick={() => handleToggleStatus(staff.id, staff.status)}
                      />
                    )}
                    <FaEdit
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleEditStaff(staff.id)}
                    />
                    <FaTrash
                      className="text-blue-500 cursor-pointer"
                      onClick={() => handleDeleteStaff(staff.id)}
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

export default StaffMaster;
