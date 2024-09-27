import React, { useState } from "react";
import axios from "axios";

const AddAlertModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    startDate: "",
    startTime: "",
    endDate: "",
    endTime: "",
    title: "",
    alertInfo: "",
    status: "Active",
    file: null,
  });

  const apiUrl = "http://localhost:8080/api/quick-alerts";
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null); // Added for success feedback

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && ["application/pdf", "image/jpeg", "image/png"].includes(file.type)) {
      setFormData({ ...formData, file });
    } else {
      alert("Only PDF, JPEG, and PNG files are allowed");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null); // Reset success message

    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === "file") {
          form.append(key, formData.file); // Append file only if exists
        } else {
          form.append(key, formData[key]);
        }
      });

      const response = await axios.post(apiUrl, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccessMessage(response.data.message || "Alert created successfully."); // Set success message
      onClose(); // Close the modal after success
    } catch (error) {
      console.error("Error saving alert:", error);
      setError("Failed to save the alert. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-indigo-100 rounded-lg shadow-lg p-6 w-full max-w-lg flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Add New Alert</h2>
        {error && <div className="text-red-600">{error}</div>}
        {successMessage && <div className="text-green-600">{successMessage}</div>} {/* Success message display */}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Form Fields */}
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Start Date</label>
              <input type="date" name="startDate" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Start Time</label>
              <input type="time" name="startTime" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            </div>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">End Date</label>
              <input type="date" name="endDate" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">End Time</label>
              <input type="time" name="endTime" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
            </div>
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Title</label>
            <input type="text" name="title" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
          </div>

          <div>
            <label className="block text-gray-700 font-medium">Alert Info</label>
            <textarea name="alertInfo" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" required />
          </div>

          <div className="flex justify-between items-center">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Status</label>
              <select name="status" onChange={handleChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400">
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium">Upload File</label>
              <input type="file" name="file" accept=".pdf,.jpeg,.jpg,.png" onChange={handleFileChange} className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" />
            </div>
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Add</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAlertModal;
