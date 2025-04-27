import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material';
import { Box, Typography } from '@mui/material';
import { tokens } from '../../theme';
import { 
  FiHome, 
  FiUsers, 
  FiCalendar, 
  FiBookOpen, 
  FiDollarSign,
  FiFileText,
  FiUpload,
  FiSettings,
  FiUserPlus  // Added for enrollments
} from 'react-icons/fi';

const AdminSidebar = () => {
  const location = useLocation();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const navItems = [
    { icon: <FiHome />, label: 'Dashboard', path: '/staff/dashboard' },
    { icon: <FiUsers />, label: 'Customers', path: '/staff/customers' },
    { icon: <FiUserPlus />, label: 'Enrollments', path: '/staff/enrollments' }, // Added this line
    { icon: <FiCalendar />, label: 'Sessions', path: '/staff/sessions' },
    { icon: <FiBookOpen />, label: 'Programs', path: '/staff/training' },
    { icon: <FiDollarSign />, label: 'Payments', path: '/staff/payments' },
    { icon: <FiFileText />, label: 'Reports', path: '/staff/reports' },
    { icon: <FiUpload />, label: 'Documents', path: '/staff/documents' },
    { icon: <FiSettings />, label: 'Settings', path: '/staff/settings' },
  ];
  
  return (
    <Box 
      sx={{ 
        width: '250px',
        minHeight: '100vh',
        backgroundColor: colors.primary[400],
        padding: '16px',
        paddingTop: '24px',
        paddingBottom: '24px',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center',
          marginBottom: '32px'
        }}
      >
        <Box 
          sx={{ 
            width: '40px', 
            height: '40px', 
            borderRadius: '50%', 
            backgroundColor: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              color: colors.primary[500], 
              fontWeight: 'bold' 
            }}
          >
            T
          </Typography>
        </Box>
        <Typography 
          variant="h5" 
          sx={{ 
            marginLeft: '12px', 
            fontWeight: 'bold',
            color: colors.grey[100]
          }}
        >
          Tharuka Admin
        </Typography>
      </Box>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{ textDecoration: 'none' }}
          >
            <Box 
              sx={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 16px',
                borderRadius: '8px',
                transition: 'background-color 0.2s',
                backgroundColor: location.pathname === item.path 
                  ? colors.blueAccent[700] 
                  : 'transparent',
                '&:hover': {
                  backgroundColor: location.pathname === item.path 
                    ? colors.blueAccent[700] 
                    : colors.blueAccent[800]
                }
              }}
            >
              <Box 
                sx={{ 
                  marginRight: '12px', 
                  fontSize: '18px',
                  color: colors.grey[100]
                }}
              >
                {item.icon}
              </Box>
              <Typography 
                sx={{ 
                  color: colors.grey[100]
                }}
              >
                {item.label}
              </Typography>
            </Box>
          </Link>
        ))}
      </Box>
      
      <Box 
        sx={{ 
          marginTop: 'auto', 
          paddingTop: '32px', 
          borderTop: `1px solid ${colors.primary[500]}`,
          marginTop: '32px'
        }}
      >
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            padding: '16px'
          }}
        >
          <Box 
            sx={{ 
              width: '40px', 
              height: '40px', 
              borderRadius: '50%', 
              backgroundColor: colors.blueAccent[700],
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Typography sx={{ color: colors.grey[100] }}>A</Typography>
          </Box>
          <Box sx={{ marginLeft: '12px' }}>
            <Typography 
              sx={{ 
                fontWeight: 'medium',
                color: colors.grey[100]
              }}
            >
              Admin User
            </Typography>
            <Typography 
              variant="body2" 
              sx={{ 
                color: colors.grey[300]
              }}
            >
              Staff
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminSidebar;