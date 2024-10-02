import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";

// Modal component for adding news
const AddNewsModal = ({ isOpen, onClose, onAdd }) => {
  const [newsData, setNewsData] = useState({
    title: "",
    addedby: "",
    dateandtime: "",
    content: "",
    photo: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewsData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setNewsData((prev) => ({ ...prev, photo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append("title", newsData.title);
    formData.append("addedby", newsData.addedby);
    formData.append("dateandtime", newsData.dateandtime);
    formData.append("content", newsData.content);
    formData.append("photo", newsData.photo);
    formData.append("status", "Pending"); // Status set to Pending

    try {
      await axios.post("http://localhost:8080/api/admin-news", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire("Success", "News submitted for approval!", "success");
      onAdd(); // Refresh the news data
      onClose(); // Close the modal
    } catch (err) {
      console.error("Error submitting news:", err);
      Swal.fire("Error", "There was an error submitting the news.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white p-6 rounded shadow-lg z-50 max-w-md w-full">
          <h2 className="text-lg font-bold mb-4">Add News</h2>
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
              value={newsData.photo}
              type="file"
              onChange={handlePhotoChange}
              className="mb-2"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="mr-2 bg-gray-300 text-black px-4 py-2 rounded"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

const News = () => {
  const [newsData, setNewsData] = useState([]);
  const [filters, setFilters] = useState({
    title: "",
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
    });
    fetchAllNewsData(); // Refresh data after reset
  };

  const filteredNewsData = newsData.filter(
    (news) =>
      news.status === "Approved" && // Only show approved news
      news.title.toLowerCase().includes(filters.title.toLowerCase())
  );

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 shadow-md">
        <h2 className="text-3xl font-bold text-blue-600 mb-4">News Portal</h2>
        <button
          onClick={() => setIsModalOpen(true)} // Open modal for adding news
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

        {/* News Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNewsData.length > 0 ? (
            filteredNewsData.map((news) => (
              <div
                key={news.id}
                className="bg-white p-4 shadow-md rounded-lg transition-transform transform hover:scale-105"
              >
                <img
                  src={`http://localhost:8080/api/admin-news/${news.photo}`}
                  alt={news.title}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  
                />
                <h3 className="text-lg font-bold">{news.title}</h3>
                <p className="text-gray-600 text-sm mb-2">{news.addedby}</p>
                <p className="text-gray-600 text-sm mb-4">
                  {new Date(news.dateandtime).toLocaleString()}
                </p>
                <p className="text-gray-800">
                  {news.content.length > 100
                    ? `${news.content.substring(0, 100)}...`
                    : news.content}
                </p>
              </div>
            ))
          ) : (
            <p>No news available.</p>
          )}
        </div>
      </div>

      {/* Add News Modal */}
      <AddNewsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddNews}
      />
    </div>
  );
};

export default News;
