import React, { useState } from "react";
import { FiUser, FiLock, FiMail, FiPhone, FiBell, FiGlobe } from "react-icons/fi";

const SettingsSection = () => {
  const [activeTab, setActiveTab] = useState("profile");
  
  // Form state
  const [profile, setProfile] = useState({
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    phone: "+1 555-123-4567",
    address: "123 Main St, City, Country"
  });
  
  const [password, setPassword] = useState({
    current: "",
    new: "",
    confirm: ""
  });
  
  const [notifications, setNotifications] = useState({
    email: true,
    sms: true,
    app: false
  });

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
  
  // Handle notification toggle
  const handleNotificationToggle = (type) => {
    setNotifications(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };
  
  // Save profile changes
  const handleSaveProfile = (e) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    alert("Profile updated successfully!");
  };
  
  // Update password
  const handleUpdatePassword = (e) => {
    e.preventDefault();
    
    // Basic validation
    if (password.new !== password.confirm) {
      alert("New passwords don't match!");
      return;
    }
    
    // In a real app, you would send this data to your backend
    alert("Password updated successfully!");
    setPassword({
      current: "",
      new: "",
      confirm: ""
    });
  };
  
  // Save notification settings
  const handleSaveNotifications = () => {
    // In a real app, you would send this data to your backend
    alert("Notification preferences updated!");
  };

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
        <button
          className={`py-2 px-4 flex items-center ${
            activeTab === "notifications"
              ? "border-b-2 border-blue-500 text-blue-400"
              : "text-gray-400 hover:text-white"
          }`}
          onClick={() => setActiveTab("notifications")}
        >
          <FiBell className="mr-2" /> Notifications
        </button>
      </div>

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
              <label className="block text-sm text-gray-400 mb-1">Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiMail className="text-gray-500" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="w-full pl-10 p-2 rounded bg-gray-700 border border-gray-600"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm text-gray-400 mb-1">Phone</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiPhone className="text-gray-500" />
                </div>
                <input
                  type="tel"
                  name="phone"
                  value={profile.phone}
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
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
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
              />
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Update Password
            </button>
          </div>
        </form>
      )}

      {/* Notification Settings */}
      {activeTab === "notifications" && (
        <div className="space-y-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <FiMail className="text-gray-400 mr-3" />
                <span>Email Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications.email}
                  onChange={() => handleNotificationToggle("email")}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <FiPhone className="text-gray-400 mr-3" />
                <span>SMS Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications.sms}
                  onChange={() => handleNotificationToggle("sms")}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-700 rounded">
              <div className="flex items-center">
                <FiBell className="text-gray-400 mr-3" />
                <span>In-App Notifications</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  checked={notifications.app}
                  onChange={() => handleNotificationToggle("app")}
                />
                <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-600 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleSaveNotifications}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
            >
              Save Preferences
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsSection;