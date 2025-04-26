import React, { useState } from 'react';
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
  InputLabel,
  Select,
  MenuItem,
  IconButton
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
  FiXCircle,
  FiFileText,
  FiCreditCard,
  FiSearch
} from 'react-icons/fi';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

// Sample data - replace with actual data from your backend
const initialPayments = [
  {
    id: 1,
    customerName: 'John Doe',
    customerId: 1,
    amount: 5000,
    paymentDate: new Date(2025, 3, 15),
    paymentMethod: 'Cash',
    description: 'Motorcycle training package - full payment',
    licenseType: 'Motorcycle',
    status: 'Completed',
    receiptNumber: 'REC-001',
  },
  {
    id: 2,
    customerName: 'Jane Smith',
    customerId: 2,
    amount: 3000,
    paymentDate: new Date(2025, 3, 16),
    paymentMethod: 'Bank Transfer',
    description: 'Light Vehicle training package - deposit',
    licenseType: 'Light Vehicle',
    status: 'Completed',
    receiptNumber: 'REC-002',
  },
  {
    id: 3,
    customerName: 'Mike Johnson',
    customerId: 3,
    amount: 2500,
    paymentDate: new Date(2025, 3, 20),
    paymentMethod: 'Card',
    description: 'Heavy Vehicle training - installment payment',
    licenseType: 'Heavy Vehicle',
    status: 'Pending',
    receiptNumber: 'REC-003',
  },
];

// Sample customers for dropdown
const customerOptions = [
  { id: 1, name: 'John Doe', licenseType: 'Motorcycle' },
  { id: 2, name: 'Jane Smith', licenseType: 'Light Vehicle' },
  { id: 3, name: 'Mike Johnson', licenseType: 'Heavy Vehicle' },
  { id: 4, name: 'Sarah Williams', licenseType: 'Light Vehicle' },
];

const PaymentsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [payments, setPayments] = useState(initialPayments);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedPaymentId, setSelectedPaymentId] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [newPayment, setNewPayment] = useState({
    customerId: '',
    amount: '',
    paymentDate: new Date(),
    paymentMethod: '',
    description: '',
    status: 'Completed',
  });

  // Handle dialog open/close
  const handleOpenDialog = (edit = false, paymentId = null) => {
    if (edit && paymentId) {
      const paymentToEdit = payments.find(payment => payment.id === paymentId);
      if (paymentToEdit) {
        setNewPayment({
          customerId: paymentToEdit.customerId,
          amount: paymentToEdit.amount,
          paymentDate: paymentToEdit.paymentDate,
          paymentMethod: paymentToEdit.paymentMethod,
          description: paymentToEdit.description,
          status: paymentToEdit.status,
        });
        setEditMode(true);
        setSelectedPaymentId(paymentId);
      }
    } else {
      setNewPayment({
        customerId: '',
        amount: '',
        paymentDate: new Date(),
        paymentMethod: '',
        description: '',
        status: 'Completed',
      });
      setEditMode(false);
      setSelectedPaymentId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPayment({
      ...newPayment,
      [name]: value
    });
  };

  const handleDateChange = (date) => {
    setNewPayment({
      ...newPayment,
      paymentDate: date
    });
  };

  // Handle payment actions
  const handleSavePayment = () => {
    const customer = customerOptions.find(c => c.id.toString() === newPayment.customerId.toString());
    
    if (editMode) {
      // Update existing payment
      setPayments(payments.map(payment => 
        payment.id === selectedPaymentId
          ? {
              ...payment,
              ...newPayment,
              customerName: customer.name,
              licenseType: customer.licenseType
            }
          : payment
      ));
    } else {
      // Add new payment
      const newId = Math.max(...payments.map(p => p.id)) + 1;
      const receiptNumber = `REC-${newId.toString().padStart(3, '0')}`;
      
      setPayments([
        ...payments,
        {
          id: newId,
          ...newPayment,
          customerName: customer.name,
          licenseType: customer.licenseType,
          receiptNumber
        }
      ]);
    }
    
    handleCloseDialog();
  };

  const handleDeletePayment = (id) => {
    if (window.confirm('Are you sure you want to delete this payment record?')) {
      setPayments(payments.filter(payment => payment.id !== id));
    }
  };

  // Filter payments based on search
  const filteredPayments = payments.filter(payment => 
    payment.customerName.toLowerCase().includes(searchText.toLowerCase()) ||
    payment.description.toLowerCase().includes(searchText.toLowerCase()) ||
    payment.receiptNumber.toLowerCase().includes(searchText.toLowerCase())
  );

  // Calculate total payments
  const totalPayments = filteredPayments.reduce((sum, payment) => {
    return payment.status === 'Completed' ? sum + payment.amount : sum;
  }, 0);

  // DataGrid columns
  const columns = [
    { 
      field: 'receiptNumber', 
      headerName: 'Receipt #', 
      flex: 0.8,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiFileText style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          {row.receiptNumber}
        </Box>
      )
    },
    { 
      field: 'customerName', 
      headerName: 'Customer', 
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiUser style={{ marginRight: '8px', color: colors.greenAccent[500] }} />
          {row.customerName}
        </Box>
      )
    },
    { field: 'licenseType', headerName: 'License Type', flex: 1 },
    { 
      field: 'amount', 
      headerName: 'Amount', 
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center" color={colors.greenAccent[400]}>
          <FiDollarSign style={{ marginRight: '4px' }} />
          <Typography fontWeight="bold">
            {row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </Typography>
        </Box>
      )
    },
    { 
      field: 'paymentDate', 
      headerName: 'Date', 
      flex: 1,
      valueGetter: (params) => new Date(params.row.paymentDate),
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiCalendar style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          {row.paymentDate.toLocaleDateString()}
        </Box>
      )
    },
    { 
      field: 'paymentMethod', 
      headerName: 'Method', 
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiCreditCard style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          {row.paymentMethod}
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 0.8,
      renderCell: ({ row }) => {
        const bgcolor = row.status === 'Completed' 
          ? colors.greenAccent[600] 
          : row.status === 'Pending' 
            ? colors.blueAccent[600]
            : colors.redAccent[600];
        
        const icon = row.status === 'Completed' 
          ? <FiCheckCircle style={{ marginRight: '8px' }} />
          : row.status === 'Pending'
            ? <FiCreditCard style={{ marginRight: '8px' }} />
            : <FiXCircle style={{ marginRight: '8px' }} />;
        
        return (
          <Box
            display="flex"
            alignItems="center"
            backgroundColor={bgcolor}
            p="5px 10px"
            borderRadius="4px"
          >
            {icon}
            <Typography color={colors.grey[100]}>
              {row.status}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 0.8,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
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
              ${totalPayments.toLocaleString('en-US', { minimumFractionDigits: 2 })}
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
              {payments.filter(p => p.status === 'Pending').length}
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
        />
      </Box>

      {/* Add/Edit Payment Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          {editMode ? 'Edit Payment Record' : 'Record New Payment'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(2, 1fr)">
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                <InputLabel>Customer</InputLabel>
                <Select
                  name="customerId"
                  value={newPayment.customerId}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Customer</MenuItem>
                  {customerOptions.map(customer => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} ({customer.licenseType})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                variant="filled"
                label="Amount"
                name="amount"
                type="number"
                value={newPayment.amount}
                onChange={handleInputChange}
                sx={{ gridColumn: "span 1" }}
                InputProps={{
                  startAdornment: <Box mr={1}><FiDollarSign /></Box>
                }}
              />
              
              <Box sx={{ gridColumn: "span 1" }}>
                <DatePicker
                  label="Payment Date"
                  value={newPayment.paymentDate}
                  onChange={handleDateChange}
                  renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                />
              </Box>
              
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={newPayment.paymentMethod}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Method</MenuItem>
                  <MenuItem value="Cash">Cash</MenuItem>
                  <MenuItem value="Card">Card</MenuItem>
                  <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
                  <MenuItem value="Mobile Payment">Mobile Payment</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                variant="filled"
                label="Description"
                name="description"
                value={newPayment.description}
                onChange={handleInputChange}
                multiline
                rows={2}
                sx={{ gridColumn: "span 2" }}
              />
              
              {editMode && (
                <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                  <InputLabel>Status</InputLabel>
                  <Select
                    name="status"
                    value={newPayment.status}
                    onChange={handleInputChange}
                  >
                    <MenuItem value="Completed">Completed</MenuItem>
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
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
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            {editMode ? 'Update Payment' : 'Save Payment'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PaymentsPage;