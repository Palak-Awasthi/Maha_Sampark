import React, { useState } from "react";
import axios from "axios";

const UpdateAlertModal = ({ item, onClose }) => {
  const [formData, setFormData] = useState({
    startDate: item.startDate || "",
    startTime: item.startTime || "",
    endDate: item.endDate || "",
    endTime: item.endTime || "",
    title: item.title || "",
    alertInfo: item.alertInfo || "",
    status: item.status || "Active",
    file: null,
  });

  const apiUrl = "http://localhost:8080/api/quick-alerts";
  const [error, setError] = useState(null);

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

    try {
      const form = new FormData();
      Object.keys(formData).forEach(key => {
        // If file is null, don't append it to FormData
        if (key === 'file' && formData.file === null) return;
        form.append(key, formData[key]);
      });

      const response = await axios.put(`${apiUrl}/${item.id}`, form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert(response.data.message || "Alert updated successfully.");
      onClose();
    } catch (error) {
      console.error("Error updating alert:", error);
      setError("Failed to update the alert. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-70 z-50">
      <div className="bg-indigo-100 rounded-lg shadow-lg p-6 w-full max-w-lg flex flex-col space-y-4">
        <h2 className="text-xl font-bold text-indigo-900 mb-4">Edit Alert</h2>
        {error && <div className="mb-4 text-red-600">{error}</div>}
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {/* Form Fields */}
          <div className="flex space-x-4">
            <div className="w-1/2 mb-4">
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
            <div className="w-1/2 mb-4">
              <label className="block text-gray-700 font-medium">Start Time</label>
              <input 
                type="time" 
                name="startTime" 
                value={formData.startTime} 
                onChange={handleChange} 
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                required 
              />
            </div>
          </div>
          <div className="flex space-x-4">
            <div className="w-1/2 mb-4">
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
            <div className="w-1/2 mb-4">
              <label className="block text-gray-700 font-medium">End Time</label>
              <input 
                type="time" 
                name="endTime" 
                value={formData.endTime} 
                onChange={handleChange} 
                className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" 
                required 
              />
            </div>
          </div>

          <div className="mb-4">
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

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Alert Info</label>
            <textarea 
              name="alertInfo" 
              value={formData.alertInfo} 
              onChange={handleChange} 
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" 
              required 
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Status</label>
            <select 
              name="status" 
              value={formData.status} 
              onChange={handleChange} 
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium">Upload New File (optional)</label>
            <input 
              type="file" 
              name="file" 
              accept=".pdf,.jpeg,.jpg,.png" 
              onChange={handleFileChange} 
              className="border p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-indigo-400" 
            />
          </div>

          <div className="flex justify-end space-x-4 mt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UpdateAlertModal;
