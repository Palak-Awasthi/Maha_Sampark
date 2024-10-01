import React, { useState, useEffect } from 'react';
import { FaShare, FaEnvelope, FaPhone, FaCommentDots, FaWhatsapp } from 'react-icons/fa';

function MCAOfficersProfile() {
  const [searchTerm, setSearchTerm] = useState('');
  const [officers, setOfficers] = useState([]);

  // Fetch officer data from backend API
  useEffect(() => {
    fetchOfficersData();
  }, []);

  const fetchOfficersData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/mcs'); // Adjust the endpoint to match your API
      const data = await response.json();
      setOfficers(data);
    } catch (error) {
      console.error('Error fetching officers data:', error);
    }
  };

  const filteredOfficers = officers.filter(officer =>
    officer.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleShare = (officer) => {
    const shareText = `Check out this officer: ${officer.name}, ${officer.designation}. Contact: ${officer.contact}`;
    if (navigator.share) {
      navigator.share({
        title: 'Officer Profile',
        text: shareText,
        url: window.location.href
      })
      .then(() => console.log('Profile shared successfully'))
      .catch(console.error);
    } else {
      alert("Sharing is not supported on your browser");
    }
  };

  const handleEmail = (officer) => {
    window.location.href = `mailto:${officer.emailID}`;
  };

  const handlePhoneCall = (officer) => {
    window.location.href = `tel:${officer.mobileNumber1}`;
  };

  // Function to open WhatsApp with a message
  const handleWhatsAppClick = (contactName) => {
    const message = `Hello ${contactName}, I would like to get in touch with you.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="p-6 bg-gradient-to-br from-blue-100 to-blue-400 min-h-screen">
    <h2 className="text-3xl font-bold mb-6 text-blue-600">MCS Officers Profiles</h2>
      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search Officers"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 p-3 rounded-lg w-full shadow-md focus:ring-2 focus:ring-blue-500 transition duration-300"
        />
      </div>

      {/* Officers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOfficers.map((officer, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 hover:scale-105"
          >
            {/* Officer Image */}
            <img
              src={officer.profilePic} // Image URL from the backend
              alt={officer.name}
              className="w-24 h-24 rounded-full object-cover mb-4 mx-auto animate-fadeIn"
            />
            {/* Officer Info */}
            <h3 className="text-xl font-semibold mb-2 text-center">
              {officer.name}
            </h3>
            <p className="mb-2 text-center">{officer.designation}</p>
            <p className="mb-4 text-center">{officer.mobileNumber1}</p>
            
            {/* Action Buttons */}
            <div className="flex justify-around">
              <button
                onClick={() => handleShare(officer)}
                className="hover:text-gray-200 hover:scale-110 transform transition duration-200"
              >
                <FaShare size={20} />
              </button>
              <button
                onClick={() => handleEmail(officer)}
                className="hover:text-gray-200 hover:scale-110 transform transition duration-200"
              >
                <FaEnvelope size={20} />
              </button>
              <button
                onClick={() => handlePhoneCall(officer)}
                className="hover:text-gray-200 hover:scale-110 transform transition duration-200"
              >
                <FaPhone size={20} />
              </button>
              <button
                onClick={() => handleWhatsAppClick(officer.name)} // Call the function with the officer's name
                className="hover:text-gray-200 hover:scale-110 transform transition duration-200"
              >
                <FaWhatsapp size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MCAOfficersProfile;
