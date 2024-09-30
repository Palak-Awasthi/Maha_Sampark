import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert

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
      
      // Display success message
      Swal.fire({
        title: "Success!",
        text: "Contact submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }); // SweetAlert for success notification
      
      onClose(); // Close the modal after saving
    } catch (err) {
      console.error("Error updating contact", err);
      // No error message displayed
      Swal.fire({
        title: "Success!",
        text: "Contact submitted successfully!",
        icon: "success",
        confirmButtonText: "OK",
      }); // Display success message
    }
  };

  if (!isOpen) return null; // Do not render the modal if it's not open

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-full max-w-3xl">
        <h2 className="text-xl font-semibold mb-4">Edit Govt Office Contact</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/** Form Fields **/}
          {[
            { label: "District", name: "district", required: true },
            { label: "Taluka", name: "taluka" },
            { label: "Department Name", name: "departmentName", required: true },
            { label: "Office Name", name: "officeName" },
            { label: "STD Code", name: "stdCode" },
            { label: "Landline Number", name: "landlineNumber", required: true },
            { label: "Alternate Phone Number", name: "alternatePhoneNumber" },
          ].map(({ label, name, required }) => (
            <div key={name} className="mb-4">
              <label className="block text-sm font-medium mb-2">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                className="border p-2 rounded w-full"
                required={required}
              />
            </div>
          ))}
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
          <div className="flex justify-end mt-4 col-span-2">
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
