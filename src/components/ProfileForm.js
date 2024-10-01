import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import toast, { Toaster } from 'react-hot-toast';

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
      const response = await fetch('http://localhost:8080/api/registrations/all');
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.length > 0) {
        const profileData = data[0];
        setProfile({
          memberName: profileData.name || '',
          mobileNumber: profileData.phoneNumber || '',
          emailId: profileData.email || '',
          profilePic: profileData.profilePic || '',
        });
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      toast.error('Failed to fetch profile data.');
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
      await fetch('/api/profiles/update', {
        method: 'POST',
        body: formData,
      });
      toast.success('Profile updated successfully!');
      fetchProfileData();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-400">
      <Toaster />
      <div className="w-full max-w-lg mx-auto p-8 bg-white rounded-lg shadow-lg transform transition-all duration-300 hover:shadow-xl">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Profile Update</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-center">
            <div className="relative">
              <img
                src={profile.profilePic ? URL.createObjectURL(profile.profilePic) : 'https://via.placeholder.com/150'}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-blue-600 shadow-lg transition-transform duration-300 hover:scale-105"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute bottom-0 right-0 opacity-0 w-32 h-32 cursor-pointer"
              />
              <FaCamera className="absolute bottom-0 right-0 text-white bg-blue-600 rounded-full p-2 transition-all duration-200 hover:bg-blue-700" size={28} />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-lg font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="memberName"
                value={profile.memberName}
                readOnly
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-100 text-gray-900 focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 py-3 px-4"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Mobile Number</label>
              <input
                type="text"
                name="mobileNumber"
                value={profile.mobileNumber}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 py-3 px-4"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-700">Email ID</label>
              <input
                type="email"
                name="emailId"
                value={profile.emailId}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 focus:border-blue-600 focus:ring focus:ring-blue-600 focus:ring-opacity-50 py-3 px-4"
                placeholder="Enter your email address"
              />
            </div>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs bg-blue-600 text-white py-3 px-6 rounded-lg shadow-md transition-colors duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
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
