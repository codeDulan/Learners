import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputAdornment,
  Autocomplete,
  IconButton,
  CircularProgress,
  MenuItem,
  Select,
  InputLabel,
  Modal,
  Paper
} from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiUser, 
  FiDollarSign,
  FiCalendar,
  FiCheckCircle,
  FiCreditCard,
  FiXCircle,
  FiFileText,
  FiSearch,
  FiPrinter,
  FiDownload
} from 'react-icons/fi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';

// Import the services
import paymentService, { PaymentMethod, PaymentStatus } from '../../services/paymentService';
import enrollmentService from '../../services/enrollmentService';

const PaymentsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const billRef = useRef(null);
  
  // State
  const [payments, setPayments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [loading, setLoading] = useState(false);
  const [selectedEnrollment, setSelectedEnrollment] = useState(null);
  const [showBillModal, setShowBillModal] = useState(false);
  const [currentBill, setCurrentBill] = useState(null);
  const [newPayment, setNewPayment] = useState({
    enrollmentId: '',
    amount: '',
    paymentMethod: '',
    description: ''
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchPayments();
    fetchEnrollments();
  }, []);

  // Fetch all payments
  const fetchPayments = async () => {
    setLoading(true);
    try {
      const data = await paymentService.getAllPayments();
      setPayments(data || []);
    } catch (error) {
      toast.error('Failed to load payments');
      console.error('Error fetching payments:', error);
      setPayments([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch enrollments for dropdown
  const fetchEnrollments = async () => {
    try {
      const data = await enrollmentService.getAllEnrollments();
      setEnrollments(data || []);
    } catch (error) {
      toast.error('Failed to load enrollments');
      console.error('Error fetching enrollments:', error);
      setEnrollments([]);
    }
  };

  // Handle dialog open/close
  const handleOpenDialog = (edit = false, paymentId = null) => {
    if (edit && paymentId) {
      const paymentToEdit = payments.find(payment => payment.id === paymentId);
      if (paymentToEdit) {
        // Find the enrollment for this payment
        const enrollment = enrollments.find(e => e.id === paymentToEdit.enrollmentId);
        setSelectedEnrollment(enrollment || null);
        
        setNewPayment({
          enrollmentId: paymentToEdit.enrollmentId,
          paymentMethod: paymentToEdit.paymentMethod,
          description: paymentToEdit.description || '',
          status: paymentToEdit.status
        });
        setEditMode(true);
        setSelectedPaymentId(paymentId);
      }
    } else {
      setNewPayment({
        enrollmentId: '',
        amount: '',
        paymentMethod: '',
        description: ''
      });
      setSelectedEnrollment(null);
      setEditMode(false);
      setSelectedPaymentId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle enrollment selection
  const handleEnrollmentChange = (event, value) => {
    setSelectedEnrollment(value);
    setNewPayment({
      ...newPayment,
      enrollmentId: value ? value.id : ''
    });
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value
    });
  };

  // Handle payment actions
  const handleSavePayment = async () => {
    try {
      setLoading(true);
      let paymentData;
      
      if (editMode) {
        // Update existing payment
        const updateData = {
          paymentMethod: newPayment.paymentMethod,
          description: newPayment.description,
          status: newPayment.status
        };
        
        paymentData = await paymentService.updatePayment(selectedPaymentId, updateData);
        toast.success('Payment updated successfully');
      } else {
        // Create new payment
        paymentData = await paymentService.createPayment({
          enrollmentId: newPayment.enrollmentId,
          amount: parseFloat(newPayment.amount),
          paymentMethod: newPayment.paymentMethod,
          description: newPayment.description
        });
        toast.success('Payment recorded successfully');
        
        // Generate bill for the new payment
        if (paymentData && paymentData.id) {
          const billData = await prepareBillData(paymentData);
          setCurrentBill(billData);
          setShowBillModal(true);
        }
      }
      
      // Refresh payment data
      fetchPayments();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving payment:', error);
      toast.error(error.response?.data?.message || 'Failed to save payment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePayment = async (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      try {
        setLoading(true);
        await paymentService.deletePayment(id);
        toast.success('Payment deleted successfully');
        fetchPayments();
      } catch (error) {
        console.error('Error deleting payment:', error);
        toast.error('Failed to delete payment');
      } finally {
        setLoading(false);
      }
    }
  };

  // Filter payments based on search
  const filteredPayments = payments.filter(payment => 
    payment?.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
    payment?.programName?.toLowerCase().includes(searchText.toLowerCase()) ||
    payment?.receiptNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
    payment?.description?.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate total payments
  const totalPayments = filteredPayments.reduce((sum, payment) => {
    return payment.status === 'COMPLETED' ? sum + (payment.amount || 0) : sum;
  }, 0);

  // Get remaining amount for the selected enrollment
  const getRemainingAmount = (enrollmentId) => {
    const enrollment = enrollments.find(e => e.id === parseInt(enrollmentId));
    if (!enrollment) return null;
    
    const totalPaid = payments
      .filter(p => p.enrollmentId === parseInt(enrollmentId) && p.status === 'COMPLETED')
      .reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return Math.max(0, enrollment.programPrice - totalPaid);
  };

  // Format currency with Rs. instead of $
  const formatCurrency = (amount) => {
    return `Rs. ${Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  // Get enrollment option label for Autocomplete
  const getEnrollmentLabel = (option) => {
    if (!option) return '';
    return `${option.customerName} - ${option.programName} (${formatCurrency(option.programPrice)})`;
  };

  // DataGrid columns with fixed alignments
  const columns = [
    { 
      field: 'receiptNumber', 
      headerName: 'Receipt #', 
      flex: 0.8,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
          <FiFileText style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          {row?.receiptNumber || 'N/A'}
        </Box>
      )
    },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiUser style={{ marginRight: '8px', color: colors.greenAccent[500] }} />
          {row?.customerName || 'N/A'}
        </Box>
      )
    },
    { 
      field: 'programName', 
      headerName: 'Program', 
      flex: 1,
      headerAlign: 'left',
      align: 'left',
      renderCell: ({ row }) => (
        <Typography>{row?.programName || 'N/A'}</Typography>
      )
    },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      flex: 1,
      headerAlign: 'right',
      align: 'right',
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" justifyContent="flex-end" width="100%" color={colors.greenAccent[400]}>
          <Typography fontWeight="bold">
            {formatCurrency(row?.amount || 0)}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'paymentDate', 
      headerName: 'Date', 
      flex: 1,
      headerAlign: 'center',
      align: 'center',
      valueGetter: (params) => {
        return params.row && params.row.paymentDate ? new Date(params.row.paymentDate) : null;
      },
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" justifyContent="center" width="100%">
          <FiCalendar style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          {row && row.paymentDate ? new Date(row.paymentDate).toLocaleDateString() : 'N/A'}
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => {
        if (!row || !row.status) {
          return <Typography>N/A</Typography>;
        }
        
        const statusColor = paymentService.getStatusColor(row.status);
        
        const icon = row.status === PaymentStatus.COMPLETED 
          ? <FiCheckCircle style={{ marginRight: '8px' }} />
          : row.status === PaymentStatus.PENDING
            ? <FiCreditCard style={{ marginRight: '8px' }} />
            : <FiXCircle style={{ marginRight: '8px' }} />;
        
        return (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            backgroundColor={statusColor}
            p="5px 10px"
            borderRadius="4px"
            width="80%"
            mx="auto"
          >
            {icon}
            <Typography color={colors.grey[100]}>
              {paymentService.getStatusDisplay(row.status)}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      headerAlign: 'center',
      align: 'center',
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px" justifyContent="center" width="100%">
          <IconButton
            onClick={() => handleOpenDialog(true, row.id)}
            sx={{ color: colors.blueAccent[400] }}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            onClick={() => handleDeletePayment(row.id)}
            sx={{ color: colors.redAccent[400] }}
          >
            <FiTrash2 />
          </IconButton>
        </Box>
      )
    }
  ];

  // Prepare data for bill generation
  const prepareBillData = async (payment) => {
    try {
      // Find the enrollment details
      const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
      if (!enrollment) {
        console.error("Enrollment not found for payment");
        return null;
      }

      // Get current date formatted
      const today = new Date();
      const formattedDate = today.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      // Create bill data object
      return {
        receiptNumber: payment.receiptNumber || `RCPT-${payment.id}`,
        date: formattedDate,
        paymentDate: payment.paymentDate ? new Date(payment.paymentDate).toLocaleDateString() : today.toLocaleDateString(),
        customerName: enrollment.customerName,
        programName: enrollment.programName,
        amount: payment.amount,
        paymentMethod: payment.paymentMethod,
        description: payment.description,
        schoolName: "Tharuka Learners"
      };
    } catch (error) {
      console.error("Error preparing bill data:", error);
      return null;
    }
  };

  // Handle bill printing
  const handlePrintBill = () => {
    const printContent = billRef.current;
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;
    
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;
    
    // Re-render the component after printing
    window.location.reload();
  };

  // Handle bill modal close
  const handleCloseBillModal = () => {
    setShowBillModal(false);
    fetchPayments(); // Refresh data
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
          Payment Management
        </Typography>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          onClick={() => handleOpenDialog()}
          sx={{
            backgroundColor: colors.blueAccent[600],
            '&:hover': {
              backgroundColor: colors.blueAccent[700]
            }
          }}
        >
          Record Payment
        </Button>
      </Box>

      {/* Summary Cards */}
      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={4} mb={4}>
        <Box 
          gridColumn="span 4" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
        >
          <Box
            bgcolor={colors.greenAccent[600]}
            color={colors.grey[100]}
            p={2}
            borderRadius="50%"
            mr={2}
          >
            <FiDollarSign size={24} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Total Payments
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
              {formatCurrency(totalPayments)}
            </Typography>
          </Box>
        </Box>

        <Box 
          gridColumn="span 4" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
        >
          <Box
            bgcolor={colors.blueAccent[600]}
            color={colors.grey[100]}
            p={2}
            borderRadius="50%"
            mr={2}
          >
            <FiFileText size={24} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Total Transactions
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
              {payments.length}
            </Typography>
          </Box>
        </Box>

        <Box 
          gridColumn="span 4" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
        >
          <Box
            bgcolor={colors.redAccent[600]}
            color={colors.grey[100]}
            p={2}
            borderRadius="50%"
            mr={2}
          >
            <FiCreditCard size={24} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Pending Payments
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={colors.grey[100]}>
              {payments.filter(p => p.status === PaymentStatus.PENDING).length}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Search */}
      <Box display="flex" justifyContent="space-between" mb={4}>
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" width="400px">
          <FiSearch style={{ margin: '10px', color: colors.grey[400] }} />
          <TextField
            variant="standard"
            placeholder="Search payments..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ 
              ml: 1, 
              flex: 1,
              '& .MuiInput-root': {
                color: colors.grey[100],
                '&:before, &:after': {
                  borderBottom: 'none !important'
                }
              }
            }}
          />
        </Box>
      </Box>

      {/* Payments DataGrid */}
      {loading && payments.length === 0 ? (
        <Box display="flex" justifyContent="center" p={5}>
          <CircularProgress />
        </Box>
      ) : (
        <Box
          height="60vh"
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
            rows={filteredPayments} 
            columns={columns} 
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            loading={loading}
          />
        </Box>
      )}

      {/* Add/Edit Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          {editMode ? 'Edit Payment Record' : 'Record New Payment'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(2, 1fr)">
              {/* Enrollment Selection with Autocomplete - disabled in edit mode */}
              {!editMode ? (
                <Box sx={{ gridColumn: "span 2" }}>
                  <Autocomplete
                    disabled={editMode}
                    options={enrollments}
                    value={selectedEnrollment}
                    onChange={handleEnrollmentChange}
                    getOptionLabel={getEnrollmentLabel}
                    isOptionEqualToValue={(option, value) => option.id === value?.id}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Search Enrollment"
                        variant="filled"
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
                  />
                </Box>
              ) : (
                // Display only enrollment info in edit mode
                <Box sx={{ gridColumn: "span 2", mb: 1 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Enrollment:
                  </Typography>
                  <Typography>
                    {selectedEnrollment ? getEnrollmentLabel(selectedEnrollment) : 'N/A'}
                  </Typography>
                </Box>
              )}
              
              {/* Display program details if enrollment is selected */}
              {selectedEnrollment && !editMode && (
                <Box sx={{ gridColumn: "span 2", bgcolor: colors.primary[500], p: 2, borderRadius: '4px', mb: 2 }}>
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">Program Price:</Typography>
                    <Typography variant="subtitle1">{formatCurrency(selectedEnrollment.programPrice || 0)}</Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between" mb={1}>
                    <Typography variant="subtitle1" fontWeight="bold">Total Paid:</Typography>
                    <Typography variant="subtitle1">{formatCurrency(selectedEnrollment.programPrice - getRemainingAmount(selectedEnrollment.id) || 0)}</Typography>
                  </Box>
                  
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="subtitle1" fontWeight="bold" color={colors.greenAccent[400]}>Remaining Balance:</Typography>
                    <Typography variant="subtitle1" fontWeight="bold" color={colors.greenAccent[400]}>
                      {formatCurrency(getRemainingAmount(selectedEnrollment.id) || 0)}
                    </Typography>
                  </Box>
                </Box>
              )}
              
              {/* Amount - only in create mode */}
              {!editMode && (
                <TextField
                  fullWidth
                  variant="filled"
                  label="Amount"
                  name="amount"
                  type="number"
                  value={newPayment.amount}
                  onChange={handleInputChange}
                  sx={{ gridColumn: "span 2" }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs.</InputAdornment>
                  }}
                />
              )}
              
              {/* Payment Method - Improved Dropdown */}
              <FormControl variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel id="payment-method-label">Payment Method</InputLabel>
                <Select
                  labelId="payment-method-label"
                  name="paymentMethod"
                  value={newPayment.paymentMethod}
                  onChange={handleInputChange}
                  required
                >
                  <MenuItem value="">Select Method</MenuItem>
                  <MenuItem value="CASH">Cash</MenuItem>
                  <MenuItem value="CARD">Card</MenuItem>
                  <MenuItem value="BANK_TRANSFER">Bank Transfer</MenuItem>
                  <MenuItem value="MOBILE_PAYMENT">Mobile Payment</MenuItem>
                </Select>
              </FormControl>
              
              {/* Description */}
              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                value={newPayment.description || ''}
                onChange={handleInputChange}
                multiline
                rows={2}
                sx={{ gridColumn: "span 2" }}
              />
              
              {/* Status - only in edit mode */}
              {editMode && (
                <FormControl variant="filled" sx={{ gridColumn: "span 2" }}>
                  <InputLabel id="status-label">Status</InputLabel>
                  <Select
                    labelId="status-label"
                    name="status"
                    value={newPayment.status || PaymentStatus.COMPLETED}
                    onChange={handleInputChange}
                  >
                    <MenuItem value={PaymentStatus.COMPLETED}>Completed</MenuItem>
                    <MenuItem value={PaymentStatus.PENDING}>Pending</MenuItem>
                    <MenuItem value={PaymentStatus.CANCELLED}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
              )}
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], padding: '20px' }}>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancel
          </Button>
          <Button 
            onClick={handleSavePayment} 
            color="primary" 
            variant="contained"
            disabled={loading || 
              (!editMode && (!newPayment.enrollmentId || !newPayment.amount || !newPayment.paymentMethod)) ||
              (editMode && !newPayment.paymentMethod)
            }
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              editMode ? 'Update Payment' : 'Save Payment'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Bill Generation Modal */}
      <Modal
        open={showBillModal}
        onClose={handleCloseBillModal}
        aria-labelledby="bill-modal-title"
        aria-describedby="bill-modal-description"
      >
        <Box 
          sx={{ 
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: { xs: '90%', sm: '80%', md: '60%' },
            maxHeight: '90vh',
            overflow: 'auto',
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          {/* Bill Receipt Content */}
          <Paper 
            elevation={0} 
            ref={billRef}
            sx={{ 
              p: 3, 
              mb: 3, 
              bgcolor: '#fff',
              color: '#000'
            }}
          >
            {currentBill && (
              <Box sx={{ fontFamily: 'Arial, sans-serif' }}>
                {/* School Header */}
                <Box textAlign="center" mb={3}>
                  <Typography variant="h4" fontWeight="bold" sx={{ color: '#00008B' }}>
                    THARUKA LEARNERS
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    Excellence in Education
                  </Typography>
                  <Typography variant="body2">
                    123 Education Road, Knowledge City • Phone: (123) 456-7890
                  </Typography>
                  <Typography variant="body2" gutterBottom>
                    Email: info@tharukalearners.edu • www.tharukalearners.edu
                  </Typography>
                </Box>

                {/* Receipt Title */}
                <Box textAlign="center" mb={2}>
                  <Typography 
                    variant="h5" 
                    component="div" 
                    fontWeight="bold" 
                    sx={{ 
                      borderBottom: '2px solid #000', 
                      borderTop: '2px solid #000',
                      py: 1
                    }}
                  >
                    PAYMENT RECEIPT
                  </Typography>
                </Box>

                {/* Receipt Details */}
                <Box 
                  display="flex" 
                  justifyContent="space-between" 
                  mb={3}
                >
                  <Box>
                    <Typography variant="body1" fontWeight="bold">Receipt No: {currentBill.receiptNumber}</Typography>
                    <Typography variant="body1">Date: {currentBill.date}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body1">Payment Method: {currentBill.paymentMethod.replace('_', ' ')}</Typography>
                  </Box>
                </Box>

                {/* Customer Info */}
                <Box mb={3}>
                  <Typography variant="body1"><strong>Student/Customer:</strong> {currentBill.customerName}</Typography>
                  <Typography variant="body1"><strong>Program:</strong> {currentBill.programName}</Typography>
                </Box>

                {/* Payment Table */}
                <Box mb={3} sx={{ border: '1px solid #ddd' }}>
                  <Box 
                    display="flex" 
                    sx={{ 
                      borderBottom: '1px solid #ddd',
                      bgcolor: '#f0f0f0',
                      fontWeight: 'bold'
                    }}
                  >
                    <Box sx={{ width: '70%', p: 1, borderRight: '1px solid #ddd' }}>Description</Box>
                    <Box sx={{ width: '30%', p: 1, textAlign: 'right' }}>Amount</Box>
                  </Box>
                  <Box display="flex">
                    <Box sx={{ width: '70%', p: 1, borderRight: '1px solid #ddd' }}>
                      {currentBill.description || `Payment for ${currentBill.programName}`}
                    </Box>
                    <Box sx={{ width: '30%', p: 1, textAlign: 'right' }}>
                      {formatCurrency(currentBill.amount)}
                    </Box>
                  </Box>
                  <Box 
                    display="flex" 
                    sx={{ 
                      borderTop: '1px solid #ddd',
                      bgcolor: '#f9f9f9',
                      fontWeight: 'bold' 
                    }}
                  >
                    <Box sx={{ width: '70%', p: 1, borderRight: '1px solid #ddd' }}>Total</Box>
                    <Box sx={{ width: '30%', p: 1, textAlign: 'right' }}>{formatCurrency(currentBill.amount)}</Box>
                  </Box>
                </Box>

                {/* Footer Notes */}
                <Box textAlign="center" mt={4} sx={{ borderTop: '1px dotted #999', pt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    Thank you for your payment!
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                    This is an electronically generated receipt and does not require a signature.
                  </Typography>
                </Box>
              </Box>
            )}
          </Paper>

          {/* Action Buttons */}
          <Box display="flex" justifyContent="flex-end" gap={2}>
            <Button 
              variant="outlined" 
              onClick={handleCloseBillModal}
              startIcon={<FiXCircle />}
            >
              Close
            </Button>
            <Button 
              variant="contained" 
              onClick={handlePrintBill}
              startIcon={<FiPrinter />}
              sx={{
                backgroundColor: colors.greenAccent[600],
                '&:hover': {
                  backgroundColor: colors.greenAccent[700]
                }
              }}
            >
              Print Receipt
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default PaymentsPage;