import React, { useState, useEffect } from "react";
import axios from "axios";
import AddAlertModal from "./AddAlertModal";
import UpdateAlertModal from "./UpdateAlertModal";
import AdminSidebar from "../AdminSidebar";  // Ensure the correct import path
import AdminHeader from "../AdminHeader";    // Ensure the correct import path
import AdminFooter from "../AdminFooter";    // Ensure the correct import path

const AdminQuickAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);

  const fetchAlerts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/quick-alerts");
      setAlerts(response.data);
    } catch (error) {
      console.error("Error fetching alerts:", error);
    }
  };

  useEffect(() => {
    fetchAlerts();
  }, []);

  const handleUpdateClick = (alert) => {
    setSelectedAlert(alert);
    setShowUpdateModal(true);
  };

  const handleAlertAdded = () => {
    fetchAlerts(); // Refresh the alerts after adding a new one
  };

  const handleAlertUpdated = () => {
    fetchAlerts(); // Refresh the alerts after updating an existing one
    setSelectedAlert(null); // Clear selected alert
  };

  return (
    <div className="flex">
      <AdminSidebar /> {/* Sidebar is placed here */}
      <div className="flex-1">
        <AdminHeader /> {/* Header is placed here */}
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-4">Quick Alerts</h1>
          <button
            onClick={() => setShowAddModal(true)}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Quick Alert
          </button>

          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Title</th>
                <th className="border border-gray-200 p-2">Start Date</th>
                <th className="border border-gray-200 p-2">End Date</th>
                <th className="border border-gray-200 p-2">Status</th>
                <th className="border border-gray-200 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert) => (
                <tr key={alert.id}>
                  <td className="border border-gray-200 p-2">{alert.title}</td>
                  <td className="border border-gray-200 p-2">{alert.startDate}</td>
                  <td className="border border-gray-200 p-2">{alert.endDate}</td>
                  <td className="border border-gray-200 p-2">{alert.status}</td>
                  <td className="border border-gray-200 p-2">
                    <button
                      onClick={() => handleUpdateClick(alert)}
                      className="px-2 py-1 bg-yellow-500 text-white rounded-md"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showAddModal && (
            <AddAlertModal 
              onClose={() => setShowAddModal(false)} 
              onAlertAdded={handleAlertAdded} // Pass handler to refresh alerts
            />
          )}
          {showUpdateModal && (
            <UpdateAlertModal 
              item={selectedAlert} 
              onClose={() => setShowUpdateModal(false)} 
              onAlertUpdated={handleAlertUpdated} // Pass handler to refresh alerts
            />
          )}
        </div>
        <AdminFooter /> {/* Footer is placed here */}
      </div>
    </div>
  );
};

export default AdminQuickAlert;
