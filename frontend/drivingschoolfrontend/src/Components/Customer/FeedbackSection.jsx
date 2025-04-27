import React, { useState, useEffect } from "react";
import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api';

const CustomerFeedbackSection = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Convert rating enum to number of stars
  const getRatingStars = (rating) => {
    switch(rating) {
      case 'POOR': return 1;
      case 'FAIR': return 2;
      case 'GOOD': return 3;
      case 'VERY_GOOD': return 4;
      case 'EXCELLENT': return 5;
      default: return 0;
    }
  };
  
  // Format rating for display
  const getRatingDisplay = (rating) => {
    switch(rating) {
      case 'POOR': return 'Poor';
      case 'FAIR': return 'Fair';
      case 'GOOD': return 'Good';
      case 'VERY_GOOD': return 'Very Good';
      case 'EXCELLENT': return 'Excellent';
      default: return rating;
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = getAuthToken();
        const response = await axios.get(`${API_BASE_URL}/customers/feedbacks/my-feedbacks`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        setFeedbacks(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching feedback:", err);
        setError("Failed to load your feedback. Please try again later.");
        setLoading(false);
      }
    };
    
    fetchFeedbacks();
  }, []);

  // Render star rating
  const StarRating = ({ rating }) => {
    const stars = getRatingStars(rating);
    
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-xl ${
              stars >= star ? "text-yellow-400" : "text-gray-500"
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-gray-300">({getRatingDisplay(rating)})</span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold mb-4">Your Feedback from Instructors</h2>
      
      {loading && (
        <div className="text-center py-4">
          <div className="inline-block border-t-4 border-b-4 border-blue-500 rounded-full w-8 h-8 animate-spin"></div>
          <p className="mt-2 text-gray-400">Loading feedback...</p>
        </div>
      )}
      
      {error && (
        <div className="bg-red-900/30 border border-red-800 text-red-200 px-4 py-3 rounded">
          <p>{error}</p>
        </div>
      )}
      
      {!loading && !error && feedbacks.length === 0 && (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 text-center text-gray-400">
          <p>You haven't received any feedback yet.</p>
        </div>
      )}
      
      {feedbacks.map((feedback) => (
        <div key={feedback.id} className="bg-gray-800 border border-gray-700 rounded-lg p-4 shadow-sm">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-medium text-gray-200">{feedback.sessionTitle}</h3>
              <p className="text-gray-400 text-sm">{formatDate(feedback.createdAt)}</p>
            </div>
            <div className="bg-blue-900/30 border border-blue-800 text-blue-200 text-xs px-2 py-1 rounded">
              From: {feedback.instructorName}
            </div>
          </div>
          
          <div className="my-3">
            <StarRating rating={feedback.rating} />
          </div>
          
          <div className="mt-2 p-3 bg-gray-900 rounded border border-gray-700">
            <p className="text-gray-300">{feedback.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CustomerFeedbackSection;