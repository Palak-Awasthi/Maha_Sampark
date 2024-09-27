import React, { useState, useEffect } from "react";
import axios from "axios";

const EditContactModal = ({ isOpen, onClose, contact, fetchContacts }) => {
  const [formData, setFormData] = useState({
    district: "",
    taluka: "",
    departmentName: "",
    officeName: "",
    stdCode: "",
    landlineNumber: "",
    alternatePhoneNumber: "",
    status: "Active",
  });

  // Populate the form when the modal is opened with the contact details
  useEffect(() => {
    if (contact) {
      setFormData({
        district: contact.district || "",
        taluka: contact.taluka || "",
        departmentName: contact.departmentName || "",
        officeName: contact.officeName || "",
        stdCode: contact.stdCode || "",
        landlineNumber: contact.landlineNumber || "",
        alternatePhoneNumber: contact.alternatePhoneNumber || "",
        status: contact.status || "Active",
      });
    }
  }, [contact]);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // API call to update the contact
      await axios.put(`http://localhost:8080/api/contacts/${contact.id}`, formData);
      fetchContacts(); // Fetch updated contacts after the edit
      onClose(); // Close the modal after saving
    } catch (err) {
      console.error("Error updating contact", err);
    }
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Edit Govt Office Contact</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">District</label>
            <input
              type="text"
              name="district"
              value={formData.district}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Taluka</label>
            <input
              type="text"
              name="taluka"
              value={formData.taluka}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Department Name</label>
            <input
              type="text"
              name="departmentName"
              value={formData.departmentName}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Office Name</label>
            <input
              type="text"
              name="officeName"
              value={formData.officeName}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">STD Code</label>
            <input
              type="text"
              name="stdCode"
              value={formData.stdCode}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Landline Number</label>
            <input
              type="text"
              name="landlineNumber"
              value={formData.landlineNumber}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Alternate Phone Number</label>
            <input
              type="text"
              name="alternatePhoneNumber"
              value={formData.alternatePhoneNumber}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-500 text-white px-4 py-2 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditContactModal;
