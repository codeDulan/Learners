import React, { useState, useEffect } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiGlobe } from "react-icons/fi";
import axios from "axios";

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('authToken') || localStorage.getItem('token');
};

// Headers configuration with auth token
const getAuthHeaders = () => {
  const token = getAuthToken();
  return {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  
  // Form state
  const [profile, setProfile] = useState({
    id: null,
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    nic: "",
    licenseNumber: ""
  });
  
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });

  // Fetch customer profile on component mount
  useEffect(() => {
    fetchCustomerProfile();
  }, []);

  // Fetch profile data from backend
  const fetchCustomerProfile = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(
        `${API_BASE_URL}/customers/profile`, 
        getAuthHeaders()
      );
      
      console.log("Profile response:", response.data);
      
      // Set the profile state with fetched data
      setProfile({
        id: response.data.id,
        firstName: response.data.firstName || "",
        lastName: response.data.lastName || "",
        email: response.data.email || "",
        phoneNumber: response.data.phoneNumber || "",
        address: response.data.address || "",
        nic: response.data.nic || "",
        licenseNumber: response.data.licenseNumber || ""
      });
      
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load your profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Handle profile form changes
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle password form changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPassword(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Save profile changes
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSuccessMessage("");
    
    try {
      // Create the DTO object to send to backend
      const customerUpdateDto = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        phoneNumber: profile.phoneNumber,
        address: profile.address,
        nic: profile.nic,
        licenseNumber: profile.licenseNumber
        // Don't include email as it shouldn't be changeable
      };
      
      // Send update to backend
      const response = await axios.put(
        `${API_BASE_URL}/customers/${profile.id}`,
        customerUpdateDto,
        getAuthHeaders()
      );
      
      console.log("Update response:", response.data);
      
      // Update profile with the returned data
      setProfile(prev => ({
        ...prev,
        firstName: response.data.firstName,
        lastName: response.data.lastName,
        phoneNumber: response.data.phoneNumber,
        address: response.data.address,
        nic: response.data.nic,
        licenseNumber: response.data.licenseNumber
      }));
      
      setSuccessMessage("Profile updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaveLoading(false);
    }
  };
  
  // Update password
  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    setError(null);
    setSuccessMessage("");
    
    // Basic validation
    if (password.new !== password.confirm) {
      setError("New passwords don't match!");
      setSaveLoading(false);
      return;
    }
    
    try {
      // Create password update object
      const passwordUpdate = {
        currentPassword: password.current,
        newPassword: password.new
      };
      
      // Send password update to backend
      await axios.post(
        `${API_BASE_URL}/customers/change-password`,
        passwordUpdate,
        getAuthHeaders()
      );
      
      // Reset password fields
      setPassword({
        current: "",
        new: "",
        confirm: ""
      });
      
      setSuccessMessage("Password updated successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      
    } catch (err) {
      console.error("Error updating password:", err);
      if (err.response && err.response.status === 400) {
        setError("Current password is incorrect. Please try again.");
      } else {
        setError("Failed to update password. Please try again.");
      }
    } finally {
      setSaveLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Settings Tabs */}
      <div className="flex border-b border-gray-700 mb-6">
        <button
          className={`py-2 px-4 flex items-center ${
            activeTab === "profile"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("profile")}
        >
          <FiUser className="mr-2" /> Profile
        </button>
        <button
          className={`py-2 px-4 flex items-center ${
            activeTab === "security"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("security")}
        >
          <FiLock className="mr-2" /> Security
        </button>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="mb-4 p-3 bg-green-800 text-green-100 rounded">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-800 text-red-100 rounded">
          {error}
        </div>
      )}

      {/* Profile Settings */}
      {activeTab === "profile" && (
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">First Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleProfileChange}
                  className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Last Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleProfileChange}
                  className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Email (Cannot be changed)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  disabled
                  className="w-full pl-10 p-2 rounded bg-gray-800 border border-gray-700 text-gray-400 cursor-not-allowed"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleProfileChange}
                  className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiGlobe className="text-gray-500" />
              </div>
              <input
                type="text"
                name="address"
                value={profile.address}
                onChange={handleProfileChange}
                className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">NIC Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="nic"
                  value={profile.nic}
                  onChange={handleProfileChange}
                  className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">License Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiUser className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="licenseNumber"
                  value={profile.licenseNumber}
                  onChange={handleProfileChange}
                  className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center ${
                saveLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {saveLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* Security Settings */}
      {activeTab === "security" && (
        <form onSubmit={handleUpdatePassword} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Current Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <input
                type="password"
                name="current"
                value={password.current}
                onChange={handlePasswordChange}
                className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <input
                type="password"
                name="new"
                value={password.new}
                onChange={handlePasswordChange}
                className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-gray-400 mb-1">Confirm New Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FiLock className="text-gray-500" />
              </div>
              <input
                type="password"
                name="confirm"
                value={password.confirm}
                onChange={handlePasswordChange}
                className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={saveLoading}
              className={`px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded flex items-center ${
                saveLoading ? "opacity-70 cursor-not-allowed" : ""
              }`}
            >
              {saveLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              Update Password
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default SettingsSection;