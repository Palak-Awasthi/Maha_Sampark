import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';

function ProfileForm() {
  const [profile, setProfile] = useState({
    memberName: '',
    profilePic: '',
    mobileNumber: '',
    emailId: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/registrations/all'); // Fetching from the specified endpoint
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();

      // Assuming the API returns an array and we're interested in the first item for profile data
      if (data.length > 0) {
        const profileData = data[0]; // Adjust according to the structure of your API response
        setProfile({
          memberName: profileData.name || '', // Adjust the field name based on your API response
          mobileNumber: profileData.phoneNumber || '', // Map to phoneNumber
          emailId: profileData.email || '', // Map to email
          profilePic: profileData.profilePic || '', // If this exists in your response
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: file });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    
    for (const key in profile) {
      formData.append(key, profile[key]);
    }

    try {
      await fetch('/api/profiles/update', { // Adjust endpoint as needed
        method: 'POST',
        body: formData,
      });
      alert('Profile updated successfully!');
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-4xl mx-auto p-10 bg-blue-100 rounded-xl shadow-lg transition-all duration-200 ease-in-out hover:shadow-xl">
        <h2 className="text-3xl font-semibold text-blue-600 dark:text-gray-200 text-center mb-8">My Profile</h2>
        <form onSubmit={handleSubmit} className="space-y-10">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={profile.profilePic ? URL.createObjectURL(profile.profilePic) : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-28 h-28 rounded-full object-cover border-4 border-gray-300 dark:border-gray-600 transition-transform duration-300 hover:scale-105"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute bottom-0 right-0 opacity-0 w-28 h-28 cursor-pointer"
              />
              <FaCamera className="absolute bottom-0 right-0 text-gray-500 bg-white dark:bg-gray-600 rounded-full p-1 transition-all duration-200 hover:bg-blue-100 dark:hover:bg-blue-700" size={24} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Name</label>
              <input
                type="text"
                name="memberName"
                value={profile.memberName}
                readOnly
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 text-lg py-3 px-3" // Added padding
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={profile.mobileNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 hover:border-blue-500 transition duration-200 text-lg py-3 px-3" // Added padding
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700 dark:text-gray-300">Email ID</label>
              <input
                type="email"
                name="emailId"
                value={profile.emailId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50 hover:border-blue-500 transition duration-200 text-lg py-3 px-3" // Added padding
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs bg-blue-500 text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-200 hover:bg-blue-600 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-800"
            >
              Update Profile
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProfileForm;
