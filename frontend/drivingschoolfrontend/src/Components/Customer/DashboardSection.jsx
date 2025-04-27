import React, { useState, useEffect } from "react";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import axios from "axios";
import { FiCalendar, FiDollarSign, FiCheckSquare, FiClock } from "react-icons/fi";

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

const DashboardSection = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessions, setSessions] = useState([]);
  const [payments, setPayments] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [materials, setMaterials] = useState([]);
  
  // Get auth token from localStorage
  const getAuthToken = () => {
    return localStorage.getItem('authToken') || localStorage.getItem('token');
  };

  // Headers for API requests
  const getAuthHeaders = () => {
    const token = getAuthToken();
    return {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      }
    };
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

  // Format time for display
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch sessions
        const sessionsResponse = await axios.get(
          `${API_BASE_URL}/customers/sessions/my-sessions`,
          getAuthHeaders()
        );
        console.log("Sessions:", sessionsResponse.data);
        setSessions(sessionsResponse.data || []);
        
        // Fetch enrollments
        const enrollmentsResponse = await axios.get(
          `${API_BASE_URL}/customers/enrollments`,
          getAuthHeaders()
        );
        console.log("Enrollments:", enrollmentsResponse.data);
        setEnrollments(enrollmentsResponse.data || []);
        
        // Fetch payments
        const paymentsResponse = await axios.get(
          `${API_BASE_URL}/customers/payments`,
          getAuthHeaders()
        );
        console.log("Payments:", paymentsResponse.data);
        setPayments(paymentsResponse.data || []);
        
        // Fetch materials
        const materialsResponse = await axios.get(
          `${API_BASE_URL}/training-materials`,
          getAuthHeaders()
        );
        console.log("Materials:", materialsResponse.data);
        setMaterials(materialsResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load dashboard data");
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Calculate total bookings
  const totalBookings = sessions.length;
  
  // Calculate completed sessions
  const completedSessions = sessions.filter(session => 
    session.status === "COMPLETED"
  ).length;
  
  // Calculate remaining payments
  // For each enrollment, subtract all paid amounts from the total program price
  const calculateRemainingPayments = () => {
    let totalRemaining = 0;
    
    // Process each enrollment
    for (const enrollment of enrollments) {
      const programPrice = enrollment.programPrice || 0;
      
      // Get completed payments for this enrollment
      const paidAmount = payments
        .filter(payment => 
          payment.enrollmentId === enrollment.id && 
          payment.status === "COMPLETED"
        )
        .reduce((sum, payment) => sum + payment.amount, 0);
      
      // Add the remaining amount to the total
      const remaining = programPrice - paidAmount;
      if (remaining > 0) {
        totalRemaining += remaining;
      }
    }
    
    return totalRemaining;
  };
  
  const pendingPayments = calculateRemainingPayments();
  
  // Get next session
  const nextSession = sessions
    .filter(session => 
      new Date(session.startTime) > new Date() && 
      session.status !== "CANCELLED"
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))[0];
  
  // Create session history data
  const getSessionHistoryData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const sessionsInMonth = sessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        return sessionDate.getMonth() === month.getMonth() && 
               sessionDate.getFullYear() === month.getFullYear() &&
               session.status === "COMPLETED";
      }).length;
      
      months.push({
        name: monthName,
        sessions: sessionsInMonth
      });
    }
    
    return months;
  };
  
  const sessionHistory = getSessionHistoryData();
  
  // Get upcoming sessions
  const upcomingSessions = sessions
    .filter(session => 
      new Date(session.startTime) > new Date() && 
      session.status !== "CANCELLED"
    )
    .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
    .slice(0, 2);
  
  // Get recent materials
  const recentMaterials = materials
    .sort((a, b) => new Date(b.uploadDate || 0) - new Date(a.uploadDate || 0))
    .slice(0, 2);

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
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { 
            title: "Total Bookings", 
            value: totalBookings, 
            icon: <FiCalendar size={24} className="text-blue-400" /> 
          },
          { 
            title: "Pending Payments", 
            value: `Rs.${pendingPayments}`, 
            icon: <FiDollarSign size={24} className="text-green-400" /> 
          },
          { 
            title: "Completed Sessions", 
            value: completedSessions, 
            icon: <FiCheckSquare size={24} className="text-purple-400" /> 
          },
          { 
            title: "Next Class", 
            value: nextSession ? formatDate(nextSession.startTime) : "None", 
            icon: <FiClock size={24} className="text-yellow-400" /> 
          },
        ].map((card) => (
          <div key={card.title} className="p-5 bg-gray-700 rounded-lg">
            <div className="mb-2">{card.icon}</div>
            <h2 className="text-sm text-gray-400">{card.title}</h2>
            <p className="text-xl font-bold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-gray-700 p-5 rounded-lg">
        <h2 className="text-lg font-semibold mb-4">Completed Training Sessions</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={sessionHistory}>
              <defs>
                <linearGradient id="colorSessions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4F46E5" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Area 
                type="monotone" 
                dataKey="sessions" 
                stroke="#4F46E5" 
                fill="url(#colorSessions)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Upcoming Sessions Preview */}
      <div className="bg-gray-700 p-5 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Upcoming Sessions</h2>
          <button className="text-blue-400 text-sm hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {upcomingSessions.length > 0 ? (
            upcomingSessions.map((session) => (
              <div key={session.id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <div>
                  <h3 className="font-medium">{session.title}</h3>
                  <p className="text-sm text-gray-400">
                    {formatDate(session.startTime)} at {formatTime(session.startTime)}
                  </p>
                </div>
                <span className={`px-2 py-1 rounded text-xs ${
                  session.type === "PRACTICAL" 
                    ? "bg-green-900 text-green-300" 
                    : session.type === "THEORY"
                      ? "bg-blue-900 text-blue-300"
                      : "bg-yellow-900 text-yellow-300"
                }`}>
                  {session.type}
                </span>
              </div>
            ))
          ) : (
            <div className="p-3 bg-gray-800 rounded text-center text-gray-400">
              No upcoming sessions scheduled
            </div>
          )}
        </div>
      </div>
      
      {/* Recent Materials Preview */}
      <div className="bg-gray-700 p-5 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Recent Training Materials</h2>
          <button className="text-blue-400 text-sm hover:underline">View All</button>
        </div>
        
        <div className="space-y-3">
          {recentMaterials.length > 0 ? (
            recentMaterials.map((material) => (
              <div key={material.id} className="flex justify-between items-center p-3 bg-gray-800 rounded">
                <div className="flex items-center">
                  <span className="text-blue-500 mr-2">
                    <FiCalendar size={18} />
                  </span>
                  <div>
                    <h3 className="font-medium">{material.name}</h3>
                    <p className="text-sm text-gray-400">
                      Added on {formatDate(material.uploadDate)}
                    </p>
                  </div>
                </div>
                <button className="px-2 py-1 bg-blue-600 text-xs rounded hover:bg-blue-700">
                  Download
                </button>
              </div>
            ))
          ) : (
            <div className="p-3 bg-gray-800 rounded text-center text-gray-400">
              No recent materials available
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardSection;