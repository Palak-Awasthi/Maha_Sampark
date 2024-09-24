import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";

const AdminRevenueForum = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [formState, setFormState] = useState({ approvedStatus: "", searchTerm: "" });
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  // Dummy Data
  const dummyData = [
    {
      id: 1,
      title: "Revenue Subject A",
      type: "Type 1",
      addedBy: "Admin",
      dateTime: "2024-09-21 12:30",
      approvedStatus: "Pending",
    },
    {
      id: 2,
      title: "Revenue Subject B",
      type: "Type 2",
      addedBy: "User",
      dateTime: "2024-09-22 14:00",
      approvedStatus: "Approved",
    },
    // More dummy data here
  ];

  // Fetch data from API (Using dummy data for now)
  const fetchData = async () => {
    setData(dummyData);  // Using dummy data
    setFilteredData(dummyData);  // Setting filtered data initially
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
    filterData({ ...formState, [name]: value });
  };

  // Filter data based on the form values
  const filterData = (searchValues) => {
    const { searchTerm, approvedStatus } = searchValues;

    const filtered = data.filter((item) => {
      const matchesApprovedStatus =
        !approvedStatus || item.approvedStatus === approvedStatus;
      const matchesSearchTerm =
        !searchTerm || item.title.toLowerCase().includes(searchTerm.toLowerCase());

      return matchesApprovedStatus && matchesSearchTerm;
    });

    setFilteredData(filtered);
  };

  // Reset filter and search form
  const handleReset = () => {
    setFormState({ approvedStatus: "", searchTerm: "" });
    setFilteredData(data);  // Reset filtered data to the original dataset
  };

  // Sort the data based on the selected field and direction
  const sortedData = useMemo(() => {
    if (!sortField) return filteredData;
    return [...filteredData].sort((a, b) => {
      const result = a[sortField].toString().localeCompare(b[sortField].toString());
      return sortDirection === "asc" ? result : -result;
    });
  }, [filteredData, sortField, sortDirection]);

  // Handle sorting
  const handleSort = (column) => {
    const direction = sortDirection === "asc" ? "desc" : "asc";
    setSortField(column.selector);
    setSortDirection(direction);
  };

  // Modal handlers
  const openModal = (item) => {
    setSelectedItem(item);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedItem(null);
  };

  // Handle Edit and Delete Actions
  const handleEdit = (id) => {
    console.log("Edit ID:", id);
    openModal(id); // You can open the modal for inline editing
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this item?")) {
      setData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  // Handle Status Change
  const handleStatusChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, approvedStatus: newStatus } : item
      )
    );

    // Optionally, you can call an API to update the status in the backend.
    // axios.put(`http://localhost:8080/api/revenue/${id}`, { approvedStatus: newStatus })
    //   .then(response => console.log("Status updated successfully"))
    //   .catch(error => console.error("Error updating status:", error));
  };

  // Inline editable rows
  const handleInlineEdit = (id, field, value) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  // Columns for DataTable
  const columns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, sortable: true },
    {
      name: "Title",
      selector: (row) => (
        <input
          type="text"
          value={row.title}
          onChange={(e) => handleInlineEdit(row.id, "title", e.target.value)}
          className="border p-1 rounded"
        />
      ),
      sortable: true,
    },
    { name: "Type", selector: (row) => row.type, sortable: true },
    { name: "Added By", selector: (row) => row.addedBy, sortable: true },
    { name: "Date Time", selector: (row) => row.dateTime, sortable: true },
    {
      name: "Approved Status",
      selector: (row) => (
        <select
          value={row.approvedStatus}
          onChange={(e) => handleStatusChange(row.id, e.target.value)}
          className="border p-1 rounded"
        >
          <option value="Pending">Pending</option>
          <option value="Approved">Approved</option>
        </select>
      ),
      sortable: true,
    },
    {
      name: "Actions",
      cell: (row) => (
        <div className="flex space-x-2">
          <button className="text-blue-500" onClick={() => handleEdit(row.id)}>
            <FaEdit /> Edit
          </button>
          <button className="text-red-500" onClick={() => handleDelete(row.id)}>
            <FaTrash /> Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminSidebar />
        <div className="flex-1 flex flex-col">
          <AdminHeader />
          <div className="p-6 flex-grow overflow-y-auto">
            <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-6">
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Revenue Forum</h1>
              <button className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110" title="Add New">
                Add New Revenue Subject
              </button>
            </div>

            {/* Search and Filter Options */}
            <div className="bg-white rounded-lg shadow-md mb-6 p-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Search Bar */}
                <div>
                  <label className="font-bold">Search by Title</label>
                  <input
                    type="text"
                    name="searchTerm"
                    value={formState.searchTerm}
                    onChange={handleInputChange}
                    placeholder="Search..."
                    className="border p-2 rounded-md w-full"
                  />
                </div>

                {/* Approved Status Dropdown */}
                <div>
                  <label className="font-bold">Approved Status</label>
                  <select
                    name="approvedStatus"
                    value={formState.approvedStatus}
                    onChange={handleInputChange}
                    className="border p-2 rounded-md w-full"
                  >
                    <option value="">Select</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                  </select>
                </div>
    
                {/* Reset Button */}
                <div className="flex items-end">
                  <button
                    onClick={handleReset}
                    className="p-2 bg-red-500 text-white rounded-md w-full"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>
    
            {/* DataTable for displaying revenue data */}
            <div className="overflow-x-auto">
              <DataTable
                columns={columns}
                data={sortedData}
                pagination
                striped
                highlightOnHover
                dense
                sortServer
                onSort={handleSort}
                customStyles={{
                  headRow: {
                    style: {
                      backgroundColor: '#1E90FF',
                      color: 'white',
                      fontWeight: 'bold',
                    },
                  },
                  cells: {
                    style: {
                      fontSize: '14px',
                    },
                  },
                }}
              />
            </div>
          </div>
          <AdminFooter />
        </div>
      </div>
    
      {/* Modal for Editing */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Revenue Item</h2>
            <p>Editing item ID: {selectedItem}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-md"
              >
                Close
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRevenueForum;
