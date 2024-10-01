import React, { useState, useEffect } from "react";
import axios from "axios";
import AddAlertModal from "./AddAlertModal";
import Swal from "sweetalert2";
import AdminSidebar from "../AdminSidebar";  // Ensure the correct import path
import AdminHeader from "../AdminHeader";    // Ensure the correct import path
import AdminFooter from "../AdminFooter";    // Ensure the correct import path

const AdminQuickAlert = () => {
  const [alerts, setAlerts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
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
    setShowAddModal(true); // Open the modal for updating
  };

  const handleAlertAdded = () => {
    fetchAlerts(); // Refresh the alerts after adding a new one
    setShowAddModal(false); // Close the modal
  };

  const handleAlertUpdated = async (alertData) => {
    try {
      await axios.put(`http://localhost:8080/api/quick-alerts/${selectedAlert.id}`, alertData);
      fetchAlerts(); // Refresh the alerts after updating an existing one
      setSelectedAlert(null); // Clear selected alert
      setShowAddModal(false); // Close the modal
      Swal.fire({
        icon: 'success',
        title: 'Updated',
        text: 'Alert updated successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error("Error updating alert:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to update alert. Please try again.',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/quick-alerts/${id}`);
      fetchAlerts(); // Refresh alerts after deletion
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Alert deleted successfully!',
        confirmButtonText: 'OK',
      });
    } catch (error) {
      console.error("Error deleting alert:", error);
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Failed to delete alert. Please try again.',
        confirmButtonText: 'Try Again',
      });
    }
  };

  return (
    <div className="flex">
      <AdminSidebar /> {/* Sidebar is placed here */}
      <div className="flex-1 flex flex-col"> {/* Added flex-col for proper stacking */}
        <AdminHeader /> {/* Header is placed here */}
        <div className="p-6 flex-1"> {/* Ensure this area can grow */}
          <h1 className="text-2xl font-bold mb-4">Quick Alerts</h1>
          <button
            onClick={() => {
              setSelectedAlert(null);
              setShowAddModal(true);
            }}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-md"
          >
            Add Quick Alert
          </button>

          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-200 p-2">Sr. No.</th>
                <th className="border border-gray-200 p-2">Title</th>
                <th className="border border-gray-200 p-2">Start Date</th>
                <th className="border border-gray-200 p-2">End Date</th>
                <th className="border border-gray-200 p-2">Status</th>
                <th className="border border-gray-200 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {alerts.map((alert, index) => (
                <tr key={alert.id}>
                  <td className="border border-gray-200 p-2">{index + 1}</td>
                  <td className="border border-gray-200 p-2">{alert.title}</td>
                  <td className="border border-gray-200 p-2">{alert.startDate}</td>
                  <td className="border border-gray-200 p-2">{alert.endDate}</td>
                  <td className="border border-gray-200 p-2">{alert.status}</td>
                  <td className="border border-gray-200 p-2 flex space-x-2">
                  
                    <button
                      onClick={() => handleDelete(alert.id)}
                      className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {showAddModal && (
          <AddAlertModal 
            onClose={selectedAlert ? handleAlertUpdated : handleAlertAdded} 
            alertId={selectedAlert ? selectedAlert.id : null} 
            alertData={selectedAlert} // Pass the selected alert data to the modal
          />
        )}
        <AdminFooter /> {/* Footer is placed here */}
      </div>
    </div>
  );
};

export default AdminQuickAlert;
