import React, { useEffect, useState } from "react";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import AdminHeader from "./AdminHeader";
import AdminSidebar from "./AdminSidebar";
import AdminFooter from "./AdminFooter";
import AddNewsModal from "./AddNewsModal";
import EditNewsModal from "./EditNewsModal"; // Import the EditNewsModal
import axios from "axios";

const AdminNews = () => {
  const [newsData, setNewsData] = useState([]);
  const [filteredNewsData, setFilteredNewsData] = useState([]);
  const [filters, setFilters] = useState({ title: "", status: "" });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editNews, setEditNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNewsData();
  }, []);

  const fetchNewsData = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:8080/api/admin-news");
      setNewsData(response.data);
      setFilteredNewsData(response.data);
    } catch (error) {
      setError("Error fetching news data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleReset = () => {
    setFilters({ title: "", status: "" });
    setFilteredNewsData(newsData);
  };

  const handleEdit = (news) => {
    setEditNews(news);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin-news/${id}`);
      fetchNewsData(); // Refresh data after deletion
    } catch (error) {
      setError("Error deleting news");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Approved" ? "Pending" : "Approved";
    try {
      await axios.put(`http://localhost:8080/api/admin-news/${id}`, { status: newStatus });
      fetchNewsData(); // Refresh data after status change
    } catch (error) {
      setError("Error updating news status");
    }
  };

  const handleAddNews = async (news) => {
    try {
      await axios.post("http://localhost:8080/api/admin-news", news);
      setIsAddModalOpen(false);
      fetchNewsData(); // Refresh data after adding
    } catch (error) {
      setError("Error saving news");
    }
  };

  const handleUpdateNews = async (news) => {
    try {
      await axios.put(`http://localhost:8080/api/admin-news/${editNews.id}`, news);
      setIsEditModalOpen(false);
      setEditNews(null);
      fetchNewsData(); // Refresh data after updating
    } catch (error) {
      setError("Error updating news");
    }
  };

  useEffect(() => {
    // Filter the news data based on filters
    const filteredData = newsData.filter((news) => {
      return (
        (filters.title ? news.title.includes(filters.title) : true) &&
        (filters.status ? news.status === filters.status : true)
      );
    });
    setFilteredNewsData(filteredData);
  }, [filters, newsData]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1">
        <AdminHeader />
        <div className="p-4">
          <h1 className="text-xl font-bold mb-4">Admin News</h1>

          <button onClick={() => setIsAddModalOpen(true)} className="bg-blue-500 text-white px-4 py-2 rounded">Add News</button>

          <div className="mb-4">
            <input
              name="title"
              type="text"
              value={filters.title}
              onChange={handleInputChange}
              placeholder="Filter by Title"
              className="border p-2 rounded w-1/2"
            />
            <select
              name="status"
              value={filters.status}
              onChange={handleInputChange}
              className="border p-2 rounded w-1/2 ml-2"
            >
              <option value="">All Status</option>
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
            <button onClick={handleReset} className="bg-gray-400 text-white px-4 py-2 rounded ml-2">Reset</button>
          </div>

          {loading && <p>Loading...</p>}
          {error && <p>{error}</p>}
          
          <table className="min-w-full border-collapse border border-gray-200">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2">Title</th>
                <th className="border border-gray-300 p-2">Added By</th>
                <th className="border border-gray-300 p-2">Date & Time</th>
                <th className="border border-gray-300 p-2">Content</th>
                <th className="border border-gray-300 p-2">Image</th>
                <th className="border border-gray-300 p-2">Status</th>
                <th className="border border-gray-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsData.map((news) => (
                <tr key={news.id}>
                  <td className="border border-gray-300 p-2">{news.title}</td>
                  <td className="border border-gray-300 p-2">{news.addedby}</td>
                  <td className="border border-gray-300 p-2">{news.dateandtime}</td>
                  <td className="border border-gray-300 p-2">{news.content}</td>
                  <td className="border border-gray-300 p-2">{news.photo}</td>
                  <td className="border border-gray-300 p-2">
                    <button 
                      onClick={() => handleToggleStatus(news.id, news.status)} 
                      className={`px-2 py-1 rounded ${
                        news.status === "Approved" ? "bg-green-500 text-white" : "bg-yellow-500 text-white"
                      }`}
                    >
                      {news.status}
                    </button>
                  </td>
                  <td className="border border-gray-300 p-2">
                    <button onClick={() => handleEdit(news)}><FaEdit /></button>
                    <button onClick={() => handleDelete(news.id)}><FaTrashAlt /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <AddNewsModal
            isOpen={isAddModalOpen}
            onClose={() => setIsAddModalOpen(false)}
            onAdd={handleAddNews}
          />

          <EditNewsModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onUpdate={handleUpdateNews}
            newsData={editNews}
          />

        </div>
        <AdminFooter />
      </div>
    </div>
  );
};

export default AdminNews;
