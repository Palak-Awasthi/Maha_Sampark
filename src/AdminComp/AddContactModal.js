import React, { useState } from "react";
import axios from "axios";

const AddContactModal = ({ isOpen, onClose, fetchContacts }) => {
  const [contactData, setContactData] = useState({
    district: "",
    taluka: "",
    departmentName: "",
    officeName: "",
    stdCode: "",
    landlineNumber: "",
    alternatePhoneNumber: "",
    status: "Inactive",
  });

  const [errors, setErrors] = useState({}); 

  const validateForm = () => {
    let formErrors = {};

    if (!contactData.district) {
      formErrors.district = "District is required";
    }
    if (!contactData.officeName) {
      formErrors.officeName = "Office Name is required";
    }
    if (
      contactData.landlineNumber &&
      !/^\d+$/.test(contactData.landlineNumber)
    ) {
      formErrors.landlineNumber = "Landline number must contain only digits";
    }
    if (
      contactData.alternatePhoneNumber &&
      !/^\d+$/.test(contactData.alternatePhoneNumber)
    ) {
      formErrors.alternatePhoneNumber =
        "Alternate Phone Number must contain only digits";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContactData({
      ...contactData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return; // Prevent submission if validation fails

    try {
      const response = await axios.post(
        "http://localhost:8080/api/contacts",
        contactData
      );
      console.log("Contact added:", response.data); // Log the response
      fetchContacts(); // Refresh the contacts list
      onClose(); // Close the modal after adding the contact
    } catch (error) {
      console.error("Error adding contact:", error.response ? error.response.data : error.message);
      alert("Failed to add contact. Please try again."); // Alert the user on failure
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="district"
            type="text"
            placeholder="District"
            value={contactData.district}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
            required
          />
          {errors.district && <p className="text-red-500">{errors.district}</p>}
          
          <input
            name="taluka"
            type="text"
            placeholder="Taluka"
            value={contactData.taluka}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          
          <input
            name="departmentName"
            type="text"
            placeholder="Department Name"
            value={contactData.departmentName}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          
          <input
            name="officeName"
            type="text"
            placeholder="Office Name"
            value={contactData.officeName}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
            required
          />
          {errors.officeName && <p className="text-red-500">{errors.officeName}</p>}
          
          <input
            name="stdCode"
            type="text"
            placeholder="STD Code"
            value={contactData.stdCode}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          
          <input
            name="landlineNumber"
            type="text"
            placeholder="Landline Number"
            value={contactData.landlineNumber}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          {errors.landlineNumber && <p className="text-red-500">{errors.landlineNumber}</p>}
          
          <input
            name="alternatePhoneNumber"
            type="text"
            placeholder="Alternate Phone Number"
            value={contactData.alternatePhoneNumber}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          />
          {errors.alternatePhoneNumber && <p className="text-red-500">{errors.alternatePhoneNumber}</p>}

          <select
            name="status"
            value={contactData.status}
            onChange={handleChange}
            className="border p-2 mb-2 w-full"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          <div className="flex justify-between">
            <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded">
              Cancel
            </button>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
