import React, { useState } from "react";
import Swal from "sweetalert2";

const AddNewsModal = ({ isOpen, onClose, onAdd }) => {
  const [title, setTitle] = useState("");
  const [addedby, setAddedBy] = useState("");
  const [dateandtime, setDateAndTime] = useState("");
  const [content, setContent] = useState("");
  const [status, setStatus] = useState("Approved");
  const [photo, setPhoto] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newsData = { title, addedby, dateandtime, content, status, photo };
    
    // Call the onAdd function and await its completion if it's an async function
    await onAdd(newsData);
    
    // Show success message
    Swal.fire({
      icon: 'success',
      title: 'News Added',
      text: 'Your news has been successfully added!',
      confirmButtonText: 'OK',
    });

    // Reset the form fields
    setTitle("");
    setAddedBy("");
    setDateAndTime("");
    setContent("");
    setPhoto("");
    onClose(); // Close the modal after adding news
  };

  return (
    isOpen && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-600 bg-opacity-50">
        <div className="bg-white rounded-lg shadow-lg p-6 w-11/12 md:w-2/3 lg:w-1/3">
          <h2 className="text-xl font-semibold mb-4">Add News</h2>
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
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value)} 
              className="border border-gray-300 rounded-md p-2 mb-4 w-full"
            >
              <option value="Approved">Approved</option>
              <option value="Pending">Pending</option>
            </select>
            <input 
              type="file" 
              value={photo}
              onChange={(e) => setPhoto(e.target.files[0])} 
              className="border border-gray-300 rounded-md mb-4 w-full"
              required
            />
            <div className="flex justify-between">
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Add News</button>
              <button type="button" onClick={onClose} className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-gray-500">Cancel</button>
            </div>
          </form>
        </div>
      </div>
    )
  );
};

export default AddNewsModal;
