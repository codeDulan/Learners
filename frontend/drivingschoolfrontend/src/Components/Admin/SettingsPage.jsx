import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Card,
  CardContent,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Switch,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Avatar
} from '@mui/material';
import { tokens } from '../../theme';
import { 
  FiSave, 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiFileText,
  FiAlertTriangle,
  FiTrash2,
  FiUserPlus
} from 'react-icons/fi';

const SettingsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Profile settings
  const [profileSettings, setProfileSettings] = useState({
    companyName: 'Tharuka Driving School',
    address: 'No.253 Kurunegala Rd, Wariyapola',
    email: 'tharukadriving@gmail.com',
    phone: '071-4089577',
    website: 'www.tharukadriving.com',
    logo: null
  });
  
  // System settings
  const [systemSettings, setSystemSettings] = useState({
    darkMode: true,
    emailNotifications: true,
    smsNotifications: true,
    sessionReminders: true,
    paymentReminders: true,
    dataBackup: false,
    language: 'english'
  });
  
  // Staff accounts
  const [staffAccounts, setStaffAccounts] = useState([
    { 
      id: 1, 
      name: 'Admin User', 
      email: 'admin@tharukadriving.com', 
      role: 'Administrator', 
      lastActive: '2025-04-22' 
    },
    { 
      id: 2, 
      name: 'John Smith', 
      email: 'john@tharukadriving.com', 
      role: 'Instructor', 
      lastActive: '2025-04-23' 
    },
    { 
      id: 3, 
      name: 'Jane Doe', 
      email: 'jane@tharukadriving.com', 
      role: 'Office Staff', 
      lastActive: '2025-04-21' 
    }
  ]);
  
  // Password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  // Handle input changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileSettings({
      ...profileSettings,
      [name]: value
    });
  };
  
  const handleSystemToggle = (name) => {
    setSystemSettings({
      ...systemSettings,
      [name]: !systemSettings[name]
    });
  };
  
  const handleSystemChange = (e) => {
    const { name, value } = e.target;
    setSystemSettings({
      ...systemSettings,
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
  const saveProfileSettings = () => {
    // In a real application, this would save to the backend
    alert('Company profile settings saved');
  };
  
  const saveSystemSettings = () => {
    // In a real application, this would save to the backend
    alert('System settings saved');
  };
  
  const changePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('New passwords do not match');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      alert('Password must be at least 8 characters');
      return;
    }
    
    // In a real application, this would send to the backend
    alert('Password changed successfully');
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };
  
  const deleteStaffAccount = (id) => {
    if (window.confirm('Are you sure you want to delete this staff account?')) {
      const updatedStaff = staffAccounts.filter(staff => staff.id !== id);
      setStaffAccounts(updatedStaff);
    }
  };
  
  return (
    <Box>
      <Typography variant="h2" fontWeight="bold" color={colors.grey[100]} mb={4}>
        Settings
      </Typography>
      
      <Grid container spacing={4}>
        {/* Company Profile Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <FiFileText size={24} style={{ color: colors.greenAccent[500], marginRight: '12px' }} />
                <Typography variant="h5" fontWeight="bold">
                  Company Profile
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" display="flex" flexDirection="column" gap={2}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Company Name"
                  name="companyName"
                  value={profileSettings.companyName}
                  onChange={handleProfileChange}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Address"
                  name="address"
                  value={profileSettings.address}
                  onChange={handleProfileChange}
                  multiline
                  rows={2}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Email"
                  name="email"
                  value={profileSettings.email}
                  onChange={handleProfileChange}
                  InputProps={{
                    startAdornment: <FiMail style={{ marginRight: '8px' }} />,
                  }}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Phone"
                  name="phone"
                  value={profileSettings.phone}
                  onChange={handleProfileChange}
                  InputProps={{
                    startAdornment: <FiPhone style={{ marginRight: '8px' }} />,
                  }}
                />
                
                <TextField
                  fullWidth
                  variant="filled"
                  label="Website"
                  name="website"
                  value={profileSettings.website}
                  onChange={handleProfileChange}
                />
                
                <Button
                  variant="contained"
                  startIcon={<FiSave />}
                  onClick={saveProfileSettings}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    mt: 2,
                    '&:hover': {
                      backgroundColor: colors.greenAccent[700]
                    }
                  }}
                >
                  Save Profile Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* System Settings */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400], height: '100%' }}>
            <CardContent>
              <Box display="flex" alignItems="center" mb={3}>
                <FiLock size={24} style={{ color: colors.greenAccent[500], marginRight: '12px' }} />
                <Typography variant="h5" fontWeight="bold">
                  System Settings
                </Typography>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <Box component="form" display="flex" flexDirection="column" gap={2}>
                <FormControlLabel
                  control={
                    <Switch 
                      checked={systemSettings.darkMode}
                      onChange={() => handleSystemToggle('darkMode')}
                      color="primary"
                    />
                  }
                  label="Dark Mode"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={systemSettings.emailNotifications}
                      onChange={() => handleSystemToggle('emailNotifications')}
                      color="primary"
                    />
                  }
                  label="Email Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={systemSettings.smsNotifications}
                      onChange={() => handleSystemToggle('smsNotifications')}
                      color="primary"
                    />
                  }
                  label="SMS Notifications"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={systemSettings.sessionReminders}
                      onChange={() => handleSystemToggle('sessionReminders')}
                      color="primary"
                    />
                  }
                  label="Session Reminders"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={systemSettings.paymentReminders}
                      onChange={() => handleSystemToggle('paymentReminders')}
                      color="primary"
                    />
                  }
                  label="Payment Reminders"
                />
                
                <FormControlLabel
                  control={
                    <Switch 
                      checked={systemSettings.dataBackup}
                      onChange={() => handleSystemToggle('dataBackup')}
                      color="primary"
                    />
                  }
                  label="Automatic Data Backup"
                />
                
                <FormControl fullWidth variant="filled">
                  <InputLabel>Language</InputLabel>
                  <Select
                    name="language"
                    value={systemSettings.language}
                    onChange={handleSystemChange}
                  >
                    <MenuItem value="english">English</MenuItem>
                    <MenuItem value="sinhala">Sinhala</MenuItem>
                    <MenuItem value="tamil">Tamil</MenuItem>
                  </Select>
                </FormControl>
                
                <Button
                  variant="contained"
                  startIcon={<FiSave />}
                  onClick={saveSystemSettings}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    mt: 2,
                    '&:hover': {
                      backgroundColor: colors.greenAccent[700]
                    }
                  }}
                >
                  Save System Settings
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Password Change */}
        <Grid item xs={12} md={6}>
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
        
        {/* Staff Accounts */}
        <Grid item xs={12} md={6}>
          <Card sx={{ backgroundColor: colors.primary[400] }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box display="flex" alignItems="center">
                  <FiUser size={24} style={{ color: colors.blueAccent[500], marginRight: '12px' }} />
                  <Typography variant="h5" fontWeight="bold">
                    Staff Accounts
                  </Typography>
                </Box>
                
                <Button
                  variant="contained"
                  startIcon={<FiUserPlus />}
                  sx={{
                    backgroundColor: colors.blueAccent[600],
                    '&:hover': {
                      backgroundColor: colors.blueAccent[700]
                    }
                  }}
                >
                  Add Staff
                </Button>
              </Box>
              
              <Divider sx={{ mb: 3 }} />
              
              <List>
                {staffAccounts.map((staff) => (
                  <ListItem key={staff.id} sx={{ 
                    p: 2, 
                    mb: 1, 
                    backgroundColor: colors.primary[500],
                    borderRadius: '4px'
                  }}>
                    <Avatar 
                      sx={{ 
                        bgcolor: 
                          staff.role === 'Administrator' ? colors.redAccent[500] :
                          staff.role === 'Instructor' ? colors.greenAccent[500] :
                          colors.blueAccent[500],
                        mr: 2
                      }}
                    >
                      {staff.name.charAt(0)}
                    </Avatar>
                    <ListItemText
                      primary={staff.name}
                      secondary={
                        <Box component="span" sx={{ color: colors.grey[300] }}>
                          {staff.email} • {staff.role} • Last active: {staff.lastActive}
                        </Box>
                      }
                    />
                    <ListItemSecondaryAction>
                      <IconButton 
                        edge="end" 
                        onClick={() => deleteStaffAccount(staff.id)}
                        sx={{ color: colors.redAccent[400] }}
                      >
                        <FiTrash2 />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SettingsPage;