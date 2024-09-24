import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

const AdminNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    category: "",
    date: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch news from backend API
  const fetchNewsData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/news", {
        params: filters,
      });
      setNewsData(response.data);
    } catch (err) {
      setError("Error fetching news data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewsData();
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({
      ...filters,
      [name]: value,
    });
  };

  const handleReset = () => {
    setFilters({
      title: "",
      category: "",
      date: "",
    });
  };

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white">
          <h2 className="text-xl font-bold mb-4">Admin News</h2>

          {/* Filters */}
          <div className="flex gap-4 mb-4">
            <input
              name="title"
              type="text"
              value={filters.title}
              onChange={handleInputChange}
              placeholder="Search Title"
              className="border p-2 rounded w-full"
            />

            <select
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            >
              <option value="">Select Category</option>
              {/* Add category options here */}
            </select>

            <input
              name="date"
              type="date"
              value={filters.date}
              onChange={handleInputChange}
              className="border p-2 rounded w-full"
            />

            {/* Reset and Search Buttons */}
            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Reset
            </button>
            <button
              onClick={fetchNewsData}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Search
            </button>
          </div>

          {/* Loading and Error Handling */}
          {loading && <p>Loading news...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {/* News Table */}
          <table className="w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Sr.No.</th>
                <th className="border px-4 py-2">Title</th>
                <th className="border px-4 py-2">Category</th>
                <th className="border px-4 py-2">Date</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {newsData.map((news, index) => (
                <tr key={news.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{news.title}</td>
                  <td className="border px-4 py-2">{news.category}</td>
                  <td className="border px-4 py-2">{news.date}</td>
                  <td className="border px-4 py-2">
                    <span
                      className={`px-2 py-1 text-sm rounded ${
                        news.status === "Published"
                          ? "bg-green-500"
                          : "bg-red-500"
                      } text-white`}
                    >
                      {news.status}
                    </span>
                  </td>
                  <td className="border px-4 py-2">
                    <button className="text-yellow-500 mr-2">✏️</button>
                    <button className="text-red-500">🗑️</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminNews;
