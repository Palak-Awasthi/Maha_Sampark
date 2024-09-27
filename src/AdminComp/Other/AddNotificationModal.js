import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const rolesOptions = ["AIS Officer", "MCS Officer", "GOM Officer"];

const AddNotificationModal = ({ onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [role, setRole] = useState(""); // Change to single role
  const [status, setStatus] = useState("Active");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title || !description || !role) {
      setError("All fields are required.");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8080/api/notifications/add", {
        title,
        description,
        roles: [role], // Send as an array
        status,
      });

      if (response.status === 200) {
        toast.success("Notification added successfully!");
        onAdd(); 
        onClose();
      } else {
        setError("Failed to add notification. Please try again.");
      }
    } catch (error) {
      toast.error("Failed to add notification.");
      setError("An error occurred while adding. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-gradient-to-r from-green-200 to-green-400 rounded-lg p-6 max-w-md w-full shadow-lg">
        <h2 className="text-lg font-bold mb-4">Add Notification</h2>
        {error && <p className="text-red-500">{error}</p>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            required
          />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            required
          >
            <option value="">Select Role</option>
            {rolesOptions.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleOption}
              </option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="border border-gray-300 rounded-md p-2 mb-4 w-full"
          >
            <option value="Active">Active</option>
            <option value="InActive">InActive</option>
          </select>
          <div className="flex justify-between">
            <button
              type="button"
              className="bg-gray-300 text-black py-2 px-4 rounded-md"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Adding..." : "Add Notification"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotificationModal;
