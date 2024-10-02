import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const EditNewsModal = ({ isOpen, onClose, onUpdate, newsData }) => {
  const [title, setTitle] = useState("");
  const [addedby, setAddedBy] = useState("");
  const [dateandtime, setDateAndTime] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState(true); // true for Approved, false for Pending
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    if (newsData) {
      setTitle(newsData.title);
      setAddedBy(newsData.addedby);
      setDateAndTime(newsData.dateandtime);
      setContent(newsData.content);
      setStatus(newsData.status === "Approved"); // Convert status to boolean
    }
  }, [newsData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedNewsData = { title, addedby, dateandtime, content, status: status ? "Approved" : "Pending", photo };

    await onUpdate(updatedNewsData);

    Swal.fire({
      icon: 'success',
      title: 'News Updated',
      text: 'Your news has been successfully updated!',
      confirmButtonText: 'OK',
    });

    onClose(); // Close the modal after updating news
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Edit News</h2>
          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              placeholder="Title" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <input 
              type="text" 
              placeholder="Added By" 
              value={addedby} 
              onChange={(e) => setAddedBy(e.target.value)} 
              required 
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <input 
              type="text" 
              placeholder="Date and Time" 
              value={dateandtime} 
              onChange={(e) => setDateAndTime(e.target.value)} 
              required 
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            />
            <textarea 
              placeholder="Content" 
              value={content} 
              onChange={(e) => setContent(e.target.value)} 
              required 
              className="border border-gray-300 rounded-md p-2 mb-4 w-full h-24"
            />
            <div className="flex items-center mb-4">
              <label className="mr-2">Status:</label>
              <button
                type="button"
                className={`w-16 h-8 flex items-center rounded-full p-1 cursor-pointer ${status ? 'bg-green-500' : 'bg-red-500'}`}
                onClick={() => setStatus(!status)}
              >
                <div className={`bg-white w-6 h-6 rounded-full transition-transform duration-300 transform ${status ? 'translate-x-8' : 'translate-x-0'}`}></div>
              </button>
              <span className="ml-2">{status ? "Approved" : "Pending"}</span>
            </div>
            <input 
              type="file" 
              onChange={(e) => setPhoto(e.target.files[0])} 
              className="border border-gray-300 rounded-md mb-4 w-full"
            />
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Update News</button>
              <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default EditNewsModal;
