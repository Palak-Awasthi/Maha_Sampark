import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const RegisteredUsersList = () => {
  const [filters, setFilters] = useState({
    roletype: "",
    approvalStatus: "",
  });
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedroletype, setSelectedroletype] = useState({});
  const [selectedApprovalStatus, setSelectedApprovalStatus] = useState({});

  // Fetch users from backend API
  const fetchUsersData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/registrations/all", {
        params: filters,
      });
      setUsersData(response.data);
    } catch (err) {
      setError("Error fetching data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsersData();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilters({
      roletype: "",
      approvalStatus: "",
    });
  };

  // Update role type and approval status for a user
  const handleUpdateUser = async (id) => {
    const updatedUser = {
      roletype: selectedroletype[id] || "",
      approveStatus: selectedApprovalStatus[id] || "",
    };

    try {
      await axios.put(`http://localhost:8080/api/registrations/update/${id}`, updatedUser);
      Swal.fire("Success", "User updated successfully!", "success"); // Success alert
      fetchUsersData(); // Refresh the data after update
    } catch (err) {
      console.error("Error updating user:", err);
      Swal.fire("Error", "Error updating user.", "error"); // Error alert
    }
  };

  const handleRoleChange = (id, roletype) => {
    setSelectedroletype({
      ...selectedroletype,
      [id]: roletype,
    });
  };

  const handleApprovalChange = (id, approveStatus) => {
    setSelectedApprovalStatus({
      ...selectedApprovalStatus,
      [id]: approveStatus,
    });
  };

  // Delete user function
  const handleDeleteUser = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, delete it!',
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:8080/api/registrations/delete/${id}`);
        Swal.fire("Deleted!", "User deleted successfully.", "success"); // Success alert
        fetchUsersData(); // Refresh the data after deletion
      } catch (err) {
        console.error("Error deleting user:", err);
        Swal.fire("Error", "Error deleting user.", "error"); // Error alert
      }
    }
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Registered Users List</h2>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <select
              name="roletype"
              value={filters.roletype}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Role Type</option>
              <option value="MCS Officers">MCS Officers</option>
              <option value="AIS Officers">AIS Officers</option>
              <option value="GOM Officers">GOM Officers</option>
            </select>

            <select
              name="approvalStatus"
              value={filters.approvalStatus}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              <option value="">- Select Approval Status -</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
              <option value="Rejected">Rejected</option>
            </select>

            {/* Reset and Search Buttons */}
            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
            <button
              onClick={fetchUsersData}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>

          {/* Users Table */}
          {loading ? (
            <p>Loading...</p>
          ) : error ? (
            <p>{error}</p>
          ) : (
            <table className="w-full table-auto border-collapse">
              <thead>
                <tr>
                  <th className="border px-4 py-2">Sr.No.</th>
                  <th className="border px-4 py-2">Name</th>
                  <th className="border px-4 py-2">Phone</th>
                  <th className="border px-4 py-2">Email</th>
                  <th className="border px-4 py-2">Profession</th>
                  <th className="border px-4 py-2">Govt ID</th>
                  <th className="border px-4 py-2">Unique ID</th>
                  <th className="border px-4 py-2">Role Type</th>
                  <th className="border px-4 py-2">Approval Status</th>
                  <th className="border px-4 py-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {usersData.map((user, index) => (
                  <tr key={user.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{user.name}</td>
                    <td className="border px-4 py-2">{user.phoneNumber}</td>
                    <td className="border px-4 py-2">{user.email}</td>
                    <td className="border px-4 py-2">{user.profession}</td>
                    <td className="border px-4 py-2">{user.govtId}</td>
                    <td className="border px-4 py-2">{user.uniqueId}</td>
                    <td className="border px-4 py-2">
                      <select
                        value={selectedroletype[user.id] || user.roletype || ""}
                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="">Select Role</option>
                        <option value="MCS Officers">MCS Officers</option>
                        <option value="AIS Officers">AIS Officers</option>
                        <option value="GOM Officers">GOM Officers</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <select
                        value={selectedApprovalStatus[user.id] || user.approveStatus || ""}
                        onChange={(e) => handleApprovalChange(user.id, e.target.value)}
                        className="border p-1 rounded"
                      >
                        <option value="">Select Approval Status</option>
                        <option value="Approved">Approved</option>
                        <option value="Pending">Pending</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </td>
                    <td className="border px-4 py-2">
                      <div className="flex space-x-2"> {/* Added flexbox for side-by-side alignment */}
                        <button
                          onClick={() => handleUpdateUser(user.id)}
                          className="bg-yellow-500 text-white px-2 py-1 rounded"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)} // Ensure to define handleDeleteUser function
                          className="bg-red-500 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default RegisteredUsersList;
