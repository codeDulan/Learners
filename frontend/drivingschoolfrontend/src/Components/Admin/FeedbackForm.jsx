import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  useTheme,
  Rating,
  Alert,
} from '@mui/material';
import { tokens } from '../../theme';
import { FiSend, FiUsers, FiMessageSquare } from 'react-icons/fi';
import feedbackService from '../../services/feedbackService';
import axios from 'axios';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api';

const FeedbackForm = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

  const [sessions, setSessions] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const [feedback, setFeedback] = useState({
    sessionId: '',
    customerId: '',
    comment: '',
    rating: null
  });

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Headers for API requests
  const getHeaders = () => {
    const token = getAuthToken();
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        setLoading(true);
        // Fetch sessions directly from API
        const response = await axios.get(`${API_BASE_URL}/staff/sessions`, getHeaders());
        setSessions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching sessions:', err);
        setError('Failed to load sessions. Please try again.');
        setLoading(false);
        toast.error('Failed to load sessions');
      }
    };

    fetchSessions();
  }, []);

  useEffect(() => {
    // When a session is selected, get the enrolled customers for that session
    const fetchStudentsForSession = async (sessionId) => {
      try {
        // First try to get students from the session object
        const selectedSession = sessions.find(s => s.id === parseInt(sessionId));
        console.log("Selected session:", selectedSession);
        
        if (selectedSession && selectedSession.enrolledCustomers && selectedSession.enrolledCustomers.length > 0) {
          console.log("Enrolled customers from session:", selectedSession.enrolledCustomers);
          setCustomers(selectedSession.enrolledCustomers);
        } else {
          // If no enrolled customers in the session object, fetch them directly
          console.log("Fetching enrolled customers for session:", sessionId);
          setLoading(true);
          // Make a direct API call to get the session with detailed enrollments
          const response = await axios.get(`${API_BASE_URL}/staff/sessions/${sessionId}`, getHeaders());
          console.log("Session details response:", response.data);
          
          if (response.data && response.data.enrolledCustomers) {
            setCustomers(response.data.enrolledCustomers);
          } else {
            setCustomers([]);
          }
          setLoading(false);
        }
      } catch (err) {
        console.error("Error fetching students for session:", err);
        setError("Failed to load students for this session.");
        setCustomers([]);
        setLoading(false);
      }
    };
    
    if (feedback.sessionId) {
      fetchStudentsForSession(feedback.sessionId);
    } else {
      setCustomers([]);
    }
  }, [feedback.sessionId, sessions]);

  const handleFeedbackChange = (event) => {
    const { name, value } = event.target;
    setFeedback(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setFeedback(prev => ({
      ...prev,
      rating: feedbackService.getRatingFromValue(newValue)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!feedback.sessionId || !feedback.customerId || !feedback.rating || !feedback.comment.trim()) {
      setError('Please fill out all fields.');
      toast.error('Please fill out all fields.');
      return;
    }

    try {
      setLoading(true);
      await feedbackService.createFeedback(feedback);
      setSuccess('Feedback submitted successfully!');
      toast.success('Feedback submitted successfully!');
      setError(null);
      
      // Reset form
      setFeedback({
        sessionId: '',
        customerId: '',
        comment: '',
        rating: null
      });
      
      setLoading(false);
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to submit feedback. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
      setSuccess(null);
      setLoading(false);
    }
  };

  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
          Student Feedback
        </Typography>
      </Box>

      <Box 
        backgroundColor={colors.primary[400]} 
        p={3} 
        borderRadius="8px"
        width="100%"
      >
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            {success}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit} 
          display="grid" 
          gap="20px"
        >
          <FormControl fullWidth variant="filled">
            <InputLabel>Select Session</InputLabel>
            <Select
              name="sessionId"
              value={feedback.sessionId}
              onChange={handleFeedbackChange}
            >
              <MenuItem value="">
                <em>Select a session</em>
              </MenuItem>
              {sessions.map((session) => (
                <MenuItem key={session.id} value={session.id}>
                  {session.title} - {new Date(session.startTime).toLocaleDateString()}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth variant="filled" disabled={!feedback.sessionId}>
            <InputLabel>Select Student</InputLabel>
            <Select
              name="customerId"
              value={feedback.customerId}
              onChange={handleFeedbackChange}
            >
              <MenuItem value="">
                <em>Select a student</em>
              </MenuItem>
              {customers.map((customer) => (
                <MenuItem key={customer.id} value={customer.id}>
                  {customer.firstName} {customer.lastName} ({customer.email})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Box>
            <Typography variant="subtitle1" gutterBottom color={colors.grey[100]}>
              Performance Rating
            </Typography>
            <Rating
              name="rating"
              value={feedback.rating ? feedbackService.getRatingValue(feedback.rating) : 0}
              onChange={handleRatingChange}
              size="large"
              sx={{
                '& .MuiRating-iconFilled': {
                  color: colors.greenAccent[400],
                },
                '& .MuiRating-iconHover': {
                  color: colors.greenAccent[300],
                },
              }}
            />
          </Box>

          <TextField
            label="Feedback Comments"
            name="comment"
            value={feedback.comment}
            onChange={handleFeedbackChange}
            multiline
            rows={5}
            variant="filled"
            fullWidth
            placeholder="Provide detailed feedback about the student's performance, strengths and areas for improvement..."
          />

          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={<FiSend />}
            sx={{
              backgroundColor: colors.blueAccent[600],
              '&:hover': {
                backgroundColor: colors.blueAccent[700],
              },
              padding: '10px 20px',
              alignSelf: 'flex-start'
            }}
          >
            Submit Feedback
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default FeedbackForm;