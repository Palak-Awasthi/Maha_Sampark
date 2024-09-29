import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import AddContactModal from "./AddContactModal"; // For adding new contact
import EditContactModal from "./EditContactModal"; // For editing a contact
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; // Import FontAwesomeIcon
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons"; // Import specific icons
import Swal from "sweetalert2"; // Import SweetAlert

const AdminGovtOfficeContact = () => {
  const [contacts, setContacts] = useState([]);
  const [filteredContacts, setFilteredContacts] = useState([]);
  const [filters, setFilters] = useState({
    district: "",
    taluka: "",
    departmentName: "",
    officeName: "",
    landlineNumber: "",
    alternatePhoneNumber: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState(null);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/contacts");
      setContacts(response.data);
      setFilteredContacts(response.data);
    } catch (err) {
      setError("Error fetching contacts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  useEffect(() => {
    const filterContacts = () => {
      let filtered = contacts;

      if (filters.district) {
        filtered = filtered.filter(contact =>
          contact.district.toLowerCase().includes(filters.district.toLowerCase())
        );
      }
      if (filters.taluka) {
        filtered = filtered.filter(contact =>
          contact.taluka.toLowerCase().includes(filters.taluka.toLowerCase())
        );
      }
      if (filters.departmentName) {
        filtered = filtered.filter(contact =>
          contact.departmentName.toLowerCase().includes(filters.departmentName.toLowerCase())
        );
      }
      if (filters.officeName) {
        filtered = filtered.filter(contact =>
          contact.officeName.toLowerCase().includes(filters.officeName.toLowerCase())
        );
      }
      if (filters.landlineNumber) {
        filtered = filtered.filter(contact =>
          contact.landlineNumber.toLowerCase().includes(filters.landlineNumber.toLowerCase())
        );
      }
      if (filters.alternatePhoneNumber) {
        filtered = filtered.filter(contact =>
          contact.alternatePhoneNumber.toLowerCase().includes(filters.alternatePhoneNumber.toLowerCase())
        );
      }

      setFilteredContacts(filtered);
    };

    filterContacts();
  }, [filters, contacts]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilters({
      district: "",
      taluka: "",
      departmentName: "",
      officeName: "",
      landlineNumber: "",
      alternatePhoneNumber: "",
    });
  };

  const handleAddContact = () => {
    setIsAddModalOpen(true);
  };

  const handleEditContact = (contact) => {
    setSelectedContact(contact);
    setIsEditModalOpen(true);
  };

  const handleDeleteContact = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:8080/api/contacts/${id}`);
          fetchContacts();
          Swal.fire("Deleted!", "The contact has been deleted.", "success");
        } catch (err) {
          setError("Error deleting contact.");
        }
      }
    });
  };

  const handleAddContactSuccess = async (newContact) => {
    setIsAddModalOpen(false);
    await axios.post("http://localhost:8080/api/contacts", newContact);
    fetchContacts(); // Refresh contacts
  };

  const handleEditContactSuccess = async (updatedContact) => {
    setIsEditModalOpen(false);
    await axios.put(`http://localhost:8080/api/contacts/${updatedContact.id}`, updatedContact);
    fetchContacts(); // Refresh contacts
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white flex-grow overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Govt Office Contacts</h2>

          <div className="flex flex-wrap gap-4 mb-4">
            <select
              name="district"
              value={filters.district}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
            >
              <option value="">Select District</option>
              {/* Add district options here */}
            </select>
            <select
              name="taluka"
              value={filters.taluka}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
            >
              <option value="">Select Taluka</option>
              {/* Add taluka options here */}
            </select>
            <select
              name="departmentName"
              value={filters.departmentName}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
            >
              <option value="">Select Department</option>
              {/* Add department options here */}
            </select>
            <input
              name="officeName"
              type="text"
              value={filters.officeName}
              onChange={handleInputChange}
              placeholder="Search Office Name"
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <input
              name="landlineNumber"
              type="text"
              value={filters.landlineNumber}
              onChange={handleInputChange}
              placeholder="Search Landline Number"
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <input
              name="alternatePhoneNumber"
              type="text"
              value={filters.alternatePhoneNumber}
              onChange={handleInputChange}
              placeholder="Search Alternate Phone Number"
              className="border p-2 rounded w-full sm:w-1/4"
            />
            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
            <button
              onClick={fetchContacts}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
            <button
              onClick={handleAddContact}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Add Contact
            </button>
          </div>

          {loading && <p>Loading contacts...</p>}
          {error && <p className="text-red-500">{error}</p>}

          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
          <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border px-4 py-2">Sr.No.</th>
                <th className="border px-4 py-2">District</th>
                <th className="border px-4 py-2">Taluka</th>
                <th className="border px-4 py-2">Dept Name</th>
                <th className="border px-4 py-2">Office Name</th>
                <th className="border px-4 py-2">STD Code</th>
                <th className="border px-4 py-2">Landline Number</th>
                <th className="border px-4 py-2">Alternate Phone Number</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length > 0 ? (
                filteredContacts.map((contact, index) => (
                  <tr key={contact.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{contact.district}</td>
                    <td className="border px-4 py-2">{contact.taluka}</td>
                    <td className="border px-4 py-2">{contact.departmentName}</td>
                    <td className="border px-4 py-2">{contact.officeName}</td>
                    <td className="border px-4 py-2">{contact.stdCode}</td>
                    <td className="border px-4 py-2">{contact.landlineNumber}</td>
                    <td className="border px-4 py-2">{contact.alternatePhoneNumber}</td>
                    <td className="border px-4 py-2">{contact.status}</td>
                    <td className="border px-4 py-2">
                      <FontAwesomeIcon
                        icon={faEdit}
                        className="cursor-pointer text-blue-500"
                        onClick={() => handleEditContact(contact)}
                      />
                      <FontAwesomeIcon
                        icon={faTrash}
                        className="cursor-pointer text-red-500 ml-2"
                        onClick={() => handleDeleteContact(contact.id)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center border px-4 py-2">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
      <AddContactModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddContactSuccess={handleAddContactSuccess}
      />
      <EditContactModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        contact={selectedContact}
        onEditContactSuccess={handleEditContactSuccess}
      />
    </div>
  );
};

export default AdminGovtOfficeContact;
