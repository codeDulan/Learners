import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  useTheme, 
  Tabs, 
  Tab
} from '@mui/material';
import { tokens } from '../../theme';
import { FiMessageSquare, FiList } from 'react-icons/fi';
import FeedbackForm from './FeedbackForm';
import FeedbackList from './FeedbackList';

const FeedbackPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [tabValue, setTabValue] = useState(0);

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  return (
    <Box width="100%">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
          Feedback Management
        </Typography>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
          <Tab 
            icon={<FiMessageSquare style={{ marginRight: '8px' }} />} 
            iconPosition="start" 
            label="Give Feedback" 
          />
          <Tab 
            icon={<FiList style={{ marginRight: '8px' }} />} 
            iconPosition="start" 
            label="Manage Feedback" 
          />
        </Tabs>
      </Box>

      {/* Feedback Form Tab */}
      {tabValue === 0 && <FeedbackForm />}

      {/* Feedback List Tab */}
      {tabValue === 1 && <FeedbackList />}
    </Box>
  );
};

export default FeedbackPage;