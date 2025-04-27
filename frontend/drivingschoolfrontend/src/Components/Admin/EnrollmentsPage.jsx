import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Chip,
  ListSubheader,
  InputAdornment,
  Autocomplete
} from '@mui/material';
import { FiPlus, FiEdit, FiTrash2, FiSearch } from 'react-icons/fi';
import { toast } from 'react-toastify';
import enrollmentService from '../../services/enrollmentService';
import trainingService from '../../services/trainingService';
import customerService from '../../services/customerService';

const EnrollmentsPage = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    customerId: '',
    programId: '',
    status: 'PENDING',
    startDate: '',
    notes: '',
    isPaid: false
  });
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  // Fetch data on component mount
  useEffect(() => {
    fetchEnrollments();
    fetchCustomers();
    fetchPrograms();
  }, []);

  // Fetch all enrollments
  const fetchEnrollments = async () => {
    setLoading(true);
    try {
      const data = await enrollmentService.getAllEnrollments();
      setEnrollments(data);
    } catch (error) {
      toast.error('Failed to load enrollments');
    } finally {
      setLoading(false);
    }
  };

  // Fetch customers for dropdown
  const fetchCustomers = async () => {
    try {
      const data = await customerService.getAllCustomers();
      setCustomers(data);
    } catch (error) {
      toast.error('Failed to load customers');
    }
  };

  // Fetch training programs for dropdown
  const fetchPrograms = async () => {
    try {
      const data = await trainingService.getAllProgramsAdmin();
      setPrograms(data);
    } catch (error) {
      toast.error('Failed to load training programs');
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  // Handle customer change in Autocomplete
  const handleCustomerChange = (event, newValue) => {
    setSelectedCustomer(newValue);
    if (newValue) {
      setFormData({
        ...formData,
        customerId: newValue.id
      });
    } else {
      setFormData({
        ...formData,
        customerId: ''
      });
    }
  };

  // Open dialog for creating new enrollment
  const handleOpenCreateDialog = () => {
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      customerId: '',
      programId: '',
      status: 'PENDING',
      startDate: '',
      notes: '',
      isPaid: false
    });
    setSelectedCustomer(null);
    setOpenDialog(true);
  };

  // Open dialog for editing enrollment
  const handleOpenEditDialog = (enrollment) => {
    setIsEditing(true);
    setCurrentId(enrollment.id);
    
    // Find the customer object for the selected enrollment
    const customer = customers.find(c => c.id === enrollment.customerId);
    setSelectedCustomer(customer || null);
    
    setFormData({
      customerId: enrollment.customerId,
      programId: enrollment.programId,
      status: enrollment.status,
      startDate: enrollment.startDate ? enrollment.startDate.substring(0, 16) : '',
      notes: enrollment.notes || '',
      isPaid: enrollment.isPaid
    });
    setOpenDialog(true);
  };

  // Close dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Submit form for create/update
  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (isEditing) {
        // Update existing enrollment
        await enrollmentService.updateEnrollment(currentId, formData);
        toast.success('Enrollment updated successfully');
      } else {
        // Create new enrollment
        await enrollmentService.createEnrollment(formData);
        toast.success('Enrollment created successfully');
      }
      handleCloseDialog();
      fetchEnrollments();
    } catch (error) {
      toast.error(isEditing ? 'Failed to update enrollment' : 'Failed to create enrollment');
    } finally {
      setLoading(false);
    }
  };

  // Delete enrollment
  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this enrollment?')) {
      setLoading(true);
      try {
        await enrollmentService.deleteEnrollment(id);
        toast.success('Enrollment deleted successfully');
        fetchEnrollments();
      } catch (error) {
        toast.error('Failed to delete enrollment');
      } finally {
        setLoading(false);
      }
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  // Format customer display
  const getCustomerLabel = (customer) => {
    if (!customer) return '';
    return `${customer.firstName} ${customer.lastName} (${customer.email})`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" fontWeight="bold">
          Enrollments
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<FiPlus />}
          onClick={handleOpenCreateDialog}
        >
          New Enrollment
        </Button>
      </Box>

      {loading && enrollments.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Program</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Start Date</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {enrollments.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    No enrollments found
                  </TableCell>
                </TableRow>
              ) : (
                enrollments.map((enrollment) => (
                  <TableRow key={enrollment.id}>
                    <TableCell>{enrollment.id}</TableCell>
                    <TableCell>
                      <Typography>{enrollment.customerName}</Typography>
                      <Typography variant="body2" color="textSecondary">
                        {enrollment.customerEmail}
                      </Typography>
                    </TableCell>
                    <TableCell>{enrollment.programName}</TableCell>
                    <TableCell>
                      <Chip
                        label={enrollmentService.getStatusDisplay(enrollment.status)}
                        color={
                          enrollment.status === 'COMPLETED'
                            ? 'success'
                            : enrollment.status === 'ACTIVE'
                            ? 'primary'
                            : enrollment.status === 'PENDING'
                            ? 'warning'
                            : 'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{formatDate(enrollment.startDate)}</TableCell>
                    <TableCell>
                      <Chip
                        label={enrollment.isPaid ? 'Paid' : 'Unpaid'}
                        color={enrollment.isPaid ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          size="small"
                          startIcon={<FiEdit />}
                          onClick={() => handleOpenEditDialog(enrollment)}
                        >
                          Edit
                        </Button>
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          startIcon={<FiTrash2 />}
                          onClick={() => handleDelete(enrollment.id)}
                        >
                          Delete
                        </Button>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Create/Edit Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>{isEditing ? 'Edit Enrollment' : 'Create New Enrollment'}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            {/* Customer Selection with Autocomplete (disabled for editing) */}
            <Autocomplete
              disabled={isEditing}
              options={customers}
              value={selectedCustomer}
              onChange={handleCustomerChange}
              getOptionLabel={getCustomerLabel}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Search Student"
                  required
                  InputProps={{
                    ...params.InputProps,
                    startAdornment: (
                      <>
                        <InputAdornment position="start">
                          <FiSearch />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    ),
                  }}
                />
              )}
              fullWidth
            />

            {/* Program Selection (disabled for editing) */}
            <FormControl fullWidth disabled={isEditing}>
              <InputLabel>Training Program</InputLabel>
              <Select
                name="programId"
                value={formData.programId}
                onChange={handleInputChange}
                label="Training Program"
                required
              >
                {programs.map((program) => (
                  <MenuItem key={program.id} value={program.id}>
                    {program.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Status */}
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={formData.status}
                onChange={handleInputChange}
                label="Status"
              >
                <MenuItem value="PENDING">Pending</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="COMPLETED">Completed</MenuItem>
                <MenuItem value="CANCELLED">Cancelled</MenuItem>
              </Select>
            </FormControl>

            {/* Start Date */}
            <TextField
              label="Start Date"
              type="datetime-local"
              name="startDate"
              value={formData.startDate}
              onChange={handleInputChange}
              InputLabelProps={{ shrink: true }}
              fullWidth
            />

            {/* Payment Status */}
            <FormControl fullWidth>
              <InputLabel>Payment Status</InputLabel>
              <Select
                name="isPaid"
                value={formData.isPaid}
                onChange={handleInputChange}
                label="Payment Status"
              >
                <MenuItem value={true}>Paid</MenuItem>
                <MenuItem value={false}>Unpaid</MenuItem>
              </Select>
            </FormControl>

            {/* Notes */}
            <TextField
              label="Notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              multiline
              rows={3}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={loading || (!isEditing && (!formData.customerId || !formData.programId))}
          >
            {loading ? <CircularProgress size={24} /> : isEditing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EnrollmentsPage;