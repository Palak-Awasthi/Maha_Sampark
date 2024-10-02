import React, { useState, useEffect } from 'react';
import { Toaster, toast } from 'react-hot-toast';

function Feedback() {
  const [feedback, setFeedback] = useState({
    title: '',
    message: '',
  });

  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
  });

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/registrations/all'); // Adjust API if needed
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();

      if (data.length > 0) {
        const userData = data[0]; // Assuming the first entry is the logged-in user
        setUserInfo({
          name: userData.name || '',
          email: userData.email || '',
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to fetch user data.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFeedback({ ...feedback, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const feedbackData = {
      title: feedback.title,
      message: feedback.message,
      name: userInfo.name,
      email: userInfo.email,
    };

    try {
      const response = await fetch('http://localhost:8080/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(feedbackData),
      });
      if (!response.ok) throw new Error('Network response was not ok');
      toast.success('Feedback submitted successfully!');
      setFeedback({ title: '', message: '' }); // Reset the form
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast.error('Failed to submit feedback.');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-400">
      <Toaster />
      <div className="w-full max-w-lg p-8 bg-white rounded-lg shadow-lg" style={{ marginTop: '50px', marginBottom: '50px' }}>
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">Feedback Form</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-lg font-medium text-gray-700">Title</label>
            <input
              type="text"
              name="title"
              value={feedback.title}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50 py-2 px-4"
              placeholder="Enter feedback title"
              required
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-700">Message</label>
            <textarea
              name="message"
              value={feedback.message}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-900 focus:border-green-600 focus:ring focus:ring-green-600 focus:ring-opacity-50 py-2 px-4"
              placeholder="Enter your feedback message"
              required
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-full max-w-xs bg-green-600 text-white py-2 px-6 rounded-lg shadow-md transition-colors duration-200 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300"
            >
              Submit Feedback
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Feedback;
