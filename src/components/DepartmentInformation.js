import React, { useState, useEffect } from 'react';
import axios from 'axios'; // For API requests

const DepartmentInformationUser = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true); // Loading state

  // Fetch documents from the API
  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8080/api/department-info');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Search documents by type
  const filteredDocuments = documents.filter(doc =>
    doc.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 min-h-screen rounded-lg shadow-lg">
    <h2 className="text-3xl font-bold mb-6 text-blue-600">Departments Information</h2>

      {/* Search Bar */}
      <div className="mb-4">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by Type"
          className="border p-2 mr-2 rounded"
        />
      </div>

      {/* Loading State */}
      {loading ? (
        <p>Loading documents...</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Cards for Documents */}
          {filteredDocuments.map((doc) => (
            <div key={doc.id} className="bg-gradient-to-r from-green-400 to-blue-500 text-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold mb-2">{doc.type}</h3>
              <a
                href={doc.url}
                download
                className="text-blue-500 hover:underline"
              >
                Download Document
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentInformationUser;
