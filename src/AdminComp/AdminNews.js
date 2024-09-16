import React, { useState } from 'react';

const AdminNews = () => {
  // Sample data for news, in a real app this can come from an API call
  const [newsData, setNewsData] = useState([
    { id: 1, title: 'news 19 nov', addedBy: 'Admin', dateTime: '19-11-2023', status: 'Accepted' },
    { id: 2, title: 'News 24.09', addedBy: 'Admin', dateTime: '28-09-2023', status: 'Accepted' },
    { id: 3, title: 'News 28.09', addedBy: 'Admin', dateTime: '28-09-2023', status: 'Accepted' },
    { id: 4, title: 'News 24/8', addedBy: 'Admin', dateTime: '24-08-2023', status: 'Pending' },
  ]);

  const [searchTitle, setSearchTitle] = useState('');
  const [approvalStatus, setApprovalStatus] = useState('');

  const handleSearch = () => {
    // Implement the search functionality
    console.log('Search triggered with:', searchTitle, approvalStatus);
  };

  const resetSearch = () => {
    setSearchTitle('');
    setApprovalStatus('');
  };

  const handleAction = (action, id) => {
    // Implement the logic for viewing, editing, deleting news
    console.log(`${action} action triggered for news ID:`, id);
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">News</h2>
        <button className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600">+ Add New News</button>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <input
          type="text"
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none"
          placeholder="Enter Title"
          value={searchTitle}
          onChange={(e) => setSearchTitle(e.target.value)}
        />
        <select
          className="border border-gray-300 rounded py-2 px-4 focus:outline-none"
          value={approvalStatus}
          onChange={(e) => setApprovalStatus(e.target.value)}
        >
          <option value="">- Select Approval Status -</option>
          <option value="Accepted">Accepted</option>
          <option value="Pending">Pending</option>
        </select>
        <button
          onClick={resetSearch}
          className="bg-gray-300 py-2 px-4 rounded hover:bg-gray-400"
        >
          Reset
        </button>
        <button
          onClick={handleSearch}
          className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          Search
        </button>
      </div>

      <table className="min-w-full bg-white shadow-md rounded">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4">Sr. No</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Added by</th>
            <th className="py-3 px-4">Date/Time</th>
            <th className="py-3 px-4">Approval Status</th>
            <th className="py-3 px-4">Action</th>
          </tr>
        </thead>
        <tbody>
          {newsData.map((news, index) => (
            <tr key={news.id} className="border-t">
              <td className="py-3 px-4">{index + 1}</td>
              <td className="py-3 px-4">{news.title}</td>
              <td className="py-3 px-4">{news.addedBy}</td>
              <td className="py-3 px-4">{news.dateTime}</td>
              <td className="py-3 px-4">
                <span
                  className={`px-2 py-1 text-xs font-semibold rounded ${
                    news.status === 'Accepted' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'
                  }`}
                >
                  {news.status}
                </span>
              </td>
              <td className="py-3 px-4 flex gap-2">
                <button
                  onClick={() => handleAction('view', news.id)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  👁
                </button>
                <button
                  onClick={() => handleAction('edit', news.id)}
                  className="text-yellow-500 hover:text-yellow-700"
                >
                  ✏️
                </button>
                <button
                  onClick={() => handleAction('delete', news.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  🗑
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminNews;
