import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import { FaEdit, FaTrash } from "react-icons/fa";
import AdminHeader from "../AdminHeader";
import AdminFooter from "../AdminFooter";
import AdminSidebar from "../AdminSidebar";

const AdminQuickAlert = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [isModalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Dummy Data
  const dummyData = [
    {
      id: 1,
      startDate: "2024-09-20",
      startTime: "10:00 AM",
      endDate: "2024-09-20",
      endTime: "11:00 AM",
      title: "Alert 1",
      alertInfo: "Important update regarding event.",
      status: "Active",
    },
    {
      id: 2,
      startDate: "2024-09-21",
      startTime: "12:00 PM",
      endDate: "2024-09-21",
      endTime: "01:00 PM",
      title: "Alert 2",
      alertInfo: "Meeting reminder.",
      status: "Inactive",
    },
    // More dummy data here
  ];

  // Fetch data from API (Using dummy data for now)
  const fetchData = async () => {
    setData(dummyData); // Using dummy data
    setFilteredData(dummyData); // Setting filtered data initially
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes for search
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    filterData(value);
  };

  // Filter data based on the search term
  const filterData = (searchValue) => {
    const filtered = data.filter((item) =>
      item.title.toLowerCase().includes(searchValue.toLowerCase())
    );

    setFilteredData(filtered);
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
    if (window.confirm("Are you sure you want to delete this alert?")) {
      setData((prevData) => prevData.filter((item) => item.id !== id));
      setFilteredData((prevData) => prevData.filter((item) => item.id !== id));
    }
  };

  // Handle Status Change
  const handleStatusChange = (id) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id
          ? { ...item, status: item.status === "Active" ? "Inactive" : "Active" }
          : item
      )
    );
  };

  // Columns for DataTable
  const columns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, sortable: true },
    { name: "Start Date", selector: (row) => row.startDate, sortable: true },
    { name: "Start Time", selector: (row) => row.startTime, sortable: true },
    { name: "End Date", selector: (row) => row.endDate, sortable: true },
    { name: "End Time", selector: (row) => row.endTime, sortable: true },
    { name: "Title", selector: (row) => row.title, sortable: true },
    { name: "Alert Info", selector: (row) => row.alertInfo, sortable: true },
    {
      name: "Status",
      selector: (row) => (
        <button
          onClick={() => handleStatusChange(row.id)}
          className={`px-2 py-1 rounded ${row.status === "Active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
        >
          {row.status}
        </button>
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
              <h1 className="text-2xl sm:text-3xl font-bold">Admin Quick Alerts</h1>
              <button className="p-2 bg-blue-500 text-white rounded-md transition-transform transform hover:scale-110" title="Add Quick Alert">
                Add Quick Alert
              </button>
            </div>

            {/* Search Bar */}
            <div className="mb-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search by Title..."
                className="border p-2 rounded-md w-full"
              />
            </div>

            {/* DataTable for displaying quick alerts */}
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

      {/* Modal for Editing (placeholder) */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Edit Quick Alert</h2>
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

export default AdminQuickAlert;
