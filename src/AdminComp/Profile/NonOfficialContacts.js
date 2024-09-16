import React, { useState, useEffect } from "react"
import axios from "axios"
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa"

const NonOfficialContacts = () => {
  const [contacts, setContacts] = useState([])
  const [formState, setFormState] = useState({
    name: "",
    type: "",         // Dropdown field
    subType: "",      // Dropdown field
    otherInfo: "",    // Additional info
    phoneNumber: "",
    dateOfBirth: "",  // Additional field
    approvalStatus: "Pending"
  })
  const [isEditing, setIsEditing] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Options for dropdowns
  const typeOptions = ["Type A", "Type B", "Type C"]; // Replace with actual types
  const subTypeOptions = ["SubType A", "SubType B", "SubType C"]; // Replace with actual subtypes

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/contacts")
      setContacts(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdateContact = async () => {
    if (!formState.name || !formState.type) {
      alert("Name and Type fields are required!")
      return
    }

    try {
      let response

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/contacts/${isEditing}`, formState)
        alert("Contact updated successfully!")
      } else {
        response = await axios.post("http://localhost:8080/api/contacts", formState)
        alert("Contact added successfully!")
      }

      if (response.status === 200 || response.status === 201) {
        fetchContacts()
        resetForm()
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAddOrUpdateContact()
  }

  const handleEditContact = (id) => {
    const contact = contacts.find((c) => c.id === id)
    setFormState({
      name: contact.name,
      type: contact.type,
      subType: contact.subType,
      otherInfo: contact.otherInfo,
      phoneNumber: contact.phoneNumber,
      dateOfBirth: contact.dateOfBirth,
      approvalStatus: contact.approvalStatus
    })
    setIsEditing(id)
  }

  const handleDeleteContact = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await axios.delete(`http://localhost:8080/api/contacts/${id}`)
        setContacts(contacts.filter((c) => c.id !== id))
        alert("Contact deleted successfully!")
      } catch (error) {
        handleError(error)
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved"
    try {
      await axios.put(`http://localhost:8080/api/contacts/${id}/status`, { status: newStatus })
      fetchContacts()
      alert(`Contact status updated to ${newStatus} successfully!`)
    } catch (error) {
      handleError(error)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  )

  const resetForm = () => {
    setFormState({
      name: "",
      type: "",         // Reset dropdown
      subType: "",      // Reset dropdown
      otherInfo: "",
      phoneNumber: "",
      dateOfBirth: "",  // Reset field
      approvalStatus: "Pending"
    })
    setIsEditing(null)
  }

  const handleError = (error) => {
    console.error("Error:", error)
    if (error.response) {
      alert(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`)
    } else if (error.request) {
      alert("No response received from the server. Please try again.")
    } else {
      alert("An unexpected error occurred. Please try again.")
    }
  }

  return (
    <div className="container mx-auto p-4">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
        <div className="relative overflow-hidden whitespace-nowrap">
          <marquee className="text-2xl sm:text-3xl font-bold">
            <span className="mx-2">Non Official</span>
            <span className="mx-2">Contacts</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Contact"
              value={searchTerm}
              onChange={handleSearch}
              className="px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500 w-full sm:w-auto"
            />
          )}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Search"
          >
            <FaSearch />
          </button>
          <button
            onClick={() => {
              setSearchTerm("")
              setShowSearch(false)
            }}
            className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110"
            title="Reset"
          >
            <FaSyncAlt />
          </button>
        </div>
      </div>

      {/* Add/Update Contact Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Contact" : "Add Contact"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Row 1 - Name and Type */}
              <div className="col-span-1">
                <label htmlFor="name" className="block text-gray-700"><strong>Name</strong></label>
                <input
                  type="text"
                  id="name"
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  placeholder="Name"
                  className="p-2 border rounded w-full"
                  required
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="type" className="block text-gray-700"><strong>Type</strong></label>
                <select
                  id="type"
                  value={formState.type}
                  onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="">Select Type</option>
                  {typeOptions.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="subType" className="block text-gray-700"><strong>Sub-Type</strong></label>
                <select
                  id="subType"
                  value={formState.subType}
                  onChange={(e) => setFormState({ ...formState, subType: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Sub-Type</option>
                  {subTypeOptions.map((subType, index) => (
                    <option key={index} value={subType}>{subType}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 2 - Other Fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="otherInfo" className="block text-gray-700"><strong>Other Information</strong></label>
                <textarea
                  id="otherInfo"
                  value={formState.otherInfo}
                  onChange={(e) => setFormState({ ...formState, otherInfo: e.target.value })}
                  placeholder="Additional Information"
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="phoneNumber" className="block text-gray-700"><strong>Phone Number</strong></label>
                <input
                  type="text"
                  id="phoneNumber"
                  value={formState.phoneNumber}
                  onChange={(e) => setFormState({ ...formState, phoneNumber: e.target.value })}
                  placeholder="Phone Number"
                  className="p-2 border rounded w-full"
                />
              </div>
              <div className="col-span-1">
                <label htmlFor="dateOfBirth" className="block text-gray-700"><strong>Date of Birth</strong></label>
                <input
                  type="date"
                  id="dateOfBirth"
                  value={formState.dateOfBirth}
                  onChange={(e) => setFormState({ ...formState, dateOfBirth: e.target.value })}
                  className="p-2 border rounded w-full"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end mt-4">
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                {isEditing ? "Update Contact" : "Add Contact"}
              </button>
        
            </div>
          </form>
        </div>
      </div>

      {/* Contacts Table */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Contact List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sr No.</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Sub-Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Phone Number</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Date of Birth</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Approval Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredContacts.map((contact, index) => (
                <tr key={contact.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.type}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.subType}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.phoneNumber}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{contact.dateOfBirth}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleToggleStatus(contact.id, contact.approvalStatus)}
                      className={`p-1 rounded-md ${contact.approvalStatus === "Approved" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                    >
                      {contact.approvalStatus === "Approved" ? <FaCheck /> : <FaTimes />}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap flex space-x-2">
                    <button
                      onClick={() => handleEditContact(contact.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default NonOfficialContacts
