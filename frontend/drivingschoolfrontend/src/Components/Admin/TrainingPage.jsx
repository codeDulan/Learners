import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  useTheme, 
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Alert
} from '@mui/material';
import { tokens } from '../../theme';
import { 
  FiCheckCircle, 
  FiClock, 
  FiPlus,
  FiFileText,
  FiAward,
  FiTrash2
} from 'react-icons/fi';
import trainingService, { LicenseType } from '../../services/trainingService';
import { toast } from 'react-toastify';

const TrainingPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  const [tabValue, setTabValue] = useState(0);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [trainingPrograms, setTrainingPrograms] = useState([]);
  
  const [newProgram, setNewProgram] = useState({
    name: '',
    licenseType: '',
    duration: '',
    description: '',
    price: '',
    prerequisites: [],
    newPrerequisite: ''
  });

  // Fetch training programs on component mount
  useEffect(() => {
    fetchTrainingPrograms();
  }, []);

  const fetchTrainingPrograms = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await trainingService.getAllProgramsAdmin();
      setTrainingPrograms(data);
    } catch (err) {
      console.error('Error fetching training programs:', err);
      setError('Failed to load training programs. Please try again.');
      toast.error('Failed to load training programs');
    } finally {
      setLoading(false);
    }
  };

  // Handle tab changes
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleSelectProgram = (program) => {
    setSelectedProgram(program);
    setTabValue(1);
  };

  // Handle dialog open/close and form
  const handleOpenDialog = () => {
    setNewProgram({
      name: '',
      licenseType: '',
      duration: '',
      description: '',
      price: '',
      prerequisites: [],
      newPrerequisite: ''
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProgram({
      ...newProgram,
      [name]: value
    });
  };

  const handleAddPrerequisite = () => {
    if (newProgram.newPrerequisite.trim()) {
      setNewProgram({
        ...newProgram,
        prerequisites: [...newProgram.prerequisites, newProgram.newPrerequisite.trim()],
        newPrerequisite: ''
      });
    }
  };

  const handleRemovePrerequisite = (index) => {
    const updatedPrerequisites = [...newProgram.prerequisites];
    updatedPrerequisites.splice(index, 1);
    setNewProgram({
      ...newProgram,
      prerequisites: updatedPrerequisites
    });
  };
  
  // Submit new program
  const handleCreateProgram = async () => {
    // Validate form
    if (!newProgram.name || !newProgram.licenseType || !newProgram.duration || !newProgram.price) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      // Format data for API
      const programData = {
        name: newProgram.name,
        licenseType: newProgram.licenseType,
        duration: newProgram.duration,
        description: newProgram.description,
        price: parseInt(newProgram.price),
        prerequisites: newProgram.prerequisites
      };
      
      await trainingService.createProgram(programData);
      
      toast.success('Training program created successfully');
      handleCloseDialog();
      fetchTrainingPrograms();
    } catch (err) {
      console.error('Error creating program:', err);
      toast.error(err.response?.data?.message || 'Failed to create program');
    } finally {
      setLoading(false);
    }
  };
  
  // Delete a program
  const handleDeleteProgram = async (id) => {
    if (window.confirm('Are you sure you want to delete this program?')) {
      try {
        setLoading(true);
        await trainingService.deleteProgram(id);
        toast.success('Program deleted successfully');
        
        if (selectedProgram && selectedProgram.id === id) {
          setSelectedProgram(null);
          setTabValue(0);
        }
        
        fetchTrainingPrograms();
      } catch (err) {
        console.error('Error deleting program:', err);
        toast.error(err.response?.data?.message || 'Failed to delete program');
      } finally {
        setLoading(false);
      }
    }
  };
  
  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
          Training Programs
        </Typography>
        <Button
          variant="contained"
          startIcon={<FiPlus />}
          onClick={handleOpenDialog}
          sx={{
            backgroundColor: colors.blueAccent[600],
            '&:hover': {
              backgroundColor: colors.blueAccent[700]
            }
          }}
        >
          Create New Program
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} textColor="secondary" indicatorColor="secondary">
          <Tab label="All Programs" />
          {selectedProgram && <Tab label={`${selectedProgram.name} Details`} />}
        </Tabs>
      </Box>

      {/* All Programs Tab */}
      {tabValue === 0 && (
        <>
          {loading ? (
            <Box display="flex" justifyContent="center" p={5}>
              <CircularProgress />
            </Box>
          ) : (
            <Grid container spacing={3}>
              {trainingPrograms.map((program) => (
                <Grid item xs={12} md={6} lg={4} key={program.id}>
                  <Card 
                    sx={{ 
                      backgroundColor: colors.primary[400],
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        transition: 'transform 0.3s ease-in-out',
                        boxShadow: `0 10px 20px rgba(0, 0, 0, 0.2)`
                      }
                    }}
                  >
                    <Box 
                      sx={{ 
                        height: 140, 
                        backgroundColor: 
                          program.licenseType === LicenseType.MOTORCYCLE ? colors.greenAccent[600] :
                          program.licenseType === LicenseType.LIGHT_VEHICLE ? colors.blueAccent[600] : 
                          colors.redAccent[600],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography variant="h4" fontWeight="bold">
                        {trainingService.getLicenseTypeDisplay(program.licenseType)}
                      </Typography>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h5" fontWeight="bold" gutterBottom>
                        {program.name}
                      </Typography>
                      
                      <Box display="flex" alignItems="center" mb={1}>
                        <FiClock style={{ marginRight: 8, color: colors.grey[300] }} />
                        <Typography variant="body2" color={colors.grey[300]}>
                          Duration: {program.duration}
                        </Typography>
                      </Box>
                      
                      <Box display="flex" alignItems="center" mb={2}>
                        <FiAward style={{ marginRight: 8, color: colors.greenAccent[400] }} />
                        <Typography variant="body2" color={colors.greenAccent[400]}>
                          Rs. {program.price.toLocaleString()}
                        </Typography>
                      </Box>
                      
                      <Typography variant="body2" color={colors.grey[100]} sx={{ 
                        mb: 2,
                        height: 80,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 4,
                        WebkitBoxOrient: 'vertical'
                      }}>
                        {program.description}
                      </Typography>
                      
                      <Box display="flex" gap={2} mt="auto">
                        <Button 
                          fullWidth 
                          variant="contained"
                          onClick={() => handleSelectProgram(program)}
                          sx={{
                            backgroundColor: 
                              program.licenseType === LicenseType.MOTORCYCLE ? colors.greenAccent[600] :
                              program.licenseType === LicenseType.LIGHT_VEHICLE ? colors.blueAccent[600] : 
                              colors.redAccent[600],
                            '&:hover': {
                              backgroundColor: 
                                program.licenseType === LicenseType.MOTORCYCLE ? colors.greenAccent[700] :
                                program.licenseType === LicenseType.LIGHT_VEHICLE ? colors.blueAccent[700] : 
                                colors.redAccent[700]
                            }
                          }}
                        >
                          View Details
                        </Button>
                        <Button 
                          variant="contained" 
                          color="error"
                          onClick={() => handleDeleteProgram(program.id)}
                          sx={{
                            minWidth: '50px',
                            width: '50px'
                          }}
                        >
                          <FiTrash2 />
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </>
      )}

      {/* Program Details Tab */}
      {tabValue === 1 && selectedProgram && (
        <Box>
          <Box 
            sx={{ 
              backgroundColor: colors.primary[400],
              p: 4,
              borderRadius: '10px',
              mb: 4
            }}
          >
            <Typography variant="h3" fontWeight="bold" mb={1}>
              {selectedProgram.name}
            </Typography>
            
            <Box display="flex" flexDirection={{ xs: 'column', md: 'row' }} gap={4} mt={3}>
              <Box flex={2}>
                <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[400]} mb={2}>
                  Program Details
                </Typography>
                
                <Typography variant="body1" color={colors.grey[100]} mb={3}>
                  {selectedProgram.description}
                </Typography>
                
                <Grid container spacing={3} mb={3}>
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                      <FiClock style={{ marginRight: 8, color: colors.grey[300] }} />
                      <Box>
                        <Typography variant="body2" color={colors.grey[300]}>
                          Duration
                        </Typography>
                        <Typography variant="body1">
                          {selectedProgram.duration}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  
                  <Grid item xs={12} sm={6} md={4}>
                    <Box display="flex" alignItems="center">
                      <FiAward style={{ marginRight: 8, color: colors.greenAccent[400] }} />
                      <Box>
                        <Typography variant="body2" color={colors.grey[300]}>
                          Price
                        </Typography>
                        <Typography variant="body1" color={colors.greenAccent[400]} fontWeight="bold">
                          Rs. {selectedProgram.price.toLocaleString()}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
                
                <Typography variant="h6" fontWeight="bold" color={colors.greenAccent[400]} mb={2}>
                  Prerequisites
                </Typography>
                
                <List>
                  {selectedProgram.prerequisites && selectedProgram.prerequisites.map((prerequisite, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <FiCheckCircle style={{ color: colors.greenAccent[400] }} />
                      </ListItemIcon>
                      <ListItemText primary={prerequisite} />
                    </ListItem>
                  ))}
                  {(!selectedProgram.prerequisites || selectedProgram.prerequisites.length === 0) && (
                    <ListItem>
                      <ListItemText primary="No prerequisites" sx={{ color: colors.grey[300] }} />
                    </ListItem>
                  )}
                </List>
              </Box>
            </Box>
          </Box>
        </Box>
      )}

      {/* Create New Program Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          Create New Training Program
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          <Box display="grid" gap="20px" gridTemplateColumns="repeat(2, 1fr)">
            <TextField
              fullWidth
              variant="filled"
              label="Program Name"
              name="name"
              value={newProgram.name}
              onChange={handleInputChange}
              sx={{ gridColumn: "span 2" }}
              required
            />
            
            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }} required>
              <InputLabel>License Type</InputLabel>
              <Select
                name="licenseType"
                value={newProgram.licenseType}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select License Type</MenuItem>
                <MenuItem value={LicenseType.MOTORCYCLE}>Motorcycle</MenuItem>
                <MenuItem value={LicenseType.LIGHT_VEHICLE}>Light Vehicle</MenuItem>
                <MenuItem value={LicenseType.HEAVY_VEHICLE}>Heavy Vehicle</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              variant="filled"
              label="Duration (e.g., 2 Weeks)"
              name="duration"
              value={newProgram.duration}
              onChange={handleInputChange}
              sx={{ gridColumn: "span 1" }}
              required
            />
            
            <TextField
              fullWidth
              variant="filled"
              label="Description"
              name="description"
              value={newProgram.description}
              onChange={handleInputChange}
              multiline
              rows={4}
              sx={{ gridColumn: "span 2" }}
            />
            
            <TextField
              fullWidth
              variant="filled"
              label="Price (Rs.)"
              name="price"
              type="number"
              value={newProgram.price}
              onChange={handleInputChange}
              sx={{ gridColumn: "span 2" }}
              required
            />
            
            <Box sx={{ gridColumn: "span 2" }}>
              <Typography variant="h6" color={colors.grey[100]} mb={1}>
                Prerequisites
              </Typography>
              
              <Box display="flex" gap={2} mb={2}>
                <TextField
                  fullWidth
                  variant="filled"
                  label="Add Prerequisite"
                  name="newPrerequisite"
                  value={newProgram.newPrerequisite}
                  onChange={handleInputChange}
                />
                <Button 
                  variant="contained"
                  onClick={handleAddPrerequisite}
                  sx={{
                    backgroundColor: colors.greenAccent[600],
                    '&:hover': {
                      backgroundColor: colors.greenAccent[700]
                    }
                  }}
                >
                  Add
                </Button>
              </Box>
              
              <List sx={{ bgcolor: colors.primary[500], borderRadius: '4px', maxHeight: '150px', overflow: 'auto' }}>
                {newProgram.prerequisites.length > 0 ? (
                  newProgram.prerequisites.map((prerequisite, index) => (
                    <ListItem 
                      key={index}
                      secondaryAction={
                        <Button 
                          size="small" 
                          color="error" 
                          onClick={() => handleRemovePrerequisite(index)}
                        >
                          Remove
                        </Button>
                      }
                    >
                      <ListItemIcon>
                        <FiCheckCircle style={{ color: colors.greenAccent[400] }} />
                      </ListItemIcon>
                      <ListItemText primary={prerequisite} />
                    </ListItem>
                  ))
                ) : (
                  <ListItem>
                    <ListItemText primary="No prerequisites added yet" sx={{ color: colors.grey[400] }} />
                  </ListItem>
                )}
              </List>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], padding: '20px' }}>
          <Button onClick={handleCloseDialog} color="error" variant="contained">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateProgram}
            color="primary" 
            variant="contained"
            disabled={loading}
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            {loading ? <CircularProgress size={24} /> : 'Create Program'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TrainingPage;