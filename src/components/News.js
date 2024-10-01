import React, { useState, useEffect } from 'react';
import { FaPlus, FaSearch } from 'react-icons/fa';
import axios from 'axios';

function News() {
  const [news, setNews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [newStory, setNewStory] = useState({ title: '', content: '', imageUrl: '' });
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin-news');
      const acceptedNews = response.data.filter(news => news.status === 'Accepted');
      setNews(acceptedNews);
    } catch (error) {
      console.error('Error fetching news:', error);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setNewStory({ ...newStory, [name]: value });
  };

  const handleAddNews = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', newStory.title);
    formData.append('content', newStory.content);
    formData.append('addedby', 'Admin');
    formData.append('dateandtime', new Date().toISOString());
    formData.append('status', 'Pending');
    formData.append('photo', null);

    try {
      await axios.post('http://localhost:8080/api/admin-news', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('News added successfully! Pending admin approval.');
      setShowForm(false);
    } catch (error) {
      console.error('Error adding news:', error);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredNews = news.filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 bg-gradient-to-br from-blue-100 to-blue-400 rounded-lg shadow-lg max-h-[500px] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-4 text-blue-600">News</h2>

      {/* Add News Button */}
      <button
        className="mb-4 bg-gradient-to-r from-blue-500 to-green-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transform hover:scale-105 transition-transform duration-300"
        onClick={() => setShowForm(!showForm)}
      >
        <FaPlus className="inline mr-2" />
        Add News
      </button>

      {/* Search Bar */}
      <div className="mb-4 flex items-center border border-gray-300 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <FaSearch className="text-gray-400 ml-3" />
        <input
          type="text"
          placeholder="Search news..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-full p-3 border-0 rounded-l focus:outline-none bg-white"
        />
      </div>

      {/* News Form */}
      {showForm && (
        <form onSubmit={handleAddNews} className="mb-4 p-4 bg-white rounded-lg shadow-md">
          <input
            type="text"
            name="title"
            placeholder="Title"
            value={newStory.title}
            onChange={handleFormChange}
            className="w-full p-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <textarea
            name="content"
            placeholder="Content"
            value={newStory.content}
            onChange={handleFormChange}
            className="w-full p-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
          />
          <input
            type="text"
            name="imageUrl"
            placeholder="Image URL"
            value={newStory.imageUrl}
            onChange={handleFormChange}
            className="w-full p-2 mb-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-transform duration-300 transform hover:scale-105"
          >
            Add News
          </button>
        </form>
      )}

      {/* News Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredNews.map((item, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105 h-[250px] overflow-hidden"
          >
            {item.imageUrl && (
              <div className="relative overflow-hidden mb-2">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-24 object-cover rounded-lg transition-transform duration-300 hover:scale-110"
                />
              </div>
            )}
            <h3 className="text-lg font-semibold text-gray-800 mb-1">{item.title}</h3>
            <p className="text-gray-600 text-sm overflow-hidden">{item.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default News;
