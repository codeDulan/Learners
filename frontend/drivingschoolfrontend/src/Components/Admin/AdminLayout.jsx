import React from 'react';
import { Outlet } from 'react-router-dom';
import AdminSidebar from './AdminSidebar';
import { ColorModeContext, tokens, useMode } from '../../theme';
import { ThemeProvider, CssBaseline, Box, InputBase, IconButton } from '@mui/material';
import { FiBell, FiSearch, FiUser, FiMoon, FiSun } from 'react-icons/fi';

const AdminLayout = () => {
  const [theme, colorMode] = useMode();
  const colors = tokens(theme.palette.mode);

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
                  A
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