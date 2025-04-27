import React, { useState, useEffect } from "react";
import { FiUser } from "react-icons/fi";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
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

const CustomerProfileSection = () => {
  // State for customer data and loading
  const [customer, setCustomer] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAttendedSession, setLastAttendedSession] = useState(null);

  // Fetch customer data on component mount
  useEffect(() => {
    fetchCustomerData();
  }, []);

  // Fetch customer profile data
  const fetchCustomerData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch customer profile using the new endpoint
      const profileResponse = await axios.get(
        `${API_BASE_URL}/customers/profile`, 
        getAuthHeaders()
      );
      
      console.log("Profile response:", profileResponse.data);
      setCustomer(profileResponse.data);
      
      // Try to fetch customer sessions
      try {
        const sessionsResponse = await axios.get(
          `${API_BASE_URL}/customers/sessions/my-sessions`, 
          getAuthHeaders()
        );
        
        console.log("Sessions response:", sessionsResponse.data);
        
        // Find last attended session if available
        if (sessionsResponse.data && sessionsResponse.data.length > 0) {
          // Sort by date (newest first)
          const sortedSessions = [...sessionsResponse.data].sort(
            (a, b) => new Date(b.startTime) - new Date(a.startTime)
          );
          
          // Take the most recent one
          setLastAttendedSession({
            date: sortedSessions[0].startTime,
            sessionTitle: sortedSessions[0].title
          });
        }
      } catch (sessionError) {
        console.error("Error fetching sessions:", sessionError);
        // Non-critical error, continue without sessions data
      }
      
      // Try to fetch customer enrollments 
      try {
        const enrollmentsResponse = await axios.get(
          `${API_BASE_URL}/customers/enrollments`, 
          getAuthHeaders()
        );
        
        console.log("Enrollments response:", enrollmentsResponse.data);
        setEnrollments(enrollmentsResponse.data || []);
      } catch (enrollmentError) {
        console.error("Error fetching enrollments:", enrollmentError);
        // Non-critical error, continue without enrollments data
      }
      
      // Try to fetch customer payments
      try {
        const paymentsResponse = await axios.get(
          `${API_BASE_URL}/customers/payments`, 
          getAuthHeaders()
        );
        
        console.log("Payments response:", paymentsResponse.data);
        setPayments(paymentsResponse.data || []);
      } catch (paymentError) {
        console.error("Error fetching payments:", paymentError);
        // Non-critical error, continue without payments data
      }
      
    } catch (error) {
      console.error("Error fetching customer data:", error);
      console.log("Error response:", error.response);
      setError("Failed to load customer profile. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  // Format customer name from firstName and lastName
  const getFullName = () => {
    if (!customer) return "N/A";
    return `${customer.firstName || ''} ${customer.lastName || ''}`.trim() || "N/A";
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  };

  // Calculate payment summary for each enrollment
  const getPaymentSummary = (enrollmentId) => {
    const enrollment = enrollments.find(e => e.id === enrollmentId);
    
    if (!enrollment) {
      return {
        fullPayment: 0,
        paidAmount: 0,
        remainingPayment: 0
      };
    }
    
    // Calculate total paid amount for this enrollment
    const paidAmount = payments
      .filter(p => p.enrollmentId === enrollmentId && p.status === "COMPLETED")
      .reduce((sum, payment) => sum + payment.amount, 0);
    
    return {
      fullPayment: enrollment.programPrice || 0,
      paidAmount,
      remainingPayment: (enrollment.programPrice || 0) - paidAmount
    };
  };

  // Create payment data for pie chart
  const createPaymentChartData = (enrollmentId) => {
    const { paidAmount, remainingPayment } = getPaymentSummary(enrollmentId);
    
    return [
      { name: "Paid", value: paidAmount, color: "#4CAF50" },
      { name: "Remaining", value: remainingPayment, color: "#F44336" }
    ];
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-900 text-white rounded-lg">
        <p>{error}</p>
        <p className="mt-2 text-sm">There was a problem loading your profile. Please try logging out and back in.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Info */}
      <div className="p-6 rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center gap-6">
          <div className="w-32 h-32 mx-auto md:mx-0">
            <div className="w-full h-full rounded-full border-4 border-gray-600 overflow-hidden">
              <div className="w-full h-full flex items-center justify-center bg-gray-700">
                <FiUser size={50} />
              </div>
            </div>
          </div>

          <div className="text-center md:text-left">
            <h2 className="text-2xl font-bold">{getFullName()}</h2>
            <p className="text-gray-400">Customer ID: #{customer?.id || "N/A"}</p>
            <p className="text-gray-400">Email: {customer?.email || "N/A"}</p>
            <p className="text-gray-400">Phone: {customer?.phoneNumber || "N/A"}</p>
            <p className="mt-2">
              Last Attended Session: {lastAttendedSession ? formatDate(lastAttendedSession.date) : "N/A"}
            </p>
          </div>
        </div>
      </div>

      {/* Payment Details */}
      {enrollments.length > 0 ? (
        enrollments.map((enrollment) => {
          const paymentData = createPaymentChartData(enrollment.id);
          const { fullPayment, paidAmount, remainingPayment } = getPaymentSummary(enrollment.id);
          
          return (
            <div key={enrollment.id} className="p-5 rounded-lg border border-gray-700">
              <h2 className="text-lg font-semibold mb-2">{enrollment.programName}</h2>
              <p className="text-sm text-gray-400 mb-4">Enrolled on: {formatDate(enrollment.enrollmentDate)}</p>
              
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
                    <span className="font-bold">Rs.{fullPayment}</span>
                  </div>
                  <div className="flex justify-between items-center p-2 border-b border-gray-700">
                    <span>Paid:</span>
                    <span className="font-bold text-green-500">Rs.{paidAmount}</span>
                  </div>
                  <div className="flex justify-between items-center p-2">
                    <span>Remaining:</span>
                    <span className="font-bold text-red-500">Rs.{remainingPayment}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="p-5 rounded-lg border border-gray-700 text-center">
          <p className="text-gray-400">No active enrollments found.</p>
        </div>
      )}
    </div>
  );
};

export default CustomerProfileSection;