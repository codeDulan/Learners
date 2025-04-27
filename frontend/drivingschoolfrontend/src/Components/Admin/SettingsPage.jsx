import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Card,
  CardContent,
  TextField,
  Button,
  Divider,
  Grid,
  Alert,
  Snackbar
} from '@mui/material';
import { tokens } from '../../theme';
import { 
  FiSave, 
  FiUser, 
  FiLock, 
  FiAlertTriangle
} from 'react-icons/fi';

const AdminSettingsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Admin Info
  const [adminInfo, setAdminInfo] = useState({
    name: '',
    email: '',
    role: ''
  });
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Alert states
  const [alertState, setAlertState] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // Fetch admin info on component mount
  useEffect(() => {
    fetchAdminInfo();
  }, []);
  
  const fetchAdminInfo = async () => {
    try {
      // Get token from localStorage - FIXED: changed from 'token' to 'authToken'
      const token = localStorage.getItem('authToken');
      
      // Check if token exists
      if (!token) {
        showAlert('No authentication token found. Please log in again.', 'error');
        console.error('No token found in localStorage');
        return;
      }
      
      console.log('Using token:', token); // Debug: log the token
      
      const response = await fetch('http://localhost:8080/api/staff/admin/info', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Response status:', response.status); // Debug: log response status
      
      if (response.ok) {
        const data = await response.json();
        console.log('Received staff data:', data); // Debug: log the data
        setAdminInfo(data);
      } else {
        // Try to get error details if possible
        try {
          const errorData = await response.json();
          showAlert(errorData.message || 'Failed to load staff information', 'error');
          console.error('Error response:', errorData);
        } catch (e) {
          showAlert(`Failed to load staff information (Status: ${response.status})`, 'error');
        }
      }
    } catch (error) {
      showAlert('Error fetching staff information', 'error');
      console.error('Fetch error:', error);
    }
  };
  
  // Handle input changes
  const handleAdminInfoChange = (e) => {
    const { name, value } = e.target;
    setAdminInfo({
      ...adminInfo,
      [name]: value
    });
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
  };
  
  // Handle save functions
  const saveAdminInfo = async () => {
    try {
      // FIXED: changed from 'token' to 'authToken'
      const token = localStorage.getItem('authToken');
      if (!token) {
        showAlert('No authentication token found. Please log in again.', 'error');
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/staff/admin/update-info', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          name: adminInfo.name
        })
      });
      
      console.log('Update response status:', response.status);
      
      if (response.ok) {
        showAlert('Staff information updated successfully', 'success');
      } else {
        try {
          const errorData = await response.json();
          showAlert(errorData.message || 'Failed to update staff information', 'error');
          console.error('Error updating:', errorData);
        } catch (e) {
          showAlert(`Failed to update staff information (Status: ${response.status})`, 'error');
        }
      }
    } catch (error) {
      showAlert('Error updating staff information', 'error');
      console.error('Error:', error);
    }
  };
  
  const changePassword = async () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showAlert('New passwords do not match', 'error');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      showAlert('Password must be at least 8 characters', 'error');
      return;
    }
    
    try {
      // FIXED: changed from 'token' to 'authToken'
      const token = localStorage.getItem('authToken');
      if (!token) {
        showAlert('No authentication token found. Please log in again.', 'error');
        return;
      }
      
      const response = await fetch('http://localhost:8080/api/staff/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });
      
      console.log('Password change response status:', response.status);
      
      if (response.ok) {
        showAlert('Password changed successfully', 'success');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        try {
          const errorData = await response.json();
          showAlert(errorData.message || 'Failed to change password', 'error');
          console.error('Error changing password:', errorData);
        } catch (e) {
          showAlert(`Failed to change password (Status: ${response.status})`, 'error');
        }
      }
    } catch (error) {
      showAlert('Error changing password', 'error');
      console.error('Error:', error);
    }
  };
  
  // Alert helper
  const showAlert = (message, severity) => {
    setAlertState({
      open: true,
      message,
      severity
    });
  };
  
  const handleCloseAlert = () => {
    setAlertState({
      ...alertState,
      open: false
    });
  };
  
  return (
    <Box>
      <Typography variant="h2" fontWeight="bold" color={colors.grey[100]} mb={4}>
        Staff Settings
      </Typography>
      
      <Snackbar 
        open={alertState.open} 
        autoHideDuration={6000} 
        onClose={handleCloseAlert}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseAlert} severity={alertState.severity}>
          {alertState.message}
        </Alert>
      </Snackbar>
      
      <Grid container spacing={4} direction="column">
        {/* Admin Information */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <FiUser size={24} style={{ color: colors.greenAccent[500], marginRight: '12px' }} />
                <Typography variant="h5" fontWeight="bold">
                  Staff Information
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Name"
                  name="name"
                  value={adminInfo.name}
                  onChange={handleAdminInfoChange}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Email"
                  name="email"
                  value={adminInfo.email}
                  disabled
                  helperText="Email cannot be changed"
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Role"
                  name="role"
                  value={adminInfo.role}
                  disabled
                  helperText="Role cannot be changed"
                />
                
                <Button
                  variant="contained"
                  startIcon={<FiSave />}
                  onClick={saveAdminInfo}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    mt: 2,
                    '&:hover': {
                      backgroundColor: colors.greenAccent[700]
                    }
                  }}
                >
                  Save Information
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Password Change */}
        <Grid item xs={12}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <FiLock size={24} style={{ color: colors.blueAccent[500], marginRight: '12px' }} />
                <Typography variant="h5" fontWeight="bold">
                  Change Password
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Current Password"
                  name="currentPassword"
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="New Password"
                  name="newPassword"
                  type="password"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Confirm New Password"
                  name="confirmPassword"
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
                
                <Box display="flex" alignItems="center" mt={1} mb={2}>
                  <FiAlertTriangle size={16} style={{ color: colors.redAccent[400], marginRight: '8px' }} />
                  <Typography variant="body2" color={colors.grey[300]}>
                    Password must be at least 8 characters long
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  onClick={changePassword}
                  sx={{
                    backgroundColor: colors.blueAccent[600],
                    '&:hover': {
                      backgroundColor: colors.blueAccent[700]
                    }
                  }}
                >
                  Change Password
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AdminSettingsPage;