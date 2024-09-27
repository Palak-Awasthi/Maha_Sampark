import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSearch, FaSyncAlt, FaEdit, FaTrash, FaCheck, FaTimes } from "react-icons/fa";
import { toast } from "react-toastify";
import AdminHeader from "../AdminHeader";
import AdminSidebar from "../AdminSidebar";
import AdminFooter from "../AdminFooter";
import Swal from "sweetalert2"; // Import SweetAlert

const MCSAISDesignationMaster = () => {
    const [designations, setDesignations] = useState([]);
    const [staffDesignations, setStaffDesignations] = useState([]); // For storing fetched staff designations
    const [formState, setFormState] = useState({ type: "", designation: "", status: "Active" });
    const [isEditing, setIsEditing] = useState(null);
    const [errors, setErrors] = useState({ designation: "" });
    const [showSearch, setShowSearch] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchDesignations();
        fetchStaffDesignations(); // Fetch staff designations on load
    }, []);

    const fetchDesignations = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:8080/api/designations");
            setDesignations(response.data);
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchStaffDesignations = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/staff");
            setStaffDesignations(response.data); // Update state with fetched staff designations
        } catch (error) {
            handleError(error);
        }
    };

    const handleAddOrUpdateDesignation = async () => {
        const trimmedDesignation = formState.designation.trim();
        const trimmedType = formState.type.trim();

        if (!trimmedDesignation) {
            setErrors((prevErrors) => ({ ...prevErrors, designation: "Designation is required." }));
            return;
        } else {
            setErrors((prevErrors) => ({ ...prevErrors, designation: "" }));
        }

        setLoading(true);
        try {
            let response;
            if (isEditing) {
                response = await axios.put(`http://localhost:8080/api/designations/${isEditing}`, formState);
                toast.success("Designation updated successfully!");
            } else {
                response = await axios.post("http://localhost:8080/api/designations", formState);
                toast.success("Designation added successfully!");
            }

            if (response.status === 200 || response.status === 201) {
                fetchDesignations();
                resetForm();
            }
        } catch (error) {
            handleError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleAddOrUpdateDesignation();
    };

    const handleEditDesignation = (id) => {
        const designation = designations.find((d) => d.id === id);
        setFormState({ type: designation.type, designation: designation.designation, status: designation.status });
        setIsEditing(id);
    };

    const handleDeleteDesignation = async (id) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            setLoading(true);
            try {
                await axios.delete(`http://localhost:8080/api/designations/${id}`);
                setDesignations(designations.filter((d) => d.id !== id));
                toast.success("Designation deleted successfully!");
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleToggleStatus = async (id) => {
        const designation = designations.find((d) => d.id === id);
        if (designation) {
            const newStatus = designation.status === "Active" ? "Inactive" : "Active";
            setLoading(true);
            try {
                // Ensure the status is sent correctly
                await axios.put(`http://localhost:8080/api/designations/${id}/status`, { status: newStatus });
                setDesignations((prevDesignations) =>
                    prevDesignations.map((d) =>
                        d.id === id ? { ...d, status: newStatus } : d
                    )
                );
                toast.success(`Designation status updated to ${newStatus}`);
            } catch (error) {
                handleError(error);
            } finally {
                setLoading(false);
            }
        }
    };

    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
    };

    const resetForm = () => {
        setFormState({ type: "", designation: "", status: "Active" });
        setIsEditing(null);
    };

    const handleError = (error) => {
        console.error("Error:", error);
        if (error.response) {
            toast.error(`Error: ${error.response.status} - ${error.response.data.message || "An error occurred."}`);
        } else {
            toast.error("An unexpected error occurred. Please try again.");
        }
    };

    const filteredDesignations = designations.filter((d) =>
        d.designation && d.designation.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex">
            <AdminSidebar />
            <div className="flex-grow">
                <AdminHeader />
                <div className="container mx-auto p-4">
                    {/* Header Section */}
                    <div className="flex justify-between items-center mb-6">
                        <div className="text-2xl font-bold text-black">MCS & AIS Designation Master</div>
                        <div className="flex items-center">
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded mr-2 transition-all hover:bg-blue-600"
                                onClick={() => setShowSearch(!showSearch)}
                            >
                                <FaSearch className="inline" /> {showSearch ? "Hide Search" : "Show Search"}
                            </button>
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded flex items-center transition-all hover:bg-gray-600"
                                onClick={() => {
                                    resetForm(); // Reset form fields when resetting search
                                }}
                            >
                                <FaSyncAlt className="mr-1" /> Reset
                            </button>
                        </div>
                    </div>
                    {/* Search Bar */}
                    {showSearch && (
                        <div className="mb-4">
                            <input
                                type="text"
                                placeholder="Search Designations..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="border border-gray-300 rounded p-2 w-full"
                            />
                        </div>
                    )}
                    {/* Form Section */}
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="flex gap-4">
                            <select
                                value={formState.type}
                                onChange={(e) => setFormState({ ...formState, type: e.target.value })}
                                className="border border-gray-300 rounded p-2 flex-grow"
                                required
                            >
                                <option value="" disabled>Select Type</option>
                                <option value="AIS">AIS</option>
                                <option value="MCS">MCS</option>
                            </select>
                            {/* Dropdown for staff designations */}
                            <select
                                value={formState.designation}
                                onChange={(e) => setFormState({ ...formState, designation: e.target.value })}
                                className="border border-gray-300 rounded p-2 flex-grow"
                                required
                            >
                                <option value="" disabled>Select Designation</option>
                                {staffDesignations.map((staff) => (
                                    <option key={staff.id} value={staff.designation}>
                                        {staff.designation}
                                    </option>
                                ))}
                            </select>
                            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded transition-all hover:bg-green-600">
                                {isEditing ? "Update" : "Submit"}
                            </button>
                        </div>
                        {errors.designation && <div className="text-red-500">{errors.designation}</div>}
                    </form>
                    {/* Designation Table */}
                    <div className="overflow-x-auto">
                        {loading ? (
                            <div>Loading...</div>
                        ) : (
                            <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="border border-gray-300 p-2">Sr. No.</th>
                                        <th className="border border-gray-300 p-2">Type</th>
                                        <th className="border border-gray-300 p-2">Designation Name</th>
                                        <th className="border border-gray-300 p-2">Status</th>
                                        <th className="border border-gray-300 p-2">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredDesignations.map((designation, index) => (
                                        <tr key={designation.id}>
                                            <td className="border border-gray-300 p-2">{index + 1}</td>
                                            <td className="border border-gray-300 p-2">{designation.type}</td>
                                            <td className="border border-gray-300 p-2">{designation.designation}</td>
                                            <td className="border border-gray-300 p-2">{designation.status}</td>
                                            <td className="border border-gray-300 p-2">
                                                <button
                                                    className="text-blue-500 hover:text-blue-700 mr-2"
                                                    onClick={() => handleEditDesignation(designation.id)}
                                                >
                                                    <FaEdit />
                                                </button>
                                                <button
                                                    className="text-red-500 hover:text-red-700 mr-2"
                                                    onClick={() => handleDeleteDesignation(designation.id)}
                                                >
                                                    <FaTrash />
                                                </button>
                                                <button
                                                    className="text-green-500 hover:text-green-700"
                                                    onClick={() => handleToggleStatus(designation.id)}
                                                >
                                                    {designation.status === "Active" ? <FaCheck /> : <FaTimes />}
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <AdminFooter />
            </div>
        </div>
    );
};

export default MCSAISDesignationMaster;
