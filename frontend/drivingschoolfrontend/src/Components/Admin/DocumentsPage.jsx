import React, { useState, useEffect } from 'react';
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
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Snackbar,
  Alert,
  CircularProgress
} from '@mui/material';
import { tokens } from '../../theme';
import { 
  FiPlus, 
  FiTrash2, 
  FiDownload, 
  FiUpload, 
  FiFile,
  FiFileText,
  FiImage, 
  FiVideo,
  FiFilm
} from 'react-icons/fi';
import TrainingMaterialService from '../../services/TrainingMaterialService ';

const DocumentsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State for training materials
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [licenseFilter, setLicenseFilter] = useState('All');
  
  // State for the upload dialog
  const [openUploadDialog, setOpenUploadDialog] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [notification, setNotification] = useState({
    open: false,
    message: '',
    severity: 'success'
  });
  
  // State for the new document to upload
  const [newDocument, setNewDocument] = useState({
    name: '',
    file: null,
    category: '',
    description: '',
    forLicenseType: 'All',
    visibility: 'All Students'
  });

  // Fetch all training materials when component mounts
  useEffect(() => {
    fetchTrainingMaterials();
  }, []);

  // Function to fetch training materials from the backend
  const fetchTrainingMaterials = async () => {
    setLoading(true);
    try {
      const data = await TrainingMaterialService.getAllMaterials();
      setDocuments(data);
      setError(null);
    } catch (err) {
      console.error('Error fetching training materials:', err);
      setError('Failed to load training materials. Please try again later.');
      showNotification('Failed to load training materials', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Open upload dialog
  const handleOpenUploadDialog = () => {
    setNewDocument({
      name: '',
      file: null,
      category: '',
      description: '',
      forLicenseType: 'All',
      visibility: 'All Students'
    });
    setOpenUploadDialog(true);
  };

  // Close upload dialog
  const handleCloseUploadDialog = () => {
    setOpenUploadDialog(false);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewDocument({
      ...newDocument,
      [name]: value
    });
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewDocument({
        ...newDocument,
        file: file,
        name: file.name
      });
    }
  };

  // Handle document upload
  const handleUploadDocument = async () => {
    if (!newDocument.file || !newDocument.category) {
      showNotification('Please fill in all required fields', 'error');
      return;
    }

    setUploadLoading(true);
    
    try {
      // Create material data object
      const materialData = {
        name: newDocument.name,
        category: newDocument.category,
        description: newDocument.description || '',
        forLicenseType: newDocument.forLicenseType,
        visibility: newDocument.visibility
      };
      
      // Upload the material using the service
      const responseData = await TrainingMaterialService.uploadMaterial(materialData, newDocument.file);
      
      // Add the new document to the list
      setDocuments([...documents, responseData]);
      
      // Show success notification
      showNotification('Training material uploaded successfully', 'success');
      
      // Close the dialog
      handleCloseUploadDialog();
    } catch (err) {
      console.error('Error uploading training material:', err);
      showNotification('Failed to upload training material', 'error');
    } finally {
      setUploadLoading(false);
    }
  };

  // Handle document deletion
  const handleDeleteDocument = async (id) => {
    if (window.confirm('Are you sure you want to delete this document?')) {
      try {
        // Delete the material using the service
        await TrainingMaterialService.deleteMaterial(id);
        
        // Remove the deleted document from the state
        setDocuments(documents.filter(doc => doc.id !== id));
        
        // Show success notification
        showNotification('Training material deleted successfully', 'success');
      } catch (err) {
        console.error('Error deleting training material:', err);
        showNotification('Failed to delete training material', 'error');
      }
    }
  };

  // Handle document download
  const handleDownloadDocument = async (id, name) => {
    try {
      // Get the blob data
      const blobData = await TrainingMaterialService.downloadMaterial(id);
      
      // Create a download link and click it
      const url = window.URL.createObjectURL(new Blob([blobData]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', name);
      document.body.appendChild(link);
      link.click();
      link.remove();
      
      // Update the download count in the UI
      setDocuments(documents.map(doc => 
        doc.id === id 
          ? { ...doc, downloadCount: doc.downloadCount + 1 } 
          : doc
      ));
      
      // Show success notification
      showNotification(`Downloading ${name}`, 'success');
    } catch (err) {
      console.error('Error downloading training material:', err);
      showNotification('Failed to download training material', 'error');
    }
  };

  // Show notification
  const showNotification = (message, severity) => {
    setNotification({
      open: true,
      message,
      severity
    });
  };

  // Close notification
  const handleCloseNotification = () => {
    setNotification({
      ...notification,
      open: false
    });
  };

  // Filter documents based on search and filters
  const filteredDocuments = documents.filter(document => 
    (document.name.toLowerCase().includes(searchText.toLowerCase()) ||
     (document.description && document.description.toLowerCase().includes(searchText.toLowerCase()))) &&
    (categoryFilter === 'All' || document.category === categoryFilter) &&
    (licenseFilter === 'All' || document.forLicenseType === licenseFilter || document.forLicenseType === 'All')
  );

  // Get unique categories for filter
  const categories = ['All', ...new Set(documents.map(doc => doc.category))];

  // Document icon based on type
  const getDocumentIcon = (fileType) => {
    if (fileType && fileType.includes('pdf')) {
      return <FiFileText size={24} style={{ color: colors.redAccent[500] }} />;
    } else if (fileType && fileType.includes('image')) {
      return <FiImage size={24} style={{ color: colors.greenAccent[500] }} />;
    } else if (fileType && (fileType.includes('video') || fileType.includes('mp4'))) {
      return <FiFilm size={24} style={{ color: colors.blueAccent[500] }} />;
    } else {
      return <FiFile size={24} style={{ color: colors.grey[400] }} />;
    }
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <Box>
      {/* Header section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" fontWeight="bold" color={colors.grey[100]}>
          Training Materials
        </Typography>
        <Button
          variant="contained"
          startIcon={<FiUpload />}
          onClick={handleOpenUploadDialog}
          sx={{
            backgroundColor: colors.blueAccent[600],
            '&:hover': {
              backgroundColor: colors.blueAccent[700]
            }
          }}
        >
          Upload Material
        </Button>
      </Box>

      {/* Search and filter section */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px" width="40%">
          <FiPlus style={{ margin: '10px', color: colors.grey[400], opacity: 0 }} />
          <TextField
            variant="standard"
            placeholder="Search materials..."
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

        <Box display="flex" gap={2}>
          <FormControl variant="filled" sx={{ minWidth: 120 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              {categories.map(category => (
                <MenuItem key={category} value={category}>{category}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl variant="filled" sx={{ minWidth: 120 }}>
            <InputLabel>License Type</InputLabel>
            <Select
              value={licenseFilter}
              onChange={(e) => setLicenseFilter(e.target.value)}
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Motorcycle">Motorcycle</MenuItem>
              <MenuItem value="Light Vehicle">Light Vehicle</MenuItem>
              <MenuItem value="Heavy Vehicle">Heavy Vehicle</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Box>

      {/* Main content - Document list */}
      <Box bgcolor={colors.primary[400]} borderRadius="10px" p={3} height="65vh" overflow="auto">
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" height="100%">
            <CircularProgress />
          </Box>
        ) : error ? (
          <Box textAlign="center" py={4}>
            <Typography variant="h5" color={colors.grey[300]}>
              {error}
            </Typography>
            <Button 
              variant="contained" 
              onClick={fetchTrainingMaterials}
              sx={{ mt: 2 }}
            >
              Try Again
            </Button>
          </Box>
        ) : filteredDocuments.length > 0 ? (
          <List>
            {filteredDocuments.map((document, index) => (
              <React.Fragment key={document.id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    '&:hover': {
                      backgroundColor: colors.primary[500]
                    }
                  }}
                >
                  <ListItemIcon>
                    {getDocumentIcon(document.fileType)}
                  </ListItemIcon>
                  <ListItemText 
                    primary={document.name}
                    secondary={
                      <Box component="span" sx={{ color: colors.grey[300] }}>
                        {`${document.category} • ${formatFileSize(document.fileSize)} • For: ${document.forLicenseType} • Uploaded: ${formatDate(document.uploadDate)}`}
                        {document.description && <Box mt={1}>{document.description}</Box>}
                      </Box>
                    }
                  />
                  <Box display="flex" alignItems="center" mr={2}>
                    <Typography variant="body2" color={colors.grey[300]} mr={1}>
                      {document.downloadCount || 0} Downloads
                    </Typography>
                  </Box>
                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDownloadDocument(document.id, document.name)}
                      sx={{ color: colors.blueAccent[400], marginRight: 1 }}
                    >
                      <FiDownload />
                    </IconButton>
                    <IconButton 
                      edge="end" 
                      onClick={() => handleDeleteDocument(document.id)}
                      sx={{ color: colors.redAccent[400] }}
                    >
                      <FiTrash2 />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                {index < filteredDocuments.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        ) : (
          <Box textAlign="center" py={4}>
            <FiFile size={48} style={{ color: colors.grey[500], margin: '0 auto 16px' }} />
            <Typography variant="h5" color={colors.grey[300]}>
              No documents found
            </Typography>
            <Typography variant="body2" color={colors.grey[400]}>
              Try adjusting your search or filters, or upload new materials
            </Typography>
          </Box>
        )}
      </Box>

      {/* Upload Dialog */}
      <Dialog open={openUploadDialog} onClose={handleCloseUploadDialog} maxWidth="md" fullWidth>
        <DialogTitle sx={{ backgroundColor: colors.primary[400], color: colors.grey[100] }}>
          Upload Training Material
        </DialogTitle>
        <DialogContent sx={{ backgroundColor: colors.primary[400], paddingTop: '20px !important' }}>
          <Box display="grid" gap="20px" gridTemplateColumns="repeat(2, 1fr)">
            <Box sx={{ gridColumn: "span 2" }}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                sx={{ 
                  height: 100, 
                  borderStyle: 'dashed',
                  color: colors.grey[300],
                  borderColor: colors.grey[700],
                  display: 'flex',
                  flexDirection: 'column',
                  '&:hover': {
                    borderColor: colors.primary[300]
                  }
                }}
              >
                <FiUpload size={24} style={{ marginBottom: 8 }} />
                <Typography>
                  {newDocument.file ? newDocument.file.name : 'Click to select training material'}
                </Typography>
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Box>

            <TextField
              fullWidth
              variant="filled"
              label="Document Name"
              name="name"
              value={newDocument.name}
              onChange={handleInputChange}
              sx={{ gridColumn: "span 2" }}
            />
            
            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={newDocument.category}
                onChange={handleInputChange}
              >
                <MenuItem value="">Select Category</MenuItem>
                <MenuItem value="Training Material">Training Material</MenuItem>
                <MenuItem value="Tutorial">Tutorial</MenuItem>
                <MenuItem value="Guidelines">Guidelines</MenuItem>
                <MenuItem value="Exam Prep">Exam Prep</MenuItem>
                <MenuItem value="Reference">Reference</MenuItem>
              </Select>
            </FormControl>
            
            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 1" }}>
              <InputLabel>For License Type</InputLabel>
              <Select
                name="forLicenseType"
                value={newDocument.forLicenseType}
                onChange={handleInputChange}
              >
                <MenuItem value="All">All License Types</MenuItem>
                <MenuItem value="Motorcycle">Motorcycle</MenuItem>
                <MenuItem value="Light Vehicle">Light Vehicle</MenuItem>
                <MenuItem value="Heavy Vehicle">Heavy Vehicle</MenuItem>
              </Select>
            </FormControl>
            
            <TextField
              fullWidth
              variant="filled"
              label="Description"
              name="description"
              value={newDocument.description}
              onChange={handleInputChange}
              multiline
              rows={3}
              sx={{ gridColumn: "span 2" }}
            />
            
            <FormControl fullWidth variant="filled" sx={{ gridColumn: "span 2" }}>
              <InputLabel>Visibility</InputLabel>
              <Select
                name="visibility"
                value={newDocument.visibility}
                onChange={handleInputChange}
              >
                <MenuItem value="All Students">All Students</MenuItem>
                <MenuItem value="Staff Only">Staff Only</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ backgroundColor: colors.primary[400], padding: '20px' }}>
          <Button onClick={handleCloseUploadDialog} color="error" variant="contained">
            Cancel
          </Button>
          <Button 
            onClick={handleUploadDocument} 
            color="primary" 
            variant="contained"
            disabled={uploadLoading}
            startIcon={uploadLoading ? <CircularProgress size={24} /> : null}
            sx={{
              backgroundColor: colors.greenAccent[600],
              '&:hover': {
                backgroundColor: colors.greenAccent[700]
              }
            }}
          >
            {uploadLoading ? 'Uploading...' : 'Upload'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Notification Snackbar */}
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DocumentsPage;