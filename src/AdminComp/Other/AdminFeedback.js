import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import AdminHeader from "../AdminHeader";  // Import AdminHeader
import AdminFooter from "../AdminFooter";  // Import AdminFooter
import AdminSidebar from "../AdminSidebar";  // Import AdminSidebar

const AdminFeedback = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Dummy Data
  const dummyData = [
    {
      id: 1,
      feedback: "Great service!",
      name: "John Doe",
      email: "john@example.com",
      approved: "Approved",
      addedDate: "2024-09-20",
    },
    {
      id: 2,
      feedback: "Could be better.",
      name: "Jane Smith",
      email: "jane@example.com",
      approved: "Pending",
      addedDate: "2024-09-21",
    },
    {
      id: 3,
      feedback: "Very satisfied!",
      name: "Bob Johnson",
      email: "bob@example.com",
      approved: "Rejected",
      addedDate: "2024-09-22",
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
    filterData(value, statusFilter);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setStatusFilter(value);
    filterData(searchTerm, value);
  };

  // Reset search and status filter
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setFilteredData(data);
  };

  // Filter data based on the search term and selected status
  const filterData = (searchValue, statusValue) => {
    let filtered = data;

    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.feedback.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (statusValue && statusValue !== "All") {
      filtered = filtered.filter((item) => item.approved === statusValue);
    }

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

  // Handle Approved Status Change
  const handleApprovedChange = (id, newStatus) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id === id ? { ...item, approved: newStatus } : item
      )
    );
    filterData(searchTerm, statusFilter);
  };

  // Columns for DataTable
  const columns = [
    { name: "Sr. No.", selector: (row, index) => index + 1, sortable: true },
    { name: "Feedback", selector: (row) => row.feedback, sortable: true },
    { name: "Name", selector: (row) => row.name, sortable: true },
    { name: "Email", selector: (row) => row.email, sortable: true },
    {
      name: "Approved Status",
      selector: (row) => (
        <select
          value={row.approved}
          onChange={(e) => handleApprovedChange(row.id, e.target.value)}
          className="border rounded p-1"
        >
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>
      ),
      sortable: true,
    },
    { name: "Added Date", selector: (row) => row.addedDate, sortable: true },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-1">
        <AdminSidebar /> {/* Sidebar component */}
        <div className="flex-1 flex flex-col">
          <AdminHeader /> {/* Header component */}
          <div className="p-6 flex-grow overflow-y-auto">
            <h1 className="text-2xl font-bold mb-6">Admin Feedback</h1>

            {/* Search Bar */}
            <div className="mb-4 flex gap-4">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchChange}
                placeholder="Search Feedback..."
                className="border p-2 rounded-md flex-1"
              />
              <select
                value={statusFilter}
                onChange={handleStatusChange}
                className="border p-2 rounded-md"
              >
                <option value="All">All Statuses</option>
                <option value="Approved">Approved</option>
                <option value="Pending">Pending</option>
                <option value="Rejected">Rejected</option>
              </select>
              <button
                onClick={handleReset}
                className="p-2 bg-gray-500 text-white rounded-md"
              >
                Reset
              </button>
            </div>

            {/* DataTable for displaying feedback */}
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
          <AdminFooter /> {/* Footer component */}
        </div>
      </div>
    </div>
  );
};

export default AdminFeedback;
