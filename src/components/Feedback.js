import React, { useState } from 'react';

function Feedback() {
  const [feedback, setFeedback] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    // Later, handle feedback submission
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Feedback</h2>
      {!submitted ? (
        <form onSubmit={handleSubmit}>
          <textarea
            placeholder="Your feedback"
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full p-2 mb-4 border rounded"
            rows={4}
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600"
          >
            Submit Feedback
          </button>
        </form>
      ) : (
        <p className="text-green-600">Thank you for your feedback!</p>
      )}
    </div>
  );
}

export default Feedback;
