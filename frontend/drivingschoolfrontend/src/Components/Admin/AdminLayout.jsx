import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ColorModeContext, tokens, useMode } from '../../theme';
import { ThemeProvider, CssBaseline, Box, InputBase, IconButton } from '@mui/material';
import { FiBell, FiSearch, FiUser, FiMoon, FiSun } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

const AdminLayout = () => {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);
  
  // Add state for current user
  const [currentUser, setCurrentUser] = useState({
    name: "Admin", // Default fallback
    role: "STAFF"
  });
  const [loading, setLoading] = useState(true);

  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Headers for API requests
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
  };

  // Get first letter of name for avatar
  const getFirstLetter = (name) => {
    if (!name) return "A";
    return name.charAt(0).toUpperCase();
  };

  // Fetch current user info
  useEffect(() => {
    const fetchCurrentUser = async () => {
      setLoading(true);
      
      try {
        const response = await axios.get(
          `${API_BASE_URL}/staff/me`,
          getAuthHeaders()
        );
        
        setCurrentUser({
          name: response.data.name || "Admin",
          role: response.data.role || "STAFF"
        });
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching user data:", err);
        // Fallback to default value
        setCurrentUser({
          name: "Admin", 
          role: "STAFF"      
        });
        setLoading(false);
      }
    };
    
    // Only fetch if we have a token
    if (getAuthToken()) {
      fetchCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box sx={{ 
          display: 'flex', 
          height: '100vh', 
          overflow: 'hidden',
          bgcolor: '#0f172a' // This matches the dark navy in your screenshots
        }}>
          {/* Sidebar */}
          <AdminSidebar />
          
          {/* Main Content */}
          <Box sx={{ 
            flexGrow: 1, 
            display: 'flex', 
            flexDirection: 'column', 
            overflow: 'hidden',
          }}>
            {/* Header */}
            <Box 
              sx={{
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                px: 3,
                py: 2,
                bgcolor: '#1a2234', // Match the header color in screenshots
                borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Box sx={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                  <Box sx={{ position: 'absolute', left: 2, color: 'gray.400' }}>
                    <FiSearch />
                  </Box>
                  <InputBase 
                    placeholder="Search..." 
                    sx={{ 
                      pl: 4,
                      pr: 2,
                      py: 1,
                      ml: 0,
                      width: '280px',
                      backgroundColor: '#121829', // Dark search background from screenshot
                      borderRadius: '4px',
                      color: 'white',
                      '& .MuiInputBase-input::placeholder': {
                        color: 'gray.400',
                        opacity: 1
                      }
                    }}
                  />
                </Box>
              </Box>
              
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <IconButton sx={{ color: 'gray.300', position: 'relative' }}>
                  <FiBell />
                  <Box 
                    sx={{ 
                      position: 'absolute', 
                      top: '2px', 
                      right: '2px', 
                      width: '8px', 
                      height: '8px', 
                      borderRadius: '50%', 
                      bgcolor: '#ef4444'
                    }}
                  />
                </IconButton>
                
                <IconButton 
                  onClick={colorMode.toggleColorMode}
                  sx={{ color: 'gray.300' }}
                >
                  {theme.palette.mode === 'dark' ? <FiSun /> : <FiMoon />}
                </IconButton>
                
                <Box sx={{ 
                  width: '32px', 
                  height: '32px', 
                  borderRadius: '50%', 
                  bgcolor: '#8b5cf6', // Purple from screenshot
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  color: 'white'
                }}>
                  {getFirstLetter(currentUser.name)}
                </Box>
              </Box>
            </Box>
            
            {/* Main Content Area */}
            <Box 
              sx={{
                flexGrow: 1,
                overflow: 'auto',
                p: 3,
                bgcolor: '#0f172a' // Same dark navy as parent
              }}
            >
              <Outlet />
            </Box>
          </Box>
        </Box>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
};

export default AdminLayout;