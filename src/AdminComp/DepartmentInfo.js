import React, { useState, useEffect } from 'react';
import AdminSidebar from './AdminSidebar';
import AdminHeader from './AdminHeader';
import AdminFooter from './AdminFooter';

const DepartmentInfo = () => {
  const [documents, setDocuments] = useState([]);

  // Dummy data for demonstration
  const fetchDocuments = () => {
    const dummyData = [
      {
        id: 1,
        type: 'Department Guidelines',
        url: '/downloads/guidelines.pdf',
      },
      {
        id: 2,
        type: 'Annual Report',
        url: '/downloads/annual_report.pdf',
      },
      {
        id: 3,
        type: 'Policy Document',
        url: '/downloads/policy_document.pdf',
      },
      // Add more documents as needed
    ];
    setDocuments(dummyData);
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex flex-col flex-grow">
        <AdminHeader />
        <div className="p-6 bg-white flex-grow overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">Department Information</h2>
          <p className="mb-4">You can download the following documents:</p>

          <table className="min-w-full table-auto border-collapse">
            <thead>
              <tr>
                <th className="border px-4 py-2">Sr. No.</th>
                <th className="border px-4 py-2">Type</th>
                <th className="border px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr key={doc.id}>
                  <td className="border px-4 py-2">{index + 1}</td>
                  <td className="border px-4 py-2">{doc.type}</td>
                  <td className="border px-4 py-2">
                    <a
                      href={doc.url}
                      download
                      className="text-blue-500 hover:underline"
                    >
                      Download
                    </a>
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
