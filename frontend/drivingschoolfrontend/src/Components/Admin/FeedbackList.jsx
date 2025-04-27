import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating,
  IconButton,
  Chip
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import { tokens } from '../../theme';
import { 
  FiMessageSquare, 
  FiEdit2, 
  FiTrash2, 
  FiStar, 
  FiUser, 
  FiCalendar
} from 'react-icons/fi';
import feedbackService from '../../services/feedbackService';
import { toast } from 'react-toastify';

const FeedbackList = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Dialog control
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  // Edit form
  const [editForm, setEditForm] = useState({
    comment: '',
    rating: null
  });
  
  // Delete confirmation dialog
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const data = await feedbackService.getAllFeedbacks();
      
      // Ensure we have valid data
      if (Array.isArray(data)) {
        console.log("Fetched feedback data:", data);
        setFeedbacks(data);
      } else {
        console.error("Invalid feedback data format:", data);
        setFeedbacks([]);
        setError('Received invalid feedback data format from server');
        toast.error('Error loading feedback data');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      setError('Failed to load feedbacks. Please try again.');
      toast.error('Failed to load feedbacks');
      setFeedbacks([]);
      setLoading(false);
    }
  };

  const handleOpenEditDialog = (feedbackId) => {
    const feedback = feedbacks.find(f => f.id === feedbackId);
    if (feedback) {
      setSelectedFeedback(feedback);
      setEditForm({
        comment: feedback.comment,
        rating: feedback.rating
      });
      setOpenDialog(true);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedFeedback(null);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleRatingChange = (event, newValue) => {
    setEditForm(prev => ({
      ...prev,
      rating: feedbackService.getRatingFromValue(newValue)
    }));
  };

  const handleSaveEdit = async () => {
    if (!editForm.comment || !editForm.rating) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);
      await feedbackService.updateFeedback(selectedFeedback.id, editForm);
      toast.success('Feedback updated successfully');
      fetchFeedbacks();
      handleCloseDialog();
      setLoading(false);
    } catch (err) {
      console.error('Error updating feedback:', err);
      toast.error(err.response?.data?.message || 'Failed to update feedback');
      setLoading(false);
    }
  };

  const handleOpenDeleteDialog = (feedbackId) => {
    setFeedbackToDelete(feedbackId);
    setOpenDeleteDialog(true);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setFeedbackToDelete(null);
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      await feedbackService.deleteFeedback(feedbackToDelete);
      toast.success('Feedback deleted successfully');
      fetchFeedbacks();
      handleCloseDeleteDialog();
      setLoading(false);
    } catch (err) {
      console.error('Error deleting feedback:', err);
      toast.error(err.response?.data?.message || 'Failed to delete feedback');
      setLoading(false);
    }
  };

  // DataGrid columns
  const columns = [
    { 
      field: 'customerName', 
      headerName: 'Student', 
      flex: 1.5,
      valueGetter: (params) => {
        return params.row?.customerName || 'Unknown';
      },
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiUser style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          <Box>
            <Typography variant="body1">{row?.customerName || 'Unknown'}</Typography>
            <Typography variant="body2" color={colors.grey[400]}>
              {row?.customerEmail || ''}
            </Typography>
          </Box>
        </Box>
      )
    },
    { 
      field: 'sessionTitle', 
      headerName: 'Session', 
      flex: 1,
      valueGetter: (params) => {
        return params.row?.sessionTitle || 'Unknown Session';
      },
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiCalendar style={{ marginRight: '8px', color: colors.greenAccent[400] }} />
          {row?.sessionTitle || 'Unknown Session'}
        </Box>
      )
    },
    { 
      field: 'rating', 
      headerName: 'Rating', 
      flex: 1,
      valueGetter: (params) => {
        return params.row?.rating ? feedbackService.getRatingDisplay(params.row.rating) : 'N/A';
      },
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <Rating 
            value={row?.rating ? feedbackService.getRatingValue(row.rating) : 0} 
            readOnly 
            size="small"
            sx={{
              '& .MuiRating-iconFilled': {
                color: colors.greenAccent[400],
              },
            }}
          />
          <Typography variant="body2" ml={1} color={colors.grey[100]}>
            ({row?.rating ? feedbackService.getRatingDisplay(row.rating) : 'N/A'})
          </Typography>
        </Box>
      )
    },
    { 
      field: 'comment', 
      headerName: 'Feedback', 
      flex: 2,
      valueGetter: (params) => {
        return params.row?.comment || '';
      },
      renderCell: ({ row }) => (
        <Typography
          sx={{
            whiteSpace: 'nowrap',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            maxWidth: '100%'
          }}
        >
          {row?.comment || ''}
        </Typography>
      )
    },
    { 
      field: 'createdAt', 
      headerName: 'Date', 
      flex: 1,
      valueGetter: (params) => {
        // More thorough check for createdAt
        try {
          return params.row && params.row.createdAt ? new Date(params.row.createdAt).toLocaleDateString() : 'N/A';
        } catch (err) {
          console.log("Error formatting date:", err);
          return 'N/A';
        }
      },
      renderCell: ({ row }) => {
        // Safe rendering that won't crash if data is missing
        try {
          return row && row.createdAt ? new Date(row.createdAt).toLocaleDateString() : 'N/A';
        } catch (err) {
          return 'N/A';
        }
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <IconButton
            onClick={() => handleOpenEditDialog(row.id)}
            sx={{ color: colors.blueAccent[400] }}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            onClick={() => handleOpenDeleteDialog(row.id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <FiTrash2 />
          </IconButton>
        </Box>
      )
    }
  ];

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
          Student Feedback Management
        </Typography>
      </Box>

      {error && (
        <Box bgcolor={colors.redAccent[500]} p={2} borderRadius={1} mb={2}>
          <Typography color={colors.grey[100]}>{error}</Typography>
        </Box>
      )}

      <Box
        height="75vh"
        sx={{
          '& .MuiDataGrid-root': {
            border: 'none',
          },
          '& .MuiDataGrid-cell': {
            borderBottom: `1px solid ${colors.grey[800]} !important`,
          },
          '& .MuiDataGrid-columnHeaders': {
            backgroundColor: colors.blueAccent[700],
            borderBottom: 'none',
          },
          '& .MuiDataGrid-virtualScroller': {
            backgroundColor: colors.primary[400],
          },
          '& .MuiDataGrid-footerContainer': {
            borderTop: 'none',
            backgroundColor: colors.blueAccent[700],
          },
          '& .MuiDataGrid-toolbarContainer .MuiButton-text': {
            color: `${colors.grey[100]} !important`,
          },
        }}
      >
        <DataGrid 
          rows={feedbacks || []} 
          columns={columns} 
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          loading={loading}
          getRowId={(row) => row.id || Math.random().toString(36).substr(2, 9)}
        />
      </Box>

      {/* Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          Edit Feedback
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          {selectedFeedback && (
            <Box display="flex" flexDirection="column" gap={3}>
              <Box>
                <Typography variant="subtitle1" gutterBottom color={colors.grey[100]}>
                  Student: {selectedFeedback.customerName}
                </Typography>
                <Typography variant="subtitle1" gutterBottom color={colors.grey[100]}>
                  Session: {selectedFeedback.sessionTitle}
                </Typography>
              </Box>

              <Box>
                <Typography variant="subtitle1" gutterBottom color={colors.grey[100]}>
                  Rating
                </Typography>
                <Rating
                  name="rating"
                  value={feedbackService.getRatingValue(editForm.rating)}
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
                value={editForm.comment}
                onChange={handleInputChange}
                multiline
                rows={5}
                variant="filled"
                fullWidth
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], padding: '20px' }}>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveEdit} 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            Update Feedback
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          Confirm Delete
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          <Typography color={colors.grey[100]}>
            Are you sure you want to delete this feedback? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], padding: '20px' }}>
          <Button onClick={handleCloseDeleteDialog} variant="outlined">
            Cancel
          </Button>
          <Button 
            onClick={handleDelete} 
            color="error" 
            variant="contained"
            disabled={loading}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackList;