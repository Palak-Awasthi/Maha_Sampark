import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";

// Modal component for adding news
const AddNewsModal = ({ isOpen, onClose, onAdd }) => {
  const [newNews, setNewNews] = useState({
    title: "",
    addedby: "",
    dateandtime: "",
    content: "",
    photo: null,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewNews((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setNewNews((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    for (const key in newNews) {
      formData.append(key, newNews[key]);
    }

    try {
      await axios.post("http://localhost:8080/api/admin-news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      onAdd(); // Refresh the news data
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error adding news:", err);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">Add News</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              type="text"
              value={newNews.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="addedby"
              type="text"
              value={newNews.addedby}
              onChange={handleInputChange}
              placeholder="Added By"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="dateandtime"
              type="datetime-local"
              value={newNews.dateandtime}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <textarea
              name="content"
              value={newNews.content}
              onChange={handleInputChange}
              placeholder="Content"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="photo"
              type="file"
              onChange={handlePhotoChange}
              className="mb-2"
              required
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Add News
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

const AdminNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
    status: "",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchAllNewsData = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin-news");
      setNewsData(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Error fetching news data.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllNewsData();
  }, []);

  const handleAddNews = () => {
    fetchAllNewsData(); // Refresh data after adding news
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({
      title: "",
      status: "",
    });
    fetchAllNewsData(); // Refresh data after reset
  };

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:8080/api/admin-news/${id}`, { status });
      fetchAllNewsData(); // Refresh data after status change
    } catch (err) {
      console.error("Error updating status:", err);
    }
  };

  // Filtered news data based on the title filter
  const filteredNewsData = newsData.filter((news) =>
    news.title.toLowerCase().includes(filters.title.toLowerCase())
  );

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white flex-grow overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Admin News</h2>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
          >
            Add News
          </button>

          {/* Filters Section */}
          <div className="flex gap-4 mb-4">
            <input
              name="title"
              type="text"
              value={filters.title}
              onChange={handleInputChange}
              placeholder="Search Title"
              className="border p-2 rounded w-full sm:w-1/4"
            />

            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="border p-2 rounded w-full sm:w-1/4"
            >
              <option value="">Select Status</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>

            <button
              onClick={handleReset}
              className="bg-gray-400 text-white px-4 py-2 rounded"
            >
              Reset
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
                <th className="border px-4 py-2">Date And Time</th>
                <th className="border px-4 py-2">Status</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsData.length > 0 ? (
                filteredNewsData.map((news, index) => (
                  <tr key={news.id}>
                    <td className="border px-4 py-2">{index + 1}</td>
                    <td className="border px-4 py-2">{news.title}</td>
                    <td className="border px-4 py-2">{news.dateandtime}</td>
                    <td className="border px-4 py-2">
                      <span
                        className={`px-2 py-1 text-sm rounded ${
                          news.status === "Approved"
                            ? "bg-green-500"
                            : "bg-red-500"
                        } text-white`}
                      >
                        {news.status}
                      </span>
                    </td>
                    <td className="border px-4 py-2">
                      <button
                        onClick={() => handleStatusChange(news.id, "Approved")}
                        className="text-green-500 mr-2"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleStatusChange(news.id, "Pending")}
                        className="text-yellow-500"
                      >
                        Set to Pending
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="border px-4 py-2 text-center">
                    No news found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>
      <AddNewsModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={handleAddNews} />
    </div>
  );
};

export default AdminNews;
