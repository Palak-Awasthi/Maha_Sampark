import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "../AdminSidebar";
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AddNotificationModal from "./AddNotificationModal";
import EditNotificationModal from "./EditNotificationModal"; 
import { toast } from "react-toastify";

const AdminNotification = () => {
  const [filters, setFilters] = useState({
    title: "",
    roleType: "",
  });
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false); 
  const [editingNotification, setEditingNotification] = useState(null); 
  const [showEditModal, setShowEditModal] = useState(false); 

  const rolesOptions = ["All", "AIS Officer", "MCS Officer", "GOM Officer"]; // List of roles

  useEffect(() => {
    fetchNotifications();
  }, [filters, statusFilter]);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/notifications/all");
      let filteredNotifications = response.data;

      // Filter by title
      if (filters.title) {
        filteredNotifications = filteredNotifications.filter(n =>
          n.title.toLowerCase().includes(filters.title.toLowerCase())
        );
      }

      // Filter by role type
      if (filters.roleType && filters.roleType !== "All") {
        filteredNotifications = filteredNotifications.filter(n =>
          n.roles.includes(filters.roleType)
        );
      }

      // Filter by status
      if (statusFilter) {
        filteredNotifications = filteredNotifications.filter(n => n.status === statusFilter);
      }

      setNotifications(filteredNotifications);
    } catch (err) {
      setError("Failed to fetch notifications.");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilters({
      title: "",
      roleType: "All", // Reset roleType to "All"
    });
    setStatusFilter("");
  };

  const handleAddNew = () => {
    setShowAddModal(true);
  };

  const handleEditClick = (notification) => {
    setEditingNotification(notification);
    setShowEditModal(true);
  };

  const handleUpdateNotification = async (updatedNotification) => {
    try {
      await axios.put(`http://localhost:8080/api/notifications/update/${updatedNotification.id}`, updatedNotification);
      toast.success("Notification updated successfully!");
      fetchNotifications(); 
      setShowEditModal(false); 
    } catch (error) {
      toast.error("Failed to update notification.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/notifications/delete/${id}`);
      toast.success("Notification deleted successfully!");
      fetchNotifications(); 
    } catch (error) {
      toast.error("Failed to delete notification.");
    }
  };

  return (
    <div className="flex flex-row min-h-screen">
      <AdminSidebar className="sticky top-0 h-screen" /> {/* Keep the sidebar fixed */}
      <div className="flex-grow flex flex-col">
        <AdminHeader />
        <div className="p-6 flex-grow overflow-y-auto" style={{ maxHeight: 'calc(100vh - 120px)' }}>
          <h2 className="text-xl font-bold mb-4">Notifications</h2>
          
          <button
            onClick={handleAddNew}
            className="bg-green-500 text-white py-2 px-4 rounded mb-4"
          >
            Add New Notification
          </button>

          <div className="flex gap-4 mb-4">
            <input
              type="text"
              name="title"
              value={filters.title}
              onChange={handleInputChange}
              placeholder="Search by Title"
              className="border p-2 rounded w-full"
            />

            <select
              name="roleType"
              value={filters.roleType}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              {rolesOptions.map(roleOption => (
                <option key={roleOption} value={roleOption}>
                  {roleOption}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border p-2 rounded w-full"
            >
              <option value="">Filter by Status</option>
              <option value="Active">Active</option>
              <option value="InActive">InActive</option>
            </select>
          </div>

          <button
            onClick={handleReset}
            className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
          >
            Reset Filters
          </button>

          {loading && <p>Loading notifications...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && notifications.length > 0 ? (
            <ul className="space-y-4">
              {notifications.map((notification) => (
                <li key={notification.id} className="border p-4 rounded flex justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">{notification.title}</h3>
                    <p>{notification.description}</p>
                    <p>Status: {notification.status}</p>
                    <p>Roles: {notification.roles.join(", ")}</p>
                  </div>
                  <div className="flex items-center">
                    <button
                      className="bg-blue-500 text-white py-1 px-2 rounded mr-2"
                      onClick={() => handleEditClick(notification)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white py-1 px-2 rounded"
                      onClick={() => handleDelete(notification.id)} 
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No notifications found.</p>
          )}
        </div>
        <AdminFooter />
      </div>

      {showAddModal && (
        <AddNotificationModal
          onClose={() => setShowAddModal(false)}
          onAdd={fetchNotifications} 
        />
      )}

      {showEditModal && (
        <EditNotificationModal
          notification={editingNotification} 
          onClose={() => setShowEditModal(false)}
          onUpdate={handleUpdateNotification} 
        />
      )}
    </div>
  );
};

export default AdminNotification;
