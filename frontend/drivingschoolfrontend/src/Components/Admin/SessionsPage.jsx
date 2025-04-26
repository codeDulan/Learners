import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  Tabs, 
  Tab, 
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Chip
} from '@mui/material';
import { tokens } from '../../theme';
import { DataGrid } from '@mui/x-data-grid';
import { 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCalendar, 
  FiClock, 
  FiUsers, 
  FiCheckCircle,
  FiXCircle,
  FiBookOpen
} from 'react-icons/fi';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-toastify';

const API_BASE_URL = 'http://localhost:8080/api';

// License type options
const licenseTypeOptions = [
  { value: 'MOTORCYCLE', label: 'Motorcycle' },
  { value: 'LIGHT_VEHICLE', label: 'Light Vehicle' },
  { value: 'HEAVY_VEHICLE', label: 'Heavy Vehicle' }
];

// Session type options
const sessionTypeOptions = [
  { value: 'PRACTICAL', label: 'Practical Driving' },
  { value: 'THEORY', label: 'Theory Lesson' },
  { value: 'TEST', label: 'Driving Test' }
];

// Session status options 
const sessionStatusOptions = [
  { value: 'SCHEDULED', label: 'Scheduled' },
  { value: 'IN_PROGRESS', label: 'In Progress' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

// Helper function to convert Date to LocalDateTime format for Spring Boot
// This removes timezone issues by preserving the displayed time
const convertToLocalDateTime = (date) => {
  if (!date) return null;
  
  // Format the date as YYYY-MM-DDThh:mm:ss
  // This format will be interpreted as local time by Spring Boot's LocalDateTime
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
};

const SessionsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [openDialog, setOpenDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedSessionId, setSelectedSessionId] = useState(null);
  const [newSession, setNewSession] = useState({
    title: '',
    type: '',
    startTime: new Date(),
    endTime: new Date(new Date().getTime() + 60 * 60 * 1000), // 1 hour later
    status: 'SCHEDULED',
    licenseType: '',
    notes: '',
    maxCapacity: 5,
    isAvailable: true
  });

  // Token for API authentication
  const getAuthToken = () => {
    // Try both token keys that might be used in the application
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Headers for API requests
  const getHeaders = () => {
    const token = getAuthToken();
    console.log("Using token for headers:", token);
    return {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };
  };

  // Fetch sessions on component mount
  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setLoading(true);
    setError(null);
    try {
      // First try a simple OPTIONS request to check if the endpoint exists
      try {
        await axios.options(`${API_BASE_URL}/staff/sessions`);
      } catch (optionsErr) {
        console.log("Options request failed, endpoint might not exist:", optionsErr);
      }
      
      console.log("Fetching sessions with token:", getAuthToken());
      const headers = getHeaders();
      console.log("Using headers:", headers);
      
      const response = await axios.get(`${API_BASE_URL}/staff/sessions`, headers);
      console.log("Sessions response:", response.data);
      setSessions(response.data);
    } catch (err) {
      console.error('Error fetching sessions:', err);
      console.log("Error details:", err.response);
      setError('Failed to load sessions. Please try again.');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Handle dialog open/close
  const handleOpenDialog = (edit = false, sessionId = null) => {
    if (edit && sessionId) {
      const sessionToEdit = sessions.find(session => session.id === sessionId);
      if (sessionToEdit) {
        setNewSession({
          title: sessionToEdit.title || '',
          type: sessionToEdit.type,
          startTime: new Date(sessionToEdit.startTime),
          endTime: new Date(sessionToEdit.endTime),
          status: sessionToEdit.status,
          licenseType: sessionToEdit.licenseType,
          notes: sessionToEdit.notes || '',
          maxCapacity: sessionToEdit.maxCapacity,
          isAvailable: sessionToEdit.isAvailable
        });
        setEditMode(true);
        setSelectedSessionId(sessionId);
      }
    } else {
      setNewSession({
        title: '',
        type: '',
        startTime: new Date(),
        endTime: new Date(new Date().getTime() + 60 * 60 * 1000),
        status: 'SCHEDULED',
        licenseType: '',
        notes: '',
        maxCapacity: 5,
        isAvailable: true
      });
      setEditMode(false);
      setSelectedSessionId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewSession({
      ...newSession,
      [name]: value
    });
    
    // Auto-generate title based on session type and license type
    if (name === 'type' || name === 'licenseType') {
      const type = name === 'type' ? value : newSession.type;
      const licenseType = name === 'licenseType' ? value : newSession.licenseType;
      
      if (type && licenseType) {
        const sessionTypeLabel = sessionTypeOptions.find(opt => opt.value === type)?.label || '';
        const licenseTypeLabel = licenseTypeOptions.find(opt => opt.value === licenseType)?.label || '';
        setNewSession(prev => ({
          ...prev,
          title: `${sessionTypeLabel} Session - ${licenseTypeLabel}`
        }));
      }
    }
  };

  const handleDateChange = (name) => (date) => {
    setNewSession({
      ...newSession,
      [name]: date
    });
  };

  // Handle session actions
  const handleSaveSession = async () => {
    try {
      // Use the timezone-aware conversion function
      const sessionData = {
        ...newSession,
        startTime: convertToLocalDateTime(newSession.startTime),
        endTime: convertToLocalDateTime(newSession.endTime)
      };
      
      console.log("Original startTime:", newSession.startTime);
      console.log("Formatted startTime being sent:", sessionData.startTime);
      console.log("Original endTime:", newSession.endTime);
      console.log("Formatted endTime being sent:", sessionData.endTime);
      
      if (editMode) {
        // Update existing session
        await axios.put(`${API_BASE_URL}/staff/sessions/${selectedSessionId}`, sessionData, getHeaders());
        toast.success('Session updated successfully');
      } else {
        // Add new session
        await axios.post(`${API_BASE_URL}/staff/sessions`, sessionData, getHeaders());
        toast.success('Session added successfully');
      }
      
      // Refresh sessions
      fetchSessions();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving session:', err);
      toast.error(err.response?.data?.message || 'Failed to save session');
      setError('Failed to save session. Please try again.');
    }
  };

  const handleDeleteSession = async (id) => {
    if (window.confirm('Are you sure you want to delete this session?')) {
      try {
        await axios.delete(`${API_BASE_URL}/staff/sessions/${id}`, getHeaders());
        toast.success('Session deleted successfully');
        fetchSessions();
      } catch (err) {
        console.error('Error deleting session:', err);
        toast.error(err.response?.data?.message || 'Failed to delete session');
        setError('Failed to delete session. Please try again.');
      }
    }
  };

  // Calendar event handling
  const handleDateClick = (arg) => {
    const startDate = arg.date;
    const endDate = new Date(new Date(startDate).getTime() + 60 * 60 * 1000); // 1 hour later
    
    setNewSession({
      title: '',
      type: '',
      startTime: startDate,
      endTime: endDate,
      status: 'SCHEDULED',
      licenseType: '',
      notes: '',
      maxCapacity: 5,
      isAvailable: true
    });
    
    setEditMode(false);
    setSelectedSessionId(null);
    setOpenDialog(true);
  };

  const handleEventClick = (arg) => {
    const sessionId = parseInt(arg.event.id);
    handleOpenDialog(true, sessionId);
  };

  // Helper function to format date
  const formatDateTime = (date) => {
    return format(new Date(date), 'MMM dd, yyyy hh:mm a');
  };

  // DataGrid columns
  const columns = [
    { 
      field: 'title', 
      headerName: 'Session Title', 
      flex: 1.5,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          {row.type === 'PRACTICAL' ? (
            <FiClock style={{ marginRight: '8px', color: colors.greenAccent[500] }} />
          ) : row.type === 'THEORY' ? (
            <FiBookOpen style={{ marginRight: '8px', color: colors.blueAccent[500] }} />
          ) : (
            <FiCheckCircle style={{ marginRight: '8px', color: colors.redAccent[500] }} />
          )}
          {row.title}
        </Box>
      )
    },
    { 
      field: 'type', 
      headerName: 'Type', 
      flex: 1,
      valueGetter: (params) => {
        const type = params.row.type;
        const typeObj = sessionTypeOptions.find(opt => opt.value === type);
        return typeObj ? typeObj.label : type;
      }
    },
    { 
      field: 'licenseType', 
      headerName: 'License Type', 
      flex: 1,
      valueGetter: (params) => {
        const type = params.row.licenseType;
        const typeObj = licenseTypeOptions.find(opt => opt.value === type);
        return typeObj ? typeObj.label : type;
      }
    },
    { 
      field: 'startTime', 
      headerName: 'Date & Time', 
      flex: 1.5,
      valueGetter: (params) => formatDateTime(params.row.startTime),
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiCalendar style={{ marginRight: '8px', color: colors.blueAccent[400] }} />
          {formatDateTime(row.startTime)}
        </Box>
      )
    },
    { 
      field: 'capacity', 
      headerName: 'Capacity', 
      flex: 0.7,
      renderCell: ({ row }) => (
        <Box display="flex" alignItems="center">
          <FiUsers style={{ marginRight: '8px', color: colors.greenAccent[400] }} />
          {`${row.currentEnrollment || 0} / ${row.maxCapacity}`}
        </Box>
      )
    },
    { 
      field: 'status', 
      headerName: 'Status', 
      flex: 1,
      renderCell: ({ row }) => {
        let bgcolor;
        let icon;
        
        switch(row.status) {
          case 'COMPLETED':
            bgcolor = colors.greenAccent[600];
            icon = <FiCheckCircle style={{ marginRight: '8px' }} />;
            break;
          case 'CANCELLED':
            bgcolor = colors.redAccent[600];
            icon = <FiXCircle style={{ marginRight: '8px' }} />;
            break;
          case 'IN_PROGRESS':
            bgcolor = colors.orangeAccent[600];
            icon = <FiClock style={{ marginRight: '8px' }} />;
            break;
          default:
            bgcolor = colors.blueAccent[600];
            icon = <FiClock style={{ marginRight: '8px' }} />;
        }
        
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
              {row.status.replace('_', ' ')}
            </Typography>
          </Box>
        );
      }
    },
    {
      field: 'isAvailable',
      headerName: 'Availability',
      flex: 1,
      renderCell: ({ row }) => (
        <Chip
          label={row.isAvailable ? 'Available' : 'Not Available'}
          color={row.isAvailable ? 'success' : 'error'}
          size="small"
        />
      )
    },
    {
      field: 'actions',
      headerName: 'Actions',
      flex: 1,
      renderCell: ({ row }) => (
        <Box display="flex" gap="10px">
          <IconButton
            onClick={() => handleOpenDialog(true, row.id)}
            sx={{ color: colors.blueAccent[400] }}
          >
            <FiEdit2 />
          </IconButton>
          <IconButton
            onClick={() => handleDeleteSession(row.id)}
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
          Session Management
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
          Add Session
        </Button>
      </Box>

      {error && (
        <Box bgcolor={colors.redAccent[500]} p={2} borderRadius={1} mb={2}>
          <Typography color={colors.grey[100]}>{error}</Typography>
        </Box>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
          <Tab label="Calendar View" />
          <Tab label="List View" />
        </Tabs>
      </Box>

      {/* Calendar View */}
      {tabValue === 0 && (
        <Box bgcolor={colors.primary[400]} p={3} borderRadius="8px" height="75vh">
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView='dayGridMonth'
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            events={sessions.map(session => ({
              id: session.id,
              title: session.title,
              start: session.startTime,
              end: session.endTime,
              backgroundColor: 
                session.type === 'PRACTICAL' ? colors.greenAccent[500] :
                session.type === 'THEORY' ? colors.blueAccent[500] :
                colors.redAccent[500],
              borderColor: 
                session.type === 'PRACTICAL' ? colors.greenAccent[700] :
                session.type === 'THEORY' ? colors.blueAccent[700] :
                colors.redAccent[700],
              textColor: colors.grey[100]
            }))}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            height="100%"
            loading={loading}
          />
        </Box>
      )}

      {/* List View */}
      {tabValue === 1 && (
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
            rows={sessions} 
            columns={columns} 
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            loading={loading}
          />
        </Box>
      )}

      {/* Add/Edit Session Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          {editMode ? 'Edit Session' : 'Add New Session'}
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <Box display="grid" gap="20px" gridTemplateColumns="repeat(2, 1fr)">
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                <InputLabel>Session Type</InputLabel>
                <Select
                  name="type"
                  value={newSession.type}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select Type</MenuItem>
                  {sessionTypeOptions.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                <InputLabel>License Type</InputLabel>
                <Select
                  name="licenseType"
                  value={newSession.licenseType}
                  onChange={handleInputChange}
                >
                  <MenuItem value="">Select License Type</MenuItem>
                  {licenseTypeOptions.map(type => (
                    <MenuItem key={type.value} value={type.value}>
                      {type.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                variant="filled"
                label="Title"
                name="title"
                value={newSession.title}
                onChange={handleInputChange}
                sx={{ gridColumn: "span 2" }}
              />
              
              <Box sx={{ gridColumn: "span 1" }}>
                <DateTimePicker
                  label="Start Date & Time"
                  value={newSession.startTime}
                  onChange={handleDateChange('startTime')}
                  renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                />
              </Box>
              
              <Box sx={{ gridColumn: "span 1" }}>
                <DateTimePicker
                  label="End Date & Time"
                  value={newSession.endTime}
                  onChange={handleDateChange('endTime')}
                  renderInput={(params) => <TextField {...params} fullWidth variant="filled" />}
                />
              </Box>
              
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={newSession.status}
                  onChange={handleInputChange}
                >
                  {sessionStatusOptions.map(status => (
                    <MenuItem key={status.value} value={status.value}>
                      {status.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                variant="filled"
                label="Maximum Capacity"
                name="maxCapacity"
                type="number"
                value={newSession.maxCapacity}
                onChange={handleInputChange}
                sx={{ gridColumn: "span 1" }}
                InputProps={{ inputProps: { min: 1, max: 20 } }}
              />
              
              <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
                <InputLabel>Availability</InputLabel>
                <Select
                  name="isAvailable"
                  value={newSession.isAvailable}
                  onChange={handleInputChange}
                >
                  <MenuItem value={true}>Available for booking</MenuItem>
                  <MenuItem value={false}>Not available</MenuItem>
                </Select>
              </FormControl>
              
              <TextField
                fullWidth
                variant="filled"
                label="Notes"
                name="notes"
                value={newSession.notes}
                onChange={handleInputChange}
                multiline
                rows={4}
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
          </LocalizationProvider>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], padding: '20px' }}>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancel
          </Button>
          <Button 
            onClick={handleSaveSession} 
            color="primary" 
            variant="contained"
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            {editMode ? 'Update Session' : 'Add Session'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SessionsPage;