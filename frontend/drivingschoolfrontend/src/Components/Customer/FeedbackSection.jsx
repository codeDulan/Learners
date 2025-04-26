import React, { useState } from "react";

const FeedbackSection = () => {
  const [feedback, setFeedback] = useState({
    type: "Instructor",
    rating: 0,
    comments: "",
  });

  const handleFeedbackChange = (event) => {
    const { name, value } = event.target;
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      [name]: value,
    }));
  };

  const handleRatingClick = (ratingValue) => {
    setFeedback((prevFeedback) => ({
      ...prevFeedback,
      rating: ratingValue,
    }));
  };

  const handleSubmitFeedback = () => {
    // In a real application, you would send this to your backend
    alert(`Feedback Submitted!\nType: ${feedback.type}\nRating: ${feedback.rating}\nComments: ${feedback.comments}`);
    
    // Reset form after submission
    setFeedback({
      type: "Instructor",
      rating: 0,
      comments: "",
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold mb-4">Submit Your Feedback</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm text-gray-400 mb-2">Feedback Type</label>
          <select
            name="type"
            value={feedback.type}
            onChange={handleFeedbackChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
          >
            <option value="Instructor">Instructor</option>
            <option value="Sessions">Sessions</option>
            <option value="Material">Training Material</option>
            <option value="Other">Other</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Rating</label>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`text-xl ${
                  feedback.rating >= star ? "text-yellow-400" : "text-gray-500"
                }`}
                onClick={() => handleRatingClick(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="block text-sm text-gray-400 mb-2">Comments</label>
          <textarea
            name="comments"
            value={feedback.comments}
            onChange={handleFeedbackChange}
            className="w-full p-2 rounded bg-gray-700 border border-gray-600"
            rows="4"
            placeholder="Share your experience..."
          ></textarea>
        </div>
        <button
          onClick={handleSubmitFeedback}
          className="mt-2 bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 transition-colors"
        >
          Submit Feedback
        </button>
      </div>
    </div>
  );
};

export default FeedbackSection;