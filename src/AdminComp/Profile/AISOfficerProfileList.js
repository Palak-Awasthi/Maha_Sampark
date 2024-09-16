import React, { useState, useEffect } from "react"
import axios from "axios"
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa"

const AISOfficerProfileList = () => {
  const [profiles, setProfiles] = useState([])
  const [formState, setFormState] = useState({
    name: "",
    designation: "",
    postingDistrict: "",
    homeState: "", // Changed to dropdown
    yearOfAppointment: "", // Changed to dropdown
    payScaleGroup: "",      // Changed to dropdown
    sourceOfRecruitment: "",// Changed to dropdown
    otherInfo: "",          // New field
    phoneNumber: "",
    email: "",
    approvalStatus: "Pending"
  })
  const [isEditing, setIsEditing] = useState(null)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Options for dropdowns
  const homeStateOptions = ["State A", "State B", "State C"]; // Replace with actual states
  const yearOfAppointmentOptions = ["2020", "2021", "2022", "2023", "2024"]; // Add more years as needed
  const payScaleGroupOptions = ["Group A", "Group B", "Group C"]; // Replace with actual pay scale groups
  const sourceOfRecruitmentOptions = ["Exam", "Direct Recruitment", "Promotion"]; // Add more options as needed

  useEffect(() => {
    fetchProfiles()
  }, [])

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/profiles")
      setProfiles(response.data)
    } catch (error) {
      handleError(error)
    }
  }

  const handleAddOrUpdateProfile = async () => {
    if (!formState.name || !formState.designation) {
      alert("Name and Designation fields are required!")
      return
    }

    try {
      let response

      if (isEditing) {
        response = await axios.put(`http://localhost:8080/api/profiles/${isEditing}`, formState)
        alert("Profile updated successfully!")
      } else {
        response = await axios.post("http://localhost:8080/api/profiles", formState)
        alert("Profile added successfully!")
      }

      if (response.status === 200 || response.status === 201) {
        fetchProfiles()
        resetForm()
      }
    } catch (error) {
      handleError(error)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    handleAddOrUpdateProfile()
  }

  const handleEditProfile = (id) => {
    const profile = profiles.find((p) => p.id === id)
    setFormState({
      name: profile.name,
      designation: profile.designation,
      postingDistrict: profile.postingDistrict,
      homeState: profile.homeState, // Updated
      yearOfAppointment: profile.yearOfAppointment, // Updated
      payScaleGroup: profile.payScaleGroup,          // Updated
      sourceOfRecruitment: profile.sourceOfRecruitment, // Updated
      otherInfo: profile.otherInfo,                    // New field
      phoneNumber: profile.phoneNumber,
      email: profile.email,
      approvalStatus: profile.approvalStatus
    })
    setIsEditing(id)
  }

  const handleDeleteProfile = async (id) => {
    if (window.confirm("Are you sure you want to delete this profile?")) {
      try {
        await axios.delete(`http://localhost:8080/api/profiles/${id}`)
        setProfiles(profiles.filter((p) => p.id !== id))
        alert("Profile deleted successfully!")
      } catch (error) {
        handleError(error)
      }
    }
  }

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved"
    try {
      await axios.put(`http://localhost:8080/api/profiles/${id}/status`, { status: newStatus })
      fetchProfiles()
      alert(`Profile status updated to ${newStatus} successfully!`)
    } catch (error) {
      handleError(error)
    }
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value)
  }

  const filteredProfiles = profiles.filter((p) =>
    p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false
  )

  const resetForm = () => {
    setFormState({
      name: "",
      designation: "",
      postingDistrict: "",
      homeState: "", // Reset dropdown
      yearOfAppointment: "", // Reset dropdown
      payScaleGroup: "",      // Reset dropdown
      sourceOfRecruitment: "",// Reset dropdown
      otherInfo: "",          // Reset new field
      phoneNumber: "",
      email: "",
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
            <span className="mx-2">AIS</span>
            <span className="mx-2">Officers</span>
            <span className="mx-2">Profile</span>
            <span className="mx-2">List</span>
          </marquee>
        </div>
        <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-2">
          {showSearch && (
            <input
              type="text"
              placeholder="Search Officer"
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

      {/* Add/Update Profile Form */}
      <div className="bg-white rounded-lg shadow-md mb-6">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold hover:text-black cursor-pointer">
            {isEditing ? "Edit Profile" : "Add Profile"}
          </h3>
        </div>
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Row 1 - Name and Designation */}
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
                <label htmlFor="designation" className="block text-gray-700"><strong>Designation</strong></label>
                <select
                  id="designation"
                  value={formState.designation}
                  onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                  className="p-2 border rounded w-full"
                  required
                >
                  <option value="" >Select Designation</option>
                  <option value="IAS">IAS</option>
                  <option value="IPS">IPS</option>
                  <option value="IFS">IFS</option>
                  {/* Add more options as needed */}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="postingDistrict" className="block text-gray-700"><strong>Posting District</strong></label>
                <select
                  id="postingDistrict"
                  value={formState.postingDistrict}
                  onChange={(e) => setFormState({ ...formState, postingDistrict: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="" >Select Posting District</option>
                  <option value="District A">District A</option>
                  <option value="District B">District B</option>
                  <option value="District C">District C</option>
                  {/* Add more options as needed */}
                </select>
              </div>
            </div>

            {/* Row 2 - Dropdowns */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="homeState" className="block text-gray-700"><strong>Home State</strong></label>
                <select
                  id="homeState"
                  value={formState.homeState}
                  onChange={(e) => setFormState({ ...formState, homeState: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Home State</option>
                  {homeStateOptions.map((state, index) => (
                    <option key={index} value={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="yearOfAppointment" className="block text-gray-700"><strong>Year of Appointment</strong></label>
                <select
                  id="yearOfAppointment"
                  value={formState.yearOfAppointment}
                  onChange={(e) => setFormState({ ...formState, yearOfAppointment: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Year</option>
                  {yearOfAppointmentOptions.map((year, index) => (
                    <option key={index} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="payScaleGroup" className="block text-gray-700"><strong>Pay Scale Group</strong></label>
                <select
                  id="payScaleGroup"
                  value={formState.payScaleGroup}
                  onChange={(e) => setFormState({ ...formState, payScaleGroup: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Pay Scale Group</option>
                  {payScaleGroupOptions.map((group, index) => (
                    <option key={index} value={group}>{group}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Row 3 - Source of Recruitment and other fields */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="sourceOfRecruitment" className="block text-gray-700"><strong>Source of Recruitment</strong></label>
                <select
                  id="sourceOfRecruitment"
                  value={formState.sourceOfRecruitment}
                  onChange={(e) => setFormState({ ...formState, sourceOfRecruitment: e.target.value })}
                  className="p-2 border rounded w-full"
                >
                  <option value="">Select Source</option>
                  {sourceOfRecruitmentOptions.map((source, index) => (
                    <option key={index} value={source}>{source}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-1">
                <label htmlFor="otherInfo" className="block text-gray-700"><strong>Other Info</strong></label>
                <input
                  type="text"
                  id="otherInfo"
                  value={formState.otherInfo}
                  onChange={(e) => setFormState({ ...formState, otherInfo: e.target.value })}
                  placeholder="Other Info"
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
            </div>

            {/* Row 4 - Email and Approval Status */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
              <div className="col-span-1">
                <label htmlFor="email" className="block text-gray-700"><strong>Email</strong></label>
                <input
                  type="email"
                  id="email"
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  placeholder="Email"
                  className="p-2 border rounded w-full"
                />
              </div>
            
              <div className="col-span-1 flex items-end">
                <button type="submit" className="p-2 bg-blue-500 text-white rounded-md">
                  {isEditing ? "Update" : "Add"} Profile
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Profiles List */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="bg-blue-500 text-white px-6 py-3 rounded-t-lg">
          <h3 className="text-lg sm:text-xl font-semibold">Profiles List</h3>
        </div>
        <div className="p-6">
          <table className="min-w-full">
            <thead>
              <tr>
                <th className="border px-4 py-2">Name</th>
                <th className="border px-4 py-2">Designation</th>
                <th className="border px-4 py-2">Posting District</th>
                <th className="border px-4 py-2">Home State</th>
                <th className="border px-4 py-2">Year of Appointment</th>
                <th className="border px-4 py-2">Pay Scale Group</th>
                <th className="border px-4 py-2">Source of Recruitment</th>
                <th className="border px-4 py-2">Approval Status</th>
                <th className="border px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProfiles.map((profile) => (
                <tr key={profile.id}>
                  <td className="border px-4 py-2">{profile.name}</td>
                  <td className="border px-4 py-2">{profile.designation}</td>
                  <td className="border px-4 py-2">{profile.postingDistrict}</td>
                  <td className="border px-4 py-2">{profile.homeState}</td>
                  <td className="border px-4 py-2">{profile.yearOfAppointment}</td>
                  <td className="border px-4 py-2">{profile.payScaleGroup}</td>
                  <td className="border px-4 py-2">{profile.sourceOfRecruitment}</td>
                  <td className="border px-4 py-2">{profile.approvalStatus}</td>
                  <td className="border px-4 py-2">
                    <button onlick={() => handleEditProfile(profile.id)} className="text-blue-600">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDeleteProfile(profile.id)} className="text-red-600 ml-2">
                      <FaTrash />
                    </button>
                    <button onClick={() => handleToggleStatus(profile.id, profile.approvalStatus)} className="text-green-600 ml-2">
                      {profile.approvalStatus === "Approved" ? <FaTimes /> : <FaCheck />}
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

export default AISOfficerProfileList
