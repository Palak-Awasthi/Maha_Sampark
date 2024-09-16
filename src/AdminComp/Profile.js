import React, { useState } from 'react';

function Profile() {
  const [selectedCategory, setSelectedCategory] = useState('');

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      
      <label htmlFor="officerCategory" className="block text-gray-700 text-sm font-medium mb-2">
        Select Category
      </label>
      <select
        id="officerCategory"
        value={selectedCategory}
        onChange={handleCategoryChange}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">-- Select Category --</option>
        <option value="mcs">MCS Officers</option>
        <option value="ais">AIS Officers</option>
        <option value="govt">Maharashtra Govt Officers</option>
        <option value="nonOfficials">Non Officials</option>
        <option value="politicians">Politicians</option>
      </select>
    </div>
  );
}

export default Profile;
