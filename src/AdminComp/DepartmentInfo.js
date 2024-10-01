import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';
import axios from 'axios'; // For API requests
import Swal from 'sweetalert2'; // Import SweetAlert

const DepartmentInfo = () => {
  const [documents, setDocuments] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [newDocument, setNewDocument] = useState({ type: '', url: '' });
  const [isEditing, setIsEditing] = useState(null); // For editing state
  const [editingDocument, setEditingDocument] = useState({ type: '', url: '' });

  // Fetch documents from the API
  const fetchDocuments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/department-info');
      setDocuments(response.data);
    } catch (error) {
      console.error('Error fetching documents:', error);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  // Add a new document
  const handleAddDocument = async () => {
    if (!newDocument.type || !newDocument.url) {
      Swal.fire('Error', 'Both fields are required before adding a document.', 'error');
      return; // Exit the function if fields are empty
    }
    try {
      await axios.post('http://localhost:8080/api/department-info', newDocument);
      Swal.fire('Success', 'Document added successfully!', 'success');
      fetchDocuments(); // Refresh the data after adding
      setNewDocument({ type: '', url: '' }); // Reset the form
    } catch (error) {
      console.error('Error adding document:', error);
      Swal.fire('Error', 'There was a problem adding the document.', 'error');
    }
  };

  // Edit document
  const handleEditDocument = async (id) => {
    try {
      await axios.put(`http://localhost:8080/api/department-info/${id}`, editingDocument);
      Swal.fire('Success', 'Document edited successfully!', 'success');
      fetchDocuments(); // Refresh the data after editing
      setIsEditing(null); // Exit editing mode
    } catch (error) {
      console.error('Error editing document:', error);
      Swal.fire('Error', 'There was a problem editing the document.', 'error');
    }
  };

  // Delete document
  const handleDeleteDocument = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/department-info/${id}`);
      Swal.fire('Success', 'Document deleted successfully!', 'success');
      fetchDocuments(); // Refresh the data after deleting
    } catch (error) {
      console.error('Error deleting document:', error);
      Swal.fire('Error', 'There was a problem deleting the document.', 'error');
    }
  };

  // Search by type
  const handleSearch = () => {
    // Filter documents based on search term
    const filteredDocuments = documents.filter((doc) =>
      doc.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setDocuments(filteredDocuments);
  };

  // Reset search
  const handleReset = () => {
    setSearchTerm('');
    fetchDocuments(); // Reload the original data
  };

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white flex-grow overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Department Information</h2>

          {/* Search and Reset */}
          <div className="mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Type"
              className="border p-2 mr-2"
            />
            <button onClick={handleSearch} className="bg-blue-500 text-white px-4 py-2 mr-2">
              Search
            </button>
            <button onClick={handleReset} className="bg-gray-500 text-white px-4 py-2">
              Reset
            </button>
          </div>

          {/* Add new document */}
          <div className="mb-4">
            <input
              type="text"
              value={newDocument.type}
              onChange={(e) => setNewDocument({ ...newDocument, type: e.target.value })}
              placeholder="Document Type"
              className="border p-2 mr-2"
            />
            <input
              type="text"
              value={newDocument.url}
              onChange={(e) => setNewDocument({ ...newDocument, url: e.target.value })}
              placeholder="Document URL"
              className="border p-2 mr-2"
            />
            <button onClick={handleAddDocument} className="bg-green-500 text-white px-4 py-2">
              Add Department Info
            </button>
          </div>

          {/* Documents Table */}
          <table className="min-w-full border border-gray-300 rounded-lg overflow-hidden">
  <thead className="bg-blue-500 text-white">
    <tr>
      <th className="border px-4 py-2 text-center">Sr. No.</th>
      <th className="border px-4 py-2 text-center">Type</th>
      <th className="border px-4 py-2 text-center">Action</th>
    </tr>
  </thead>
  <tbody>
    {documents.map((doc, index) => (
      <tr key={doc.id}>
        <td className="border px-4 py-2 text-center">{index + 1}</td>
        <td className="border px-4 py-2 text-center">
          {isEditing === doc.id ? (
            <input
              type="text"
              value={editingDocument.type}
              onChange={(e) => setEditingDocument({ ...editingDocument, type: e.target.value })}
              className="border p-2"
            />
          ) : (
            doc.type
          )}
        </td>
        <td className="border px-4 py-2 text-center">
          {isEditing === doc.id ? (
            <>
              <button
                onClick={() => handleEditDocument(doc.id)}
                className="bg-blue-500 text-white px-2 py-1 mr-2"
              >
                Save
              </button>
              <button onClick={() => setIsEditing(null)} className="bg-red-500 text-white px-2 py-1">
                Cancel
              </button>
            </>
          ) : (
            <>
              <a
                href={doc.url}
                download
                className="text-blue-500 hover:underline mr-2"
              >
                Download
              </a>
              <button
                onClick={() => setIsEditing(doc.id)}
                className="bg-yellow-500 text-white px-2 py-1 mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteDocument(doc.id)}
                className="bg-red-500 text-white px-2 py-1"
              >
                Delete
              </button>
            </>
          )}
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

export default DepartmentInfo;
