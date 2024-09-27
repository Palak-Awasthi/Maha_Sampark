import React, { useState, useEffect, useMemo } from "react";
import DataTable from "react-data-table-component";
import AdminHeader from "../AdminHeader";  // Import AdminHeader
import AdminFooter from "../AdminFooter";  // Import AdminFooter
import AdminSidebar from "../AdminSidebar";  // Import AdminSidebar
import axios from "axios"; // Import axios for API calls

const AdminFeedback = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Fetch data from API
  const fetchData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/feedback"); // Correct API endpoint for fetching feedback data
      console.log("API Response:", response.data); // Debugging: check the data being returned
      setData(response.data); // Assuming the response contains an array of feedback objects
      setFilteredData(response.data); // Set filtered data initially
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle input changes for search
  const handleSearchChange = (e) => {
    const { value } = e.target;
    setSearchTerm(value);
    filterData(value, statusFilter, dateFilter);
  };

  // Handle status filter change
  const handleStatusChange = (e) => {
    const { value } = e.target;
    setStatusFilter(value);
    filterData(searchTerm, value, dateFilter);
  };

  // Handle date filter change
  const handleDateChange = (e) => {
    const { value } = e.target;
    setDateFilter(value);
    filterData(searchTerm, statusFilter, value);
  };

  // Reset search and filters
  const handleReset = () => {
    setSearchTerm("");
    setStatusFilter("All");
    setDateFilter("");
    setFilteredData(data); // Reset filtered data to the original dataset
  };

  // Filter data based on search term, status, and date
  const filterData = (searchValue, statusValue, dateValue) => {
    let filtered = data;

    if (searchValue) {
      filtered = filtered.filter((item) =>
        item.feedback.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    if (statusValue && statusValue !== "All") {
      filtered = filtered.filter((item) => item.approved === statusValue);
    }

    if (dateValue) {
      filtered = filtered.filter((item) => item.addedDate === dateValue);
    }

    setFilteredData(filtered); // Update filtered data
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
  const handleApprovedChange = async (id, newStatus) => {
    try {
      await axios.put(`/api/feedback/${id}`, { approved: newStatus }); // Correct API endpoint for updating feedback status
      setData((prevData) =>
        prevData.map((item) =>
          item.id === id ? { ...item, approved: newStatus } : item
        )
      );
      filterData(searchTerm, statusFilter, dateFilter); // Re-filter data after updating status
    } catch (error) {
      console.error("Error updating feedback status:", error);
    }
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
              <input
                type="date"
                value={dateFilter}
                onChange={handleDateChange}
                className="border p-2 rounded-md"
              />
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
                noDataComponent="There are no records to display." // Custom message
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
