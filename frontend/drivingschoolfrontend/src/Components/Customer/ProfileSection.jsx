import React, { useState } from "react";
import { FiUser, FiCamera } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

// Sample data
const fullPayment = 500;
const paidAmount = 300;
const remainingPayment = fullPayment - paidAmount;

const paymentData = [
  { name: "Paid", value: paidAmount, color: "#4CAF50" },
  { name: "Remaining", value: remainingPayment, color: "#F44336" },
];

const attendanceData = [
  { date: "2025-03-01", customer: "John Doe" },
  { date: "2025-03-05", customer: "John Doe" },
  { date: "2025-03-10", customer: "John Doe" },
  { date: "2025-03-15", customer: "John Doe" },
  { date: "2025-03-20", customer: "John Doe" },
];

const ProfileSection = () => {
  const [profileImage, setProfileImage] = useState(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="relative w-32 h-32 mx-auto md:mx-0">
            <div className="w-full h-full rounded-full border-4 border-gray-600 overflow-hidden">
              {profileImage ? (
                <img 
                  src={profileImage} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-700">
                  <FiUser size={50} />
                </div>
              )}
            </div>
            <label
              htmlFor="upload-photo"
              className="absolute bottom-0 right-0 bg-gray-700 p-2 rounded-full cursor-pointer hover:bg-blue-600"
            >
              <FiCamera />
            </label>
            <input type="file" id="upload-photo" className="hidden" onChange={handleImageChange} />
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">John Doe</h2>
            <p className="text-gray-400">Customer ID: #12345</p>
            <p className="mt-2">Last Attended Session: March 20, 2025</p>
            <div className="mt-3">
              <span className="inline-block bg-blue-900 text-blue-300 px-2 py-1 rounded text-xs font-medium mr-2">
                Motorcycle
              </span>
              <span className="inline-block bg-green-900 text-green-300 px-2 py-1 rounded text-xs font-medium">
                Active
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      <div className="p-5 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Payment Details</h2>
        <div className="flex flex-col lg:flex-row items-center">
          <div className="w-full lg:w-1/2 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie 
                  data={paymentData} 
                  dataKey="value" 
                  cx="50%" 
                  cy="50%" 
                  outerRadius={80} 
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full lg:w-1/2 p-4">
            <div className="flex justify-between items-center p-2 border-b border-gray-700">
              <span>Total Package:</span>
              <span className="font-bold">${fullPayment}</span>
            </div>
            <div className="flex justify-between items-center p-2 border-b border-gray-700">
              <span>Paid:</span>
              <span className="font-bold text-green-500">${paidAmount}</span>
            </div>
            <div className="flex justify-between items-center p-2">
              <span>Remaining:</span>
              <span className="font-bold text-red-500">${remainingPayment}</span>
            </div>
            <button className="w-full mt-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
              Make Payment
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Records */}
      <div className="p-5 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Attendance Records</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-700">
                <th className="text-left p-3">Date</th>
                <th className="text-left p-3">Customer Name</th>
              </tr>
            </thead>
            <tbody>
              {attendanceData.map((record, index) => (
                <tr 
                  key={index} 
                  className="border-b border-gray-700"
                >
                  <td className="p-3">{record.date}</td>
                  <td className="p-3">{record.customer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* License Information */}
      <div className="p-5 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">License Information</h2>
        <div className="space-y-3">
          <div className="flex justify-between p-2 bg-gray-700 rounded">
            <span>License Type:</span>
            <span className="font-medium">Motorcycle</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-700 rounded">
            <span>Status:</span>
            <span className="font-medium text-green-500">In Progress</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-700 rounded">
            <span>Enrolled Date:</span>
            <span className="font-medium">February 15, 2025</span>
          </div>
          <div className="flex justify-between p-2 bg-gray-700 rounded">
            <span>Progress:</span>
            <div className="w-32 bg-gray-600 rounded-full h-2.5">
              <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "65%" }}></div>
            </div>
          </div>
        </div>
      </div>

      {/* Documents */}
      <div className="p-5 rounded-lg border border-gray-700">
        <h2 className="text-lg font-semibold mb-4">My Documents</h2>
        <div className="space-y-2">
          {["NIC Copy", "Medical Certificate", "Application Form"].map((doc, index) => (
            <div key={index} className="flex justify-between items-center p-3 bg-gray-700 rounded">
              <span>{doc}</span>
              <span className="text-green-500 text-sm">Verified</span>
            </div>
          ))}
          <button className="w-full mt-3 py-2 bg-blue-600 hover:bg-blue-700 rounded-md">
            Upload New Document
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;