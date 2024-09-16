import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';

function ProfileForm() {
  const [profile, setProfile] = useState({
    memberName: '',
    profilePic: '',
    designation: '',
    presentPosting: '',
    postingDistrict: '',
    postingTaluka: '',
    homeDistrict: '',
    homeTaluka: '',
    mobileNumber: '',
    alternateNumber: '',
    emailId: '',
    education: '',
    dateOfBirth: '',
    dateOfJoiningRevenueDept: '',
    dateOfJoiningPresentCadre: '',
    dateOfJoiningPresentPost: '',
    achievements: '',
    pastPosting: '',
    additionalInfo: '',
  });

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/profiles/me'); // Adjust endpoint as needed
      const data = await response.json();
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfile({ ...profile, profilePic: URL.createObjectURL(file) });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile({ ...profile, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch('/api/profiles/update', { // Adjust endpoint as needed
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">My Profile</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4 flex items-center">
          <div className="relative">
            <img
              src={profile.profilePic || 'https://via.placeholder.com/150'}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover mr-4"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="absolute bottom-0 right-0 opacity-0 w-24 h-24 cursor-pointer"
            />
            <FaCamera className="absolute bottom-0 right-0 text-gray-500" size={20} />
          </div>
        </div>
        
        {/* Add additional fields */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Member Name</label>
          <input
            type="text"
            name="memberName"
            value={profile.memberName}
            readOnly
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Designation</label>
          <input
            type="text"
            name="designation"
            value={profile.designation}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Present Posting</label>
          <input
            type="text"
            name="presentPosting"
            value={profile.presentPosting}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Posting District</label>
          <input
            type="text"
            name="postingDistrict"
            value={profile.postingDistrict}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Posting Taluka</label>
          <input
            type="text"
            name="postingTaluka"
            value={profile.postingTaluka}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Home District</label>
          <input
            type="text"
            name="homeDistrict"
            value={profile.homeDistrict}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Home Taluka</label>
          <input
            type="text"
            name="homeTaluka"
            value={profile.homeTaluka}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input
            type="text"
            name="mobileNumber"
            value={profile.mobileNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Alternate Number</label>
          <input
            type="text"
            name="alternateNumber"
            value={profile.alternateNumber}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Email ID</label>
          <input
            type="email"
            name="emailId"
            value={profile.emailId}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Education</label>
          <input
            type="text"
            name="education"
            value={profile.education}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date Of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={profile.dateOfBirth}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date Of Joining Revenue Dept</label>
          <input
            type="date"
            name="dateOfJoiningRevenueDept"
            value={profile.dateOfJoiningRevenueDept}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date Of Joining Present Cadre</label>
          <input
            type="date"
            name="dateOfJoiningPresentCadre"
            value={profile.dateOfJoiningPresentCadre}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Date Of Joining Present Post</label>
          <input
            type="date"
            name="dateOfJoiningPresentPost"
            value={profile.dateOfJoiningPresentPost}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Achievements/Awards/Notable Work Done</label>
          <textarea
            name="achievements"
            value={profile.achievements}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Past Posting</label>
          <textarea
            name="pastPosting"
            value={profile.pastPosting}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            rows="4"
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Additional Information</label>
          <textarea
            name="additionalInfo"
            value={profile.additionalInfo}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
            rows="4"
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600">
          Update Profile
        </button>
      </form>
    </div>
  );
}

export default ProfileForm;
