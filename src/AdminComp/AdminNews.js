import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import AdminFooter from "./AdminFooter";
import Swal from "sweetalert2";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

// Modal component for adding or editing news
const AddNewsModal = ({ isOpen, onClose, onAdd, editNews }) => {
  const [newsData, setNewsData] = useState({
    title: "",
    addedby: "",
    dateandtime: "",
    content: "",
    photo: null,
    status: "Approved", // Set default status to "Approved"
  });

  useEffect(() => {
    if (editNews) {
      setNewsData(editNews);
    } else {
      setNewsData({
        title: "",
        addedby: "",
        dateandtime: "",
        content: "",
        photo: null,
        status: "Approved", // Set default status to "Approved"
      });
    }
  }, [editNews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setNewsData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", newsData.title);
    formData.append("addedby", newsData.addedby);
    formData.append("dateandtime", newsData.dateandtime);
    formData.append("content", newsData.content);
    formData.append("photo", newsData.photo);
    formData.append("status", newsData.status);

    try {
      if (editNews) {
        // Update news
        await axios.put(`http://localhost:8080/api/admin-news/${editNews.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire("Updated!", "The news has been updated.", "success");
      } else {
        // Add new news
        await axios.post("http://localhost:8080/api/admin-news", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire("Success", "News added successfully!", "success");
      }

      onAdd(); // Refresh the news data
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error submitting news:", err);
      Swal.fire("Error", "There was an error submitting the news.", "error");
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg">
          <h2 className="text-lg font-bold mb-4">{editNews ? "Edit News" : "Add News"}</h2>
          <form onSubmit={handleSubmit}>
            <input
              name="title"
              type="text"
              value={newsData.title}
              onChange={handleInputChange}
              placeholder="Title"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="addedby"
              type="text"
              value={newsData.addedby}
              onChange={handleInputChange}
              placeholder="Added By"
              className="border p-2 rounded w-full mb-2"
              required
            />
            <input
              name="dateandtime"
              type="datetime-local"
              value={newsData.dateandtime}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
              required
            />
            <textarea
              name="content"
              value={newsData.content}
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
            />
            <select
              name="status"
              value={newsData.status}
              onChange={handleInputChange}
              className="border p-2 rounded w-full mb-2"
            >
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
            </select>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
                Submit
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
  const [editNews, setEditNews] = useState(null);

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
    fetchAllNewsData(); // Refresh data after adding or editing news
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

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/admin-news/${id}`);
      Swal.fire("Deleted!", "The news has been deleted.", "success");
      fetchAllNewsData(); // Refresh data after deletion
    } catch (err) {
      console.error("Error deleting news:", err);
      Swal.fire("Error", "There was an error deleting the news.", "error");
    }
  };

  const handleEdit = (news) => {
    setEditNews(news); // Pass the selected news to the modal
    setIsModalOpen(true); // Open the modal for editing
  };

  const filteredNewsData = newsData.filter(
    (news) =>
      news.title.toLowerCase().includes(filters.title.toLowerCase()) &&
      (filters.status === "" || news.status === filters.status)
  );
  

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white flex-grow overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Admin News</h2>
          <button
            onClick={() => {
              setEditNews(null); // Reset edit news data
              setIsModalOpen(true); // Open modal for adding news
            }}
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
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border border-gray-200 p-2">Title</th>
                <th className="border border-gray-200 p-2">Added By</th>
                <th className="border border-gray-200 p-2">Date & Time</th>
                <th className="border border-gray-200 p-2">Content</th>
                <th className="border border-gray-200 p-2">Status</th>
                <th className="border border-gray-200 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredNewsData.map((news) => (
                <tr key={news.id}>
                  <td className="border border-gray-200 p-2">{news.title}</td>
                  <td className="border border-gray-200 p-2">{news.addedby}</td>
                  <td className="border border-gray-200 p-2">{news.dateandtime}</td>
                  <td className="border border-gray-200 p-2">{news.content}</td>
                  <td className="border border-gray-200 p-2">
  <span
    style={{
      display: 'inline-block',
      padding: '0.2em 0.5em',
      backgroundColor: '#d4edda',
      color: '#155724',
      border: '1px solid #c3e6cb',
      borderRadius: '0.25rem'
    }}
  >
    Approved
  </span>
</td>

                  <td className="border border-gray-200 p-2 flex space-x-2">
                    <button onClick={() => handleEdit(news)} className="text-blue-500">
                      <FaEdit />
                    </button>
                    <button onClick={() => handleDelete(news.id)} className="text-red-500">
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <AdminFooter />
      </div>

      {/* Add/Edit News Modal */}
      <AddNewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddNews}
        editNews={editNews}
      />
    </div>
  );
};

export default AdminNews;
