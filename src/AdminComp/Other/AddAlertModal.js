import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddAlertModal = ({ onClose, alertId }) => {
  const [formData, setFormData] = useState({
    title: "",
    startDate: "",
    endDate: "",
    endTime: "",
    alertInfo: "",
    status: "Active",
    roles: ["Admin", "Manager"], // Default roles
    districts: ["District3"], // Default districts
    posts: ["Post1"], // Default posts
    fileName: "",
    file: null,
  });

  const apiUrl = "http://localhost:8080/api/quick-alerts";
  const [error, setError] = useState(null);
  const isEditing = !!alertId; // Determine if we are editing or adding

  // Fetch existing alert data if editing
  useEffect(() => {
    if (isEditing) {
      const fetchAlertData = async () => {
        try {
          const response = await axios.get(`${apiUrl}/${alertId}`);
          setFormData({ ...response.data });
        } catch (error) {
          console.error("Error fetching alert data:", error);
          setError("Failed to load alert data. Please try again.");
        }
      };

      fetchAlertData();
    }
  }, [isEditing, alertId, apiUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["application/pdf", "image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      setFormData({ ...formData, file, fileName: file.name });
    } else {
      alert("Only PDF, JPEG, JPG, and PNG files are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const form = new FormData();

      // Wrapping the formData inside 'alert' key
      const alertData = {
        title: formData.title,
        startDate: formData.startDate,
        endDate: formData.endDate,
        endTime: formData.endTime,
        alertInfo: formData.alertInfo,
        status: formData.status,
        roles: formData.roles,
        districts: formData.districts,
        posts: formData.posts,
      };

      form.append("alert", JSON.stringify(alertData));

      if (formData.file) {
        form.append("file", formData.file);
      }

      if (isEditing) {
        // Update alert if editing
        await axios.put(`${apiUrl}/status/${alertId}`, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        // Add new alert
        await axios.post(apiUrl, form, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: isEditing ? 'Alert updated successfully!' : 'Alert created successfully!',
        confirmButtonText: 'OK',
      });

      onClose(); // Close the modal after success
    } catch (error) {
      console.error("Error saving alert:", error);
      setError("Failed to save the alert. Please try again.");

      // Show SweetAlert error message
      Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Something went wrong!',
        confirmButtonText: 'Try Again',
      });
    }
  };

  const handleDelete = async () => {
    if (!isEditing) return; // Prevent delete if not in edit mode

    try {
      await axios.delete(`${apiUrl}/${alertId}`);

      // Show SweetAlert success message
      Swal.fire({
        icon: 'success',
        title: 'Deleted',
        text: 'Alert deleted successfully!',
        confirmButtonText: 'OK',
      });

      onClose(); // Close the modal after deletion
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
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-indigo-100 rounded-lg shadow-lg p-6 w-full max-w-lg flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">{isEditing ? 'Update Alert' : 'Add New Alert'}</h2>
        {error && <div className="text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Form Fields */}
          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Start Date</label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">End Date</label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">End Time</label>
            <input
              type="time"
              name="endTime"
              value={formData.endTime}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Alert Info</label>
            <textarea
              name="alertInfo"
              value={formData.alertInfo}
              onChange={handleChange}
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Upload File (PDF/JPEG/PNG/JPG)</label>
            <input
              type="file"
              name="file"
              accept="application/pdf, image/jpeg, image/png, image/jpg"
              onChange={handleFileChange}
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

            {/* Submit Button */}
            <div className="flex justify-end space-x-2">
            <button
              type="submit"
              className="bg-indigo-600 text-white p-2 rounded-md hover:bg-indigo-700 transition"
            >
              {isEditing ? 'Update' : 'Submit'}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 transition"
              >
                Delete
              </button>
            )}
          </div>
        </form>
        <button
          className="mt-4 text-red-500 hover:underline"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default AddAlertModal;