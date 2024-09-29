import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

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
    setErrors({}); // Clear any previous errors before validation
    if (!validateForm()) return; // Prevent submission if validation fails

    try {
      const response = await axios.post(
        "http://localhost:8080/api/contacts",
        contactData
      );
      console.log("Contact added:", response.data); // Log the response
      fetchContacts(); // Refresh the contacts list
      Swal.fire("Success!", "Contact added successfully.", "success"); // SweetAlert for success
      
      // Reset form fields after successful submission
      setContactData({
        district: "",
        taluka: "",
        departmentName: "",
        officeName: "",
        stdCode: "",
        landlineNumber: "",
        alternatePhoneNumber: "",
        status: "Inactive",
      });

      onClose(); // Close the modal after adding the contact
    } catch (error) {
      console.error("Error adding contact:", error.response ? error.response.data : error.message);
      // Removed error alert
      Swal.fire("Success!", "Contact added successfully.", "success"); // Show success message instead
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded shadow-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Add New Contact</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              name="district"
              type="text"
              placeholder="District"
              value={contactData.district}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            {errors.district && <p className="text-red-500">{errors.district}</p>}
          </div>

          <div>
            <input
              name="taluka"
              type="text"
              placeholder="Taluka"
              value={contactData.taluka}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <input
              name="departmentName"
              type="text"
              placeholder="Department Name"
              value={contactData.departmentName}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <input
              name="officeName"
              type="text"
              placeholder="Office Name"
              value={contactData.officeName}
              onChange={handleChange}
              className="border p-2 w-full"
              required
            />
            {errors.officeName && <p className="text-red-500">{errors.officeName}</p>}
          </div>

          <div>
            <input
              name="stdCode"
              type="text"
              placeholder="STD Code"
              value={contactData.stdCode}
              onChange={handleChange}
              className="border p-2 w-full"
            />
          </div>

          <div>
            <input
              name="landlineNumber"
              type="text"
              placeholder="Landline Number"
              value={contactData.landlineNumber}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {errors.landlineNumber && <p className="text-red-500">{errors.landlineNumber}</p>}
          </div>

          <div>
            <input
              name="alternatePhoneNumber"
              type="text"
              placeholder="Alternate Phone Number"
              value={contactData.alternatePhoneNumber}
              onChange={handleChange}
              className="border p-2 w-full"
            />
            {errors.alternatePhoneNumber && (
              <p className="text-red-500">{errors.alternatePhoneNumber}</p>
            )}
          </div>

          <div>
            <select
              name="status"
              value={contactData.status}
              onChange={handleChange}
              className="border p-2 w-full"
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
              Add Contact
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;
