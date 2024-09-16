import React, { useState, useEffect } from 'react';

const RegisteredUsersList = () => {
  const [filters, setFilters] = useState({
    roleType: '',
    approvalStatus: '',
  });
  const [usersData, setUsersData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock Data for debugging
  const mockUsersData = [
    {
      id: 1,
      name: "John Doe",
      roleType: "MCS Officers",
      email: "john@example.com",
      phone: "1234567890",
      approvalStatus: "Approved",
    },
    {
      id: 2,
      name: "Jane Smith",
      roleType: "AIS Officers",
      email: "jane@example.com",
      phone: "0987654321",
      approvalStatus: "Pending",
    },
    {
      id: 3,
      name: "Michael Johnson",
      roleType: "Special Role",
      email: "michael@example.com",
      phone: "1122334455",
      approvalStatus: "Rejected",
    },
  ];

  // Simulating API call with mock data
  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        setLoading(true);
        // Instead of fetching from an API, use the mock data
        setUsersData(mockUsersData);
      } catch (err) {
        setError('Error fetching data.');
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleSearch = () => {
    console.log('Search filters:', filters);
  };

  const handleReset = () => {
    setFilters({
      roleType: '',
      approvalStatus: '',
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <p>Check your API endpoint and try again.</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white">
      <h2 className="text-xl font-bold mb-4">Registered Users List</h2>

      {/* Filters */}
      <div className="flex gap-4 mb-4">
        <select
          name="roleType"
          value={filters.roleType}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">Select Role Type</option>
          <option value="MCS Officers">MCS Officers</option>
          <option value="AIS Officers">AIS Officers</option>
          <option value="Special Role">Special Role</option>
        </select>

        <select
          name="approvalStatus"
          value={filters.approvalStatus}
          onChange={handleInputChange}
          className="border p-2 rounded w-full"
        >
          <option value="">- Select Approval Status -</option>
          <option value="Approved">Approved</option>
          <option value="Pending">Pending</option>
          <option value="Rejected">Rejected</option>
        </select>

        {/* Reset and Search Buttons */}
        <button
          onClick={handleReset}
          className="bg-gray-400 text-white px-4 py-2 rounded"
        >
          Reset
        </button>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Search
        </button>
      </div>

      {/* Users Table */}
      <table className="w-full table-auto border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Sr.No.</th>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role Type</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Phone</th>
            <th className="border px-4 py-2">Approval Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {usersData.map((user, index) => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{index + 1}</td>
              <td className="border px-4 py-2">{user.name}</td>
              <td className="border px-4 py-2">{user.roleType}</td>
              <td className="border px-4 py-2">{user.email}</td>
              <td className="border px-4 py-2">{user.phone}</td>
              <td className="border px-4 py-2">
                <span className={`px-2 py-1 text-sm rounded ${user.approvalStatus === 'Approved' ? 'bg-green-500' : user.approvalStatus === 'Pending' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                  {user.approvalStatus}
                </span>
              </td>
              <td className="border px-4 py-2">
                <button className="text-blue-500 mr-2">👁️</button>
                <button className="text-yellow-500 mr-2">✏️</button>
                <button className="text-red-500">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RegisteredUsersList;
