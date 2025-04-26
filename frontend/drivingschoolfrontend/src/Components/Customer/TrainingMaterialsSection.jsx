import React, { useState, useEffect } from 'react';
import { 
  FiDownload, 
  FiFileText, 
  FiImage, 
  FiVideo, 
  FiFile, 
  FiSearch, 
  FiInfo 
} from 'react-icons/fi';
import axios from 'axios';
import { format } from 'date-fns';

// API URL
const API_URL = "http://localhost:8080/api";

const TrainingMaterialsSection = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [licenseFilter, setLicenseFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedMaterial, setSelectedMaterial] = useState(null);
  const [showMaterialDetails, setShowMaterialDetails] = useState(false);

  // Fetch materials on component mount
  useEffect(() => {
    fetchMaterials();
  }, [licenseFilter]);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        setError("Authentication token not found. Please log in again.");
        setLoading(false);
        return;
      }

      const response = await axios.get(
        `${API_URL}/training-materials${licenseFilter !== 'All' ? `?licenseType=${licenseFilter}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('Fetched materials:', response.data);
      setMaterials(response.data);
      setError(null);
    } catch (err) {
      console.error("Error fetching materials:", err);
      setError("Failed to load training materials. Please try again later.");
      
      // Mock data for development/demo purposes
      setMaterials([
        {
          id: 1,
          name: "Motorcycle Safety Guide.pdf",
          fileType: "application/pdf",
          category: "Training Material",
          description: "Comprehensive guide on motorcycle safety",
          fileSize: 2845678,
          forLicenseType: "Motorcycle",
          visibility: "All Students",
          downloadCount: 15,
          uploadDate: "2025-04-15T15:30:22"
        },
        {
          id: 2,
          name: "Road Signs Handbook.pdf",
          fileType: "application/pdf",
          category: "Reference",
          description: "Complete handbook of road signs and their meanings",
          fileSize: 5467890,
          forLicenseType: "All",
          visibility: "All Students",
          downloadCount: 32,
          uploadDate: "2025-04-10T10:15:30"
        },
        {
          id: 3,
          name: "Vehicle Handling Techniques.mp4",
          fileType: "video/mp4",
          category: "Tutorial",
          description: "Video tutorial on proper vehicle handling techniques",
          fileSize: 45875421,
          forLicenseType: "Light Vehicle",
          visibility: "All Students",
          downloadCount: 28,
          uploadDate: "2025-04-05T09:22:15"
        },
        {
          id: 4,
          name: "Heavy Vehicle Safety Guidelines.docx",
          fileType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          category: "Guidelines",
          description: "Safety guidelines for heavy vehicle operation",
          fileSize: 1843256,
          forLicenseType: "Heavy Vehicle",
          visibility: "All Students",
          downloadCount: 12,
          uploadDate: "2025-04-01T14:45:10"
        },
        {
          id: 5,
          name: "Driver Test Preparation.pdf",
          fileType: "application/pdf",
          category: "Exam Prep",
          description: "Preparation guide for the driver license test",
          fileSize: 3542781,
          forLicenseType: "All",
          visibility: "All Students",
          downloadCount: 45,
          uploadDate: "2025-03-28T11:30:45"
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Handle material download
  const handleDownload = async (material) => {
    try {
      const token = localStorage.getItem('token') || localStorage.getItem('authToken');
      if (!token) {
        alert("Authentication token not found. Please log in again.");
        return;
      }

      // Request the file
      const response = await axios.get(
        `${API_URL}/training-materials/${material.id}/download`,
        {
          headers: {
            'Authorization': `Bearer ${token}`
          },
          responseType: 'blob' // Important for file download
        }
      );

      // Create a download link and click it
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', material.name);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Update the download count in the UI
      setMaterials(materials.map(m => 
        m.id === material.id 
          ? { ...m, downloadCount: m.downloadCount + 1 } 
          : m
      ));

      // Show success message
      alert(`Downloading ${material.name}`);
    } catch (err) {
      console.error("Error downloading material:", err);
      alert("Failed to download the material. Please try again later.");
    }
  };

  // View material details
  const openMaterialDetails = (material) => {
    setSelectedMaterial(material);
    setShowMaterialDetails(true);
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
    return format(date, "MMM dd, yyyy");
  };

  // Get material icon based on file type
  const getMaterialIcon = (fileType) => {
    if (fileType && fileType.includes('pdf')) {
      return <FiFileText className="text-red-500" size={20} />;
    } else if (fileType && fileType.includes('image')) {
      return <FiImage className="text-green-500" size={20} />;
    } else if (fileType && (fileType.includes('video') || fileType.includes('mp4'))) {
      return <FiVideo className="text-blue-500" size={20} />;
    } else {
      return <FiFile className="text-gray-400" size={20} />;
    }
  };

  // Get unique categories for filter
  const categories = ['All', ...new Set(materials.map(material => material.category))];

  // Filter materials based on search and filters
  const filteredMaterials = materials.filter(material => 
    (material.name.toLowerCase().includes(searchText.toLowerCase()) ||
     (material.description && material.description.toLowerCase().includes(searchText.toLowerCase()))) &&
    (categoryFilter === 'All' || material.category === categoryFilter)
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Training Materials</h2>
        <div className="flex gap-2">
          {/* License Type Filter */}
          <select
            value={licenseFilter}
            onChange={(e) => setLicenseFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 text-sm"
          >
            <option value="All">All Types</option>
            <option value="Motorcycle">Motorcycle</option>
            <option value="Light Vehicle">Light Vehicle</option>
            <option value="Heavy Vehicle">Heavy Vehicle</option>
          </select>
          
          {/* Category Filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-gray-700 border border-gray-600 rounded p-2 text-sm"
          >
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Search Box */}
      <div className="relative">
        <FiSearch className="absolute left-3 top-3 text-gray-400" />
        <input
          type="text"
          placeholder="Search materials..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="w-full bg-gray-700 border border-gray-600 rounded p-2 pl-10"
        />
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-900 border border-red-600 text-white p-3 rounded-md">
          {error}
        </div>
      )}

      {/* Loading Indicator */}
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          {/* Materials Grid */}
          {filteredMaterials.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMaterials.map((material) => (
                <div
                  key={material.id}
                  className="bg-gray-700 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-2">
                      {getMaterialIcon(material.fileType)}
                      <span className="text-xs bg-gray-600 px-2 py-1 rounded">
                        {material.forLicenseType}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold truncate" title={material.name}>
                      {material.name}
                    </h3>
                    
                    <div className="text-sm text-gray-300 mt-2 h-12 overflow-hidden">
                      {material.description || "No description available"}
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-400 mt-3">
                      <span>Size: {formatFileSize(material.fileSize)}</span>
                      <span>Uploaded: {formatDate(material.uploadDate)}</span>
                    </div>
                    
                    <div className="mt-4 flex space-x-2">
                      <button
                        className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center justify-center"
                        onClick={() => openMaterialDetails(material)}
                      >
                        <FiInfo className="mr-1" /> Details
                      </button>
                      <button
                        className="flex-1 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center justify-center"
                        onClick={() => handleDownload(material)}
                      >
                        <FiDownload className="mr-1" /> Download
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-10 text-center bg-gray-700 rounded-lg">
              <FiInfo className="mx-auto text-4xl mb-2 text-gray-400" />
              <p>No training materials found.</p>
              <p className="text-gray-400 mt-1">Try adjusting your search or filters.</p>
            </div>
          )}
        </>
      )}

      {/* Material Details Modal */}
      {showMaterialDetails && selectedMaterial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg w-full max-w-md">
            <div className="p-5">
              <h2 className="text-xl font-bold mb-4 flex items-center">
                {getMaterialIcon(selectedMaterial.fileType)}
                <span className="ml-2">{selectedMaterial.name}</span>
              </h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">Category:</span>
                  <span className="font-medium">{selectedMaterial.category}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">License Type:</span>
                  <span className="font-medium">{selectedMaterial.forLicenseType}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">File Size:</span>
                  <span className="font-medium">{formatFileSize(selectedMaterial.fileSize)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Upload Date:</span>
                  <span className="font-medium">{formatDate(selectedMaterial.uploadDate)}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">Downloads:</span>
                  <span className="font-medium">{selectedMaterial.downloadCount}</span>
                </div>
                
                {selectedMaterial.description && (
                  <div>
                    <span className="text-gray-400 block mb-1">Description:</span>
                    <p className="bg-gray-700 p-2 rounded text-sm">{selectedMaterial.description}</p>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between pt-3 border-t border-gray-700">
                <button
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                  onClick={() => setShowMaterialDetails(false)}
                >
                  Close
                </button>
                
                <button
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded flex items-center"
                  onClick={() => handleDownload(selectedMaterial)}
                >
                  <FiDownload className="mr-1" /> Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TrainingMaterialsSection;