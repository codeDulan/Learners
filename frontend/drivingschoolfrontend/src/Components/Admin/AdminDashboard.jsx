import React, { useState, useEffect } from 'react';
import { Box, Typography, useTheme, CircularProgress } from '@mui/material';
import { tokens } from '../../theme';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';
import axios from 'axios';

// API Base URL
const API_BASE_URL = "http://localhost:8080/api";

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // State for data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customers, setCustomers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);
  
  // State for UI options
  const [showTodayOnly, setShowTodayOnly] = useState(false);
  
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
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Fetch sessions first to debug
        console.log("Fetching sessions...");
        const sessionsResponse = await axios.get(
          `${API_BASE_URL}/staff/sessions`,
          getAuthHeaders()
        );
        console.log("Sessions API response:", sessionsResponse);
        
        // Check if the data is in the expected format
        const sessionsData = sessionsResponse.data || [];
        console.log("Actual session data structure:", sessionsData.length > 0 ? sessionsData[0] : "No sessions");
        setSessions(sessionsData);
        
        // Fetch customers
        const customersResponse = await axios.get(
          `${API_BASE_URL}/staff/customers`,
          getAuthHeaders()
        );
        setCustomers(customersResponse.data || []);
        
        // Fetch enrollments
        const enrollmentsResponse = await axios.get(
          `${API_BASE_URL}/staff/enrollments`,
          getAuthHeaders()
        );
        setEnrollments(enrollmentsResponse.data || []);
        
        // Fetch payments
        const paymentsResponse = await axios.get(
          `${API_BASE_URL}/staff/payments`,
          getAuthHeaders()
        );
        setPayments(paymentsResponse.data || []);
        
        // Fetch training programs
        const programsResponse = await axios.get(
          `${API_BASE_URL}/staff/training-programs`,
          getAuthHeaders()
        );
        setPrograms(programsResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load dashboard data: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);
  
  // Calculate total number of students
  const totalStudents = customers.length;
  
  // Calculate today's sessions
  const getTodaySessions = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      sessionDate.setHours(0, 0, 0, 0);
      return sessionDate.getTime() === today.getTime();
    });
  };
  
  const todaySessionsCount = getTodaySessions().length;
  
  // Calculate monthly revenue
  const calculateMonthlyRevenue = () => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    return payments
      .filter(payment => {
        const paymentDate = new Date(payment.paymentDate);
        return paymentDate.getMonth() === currentMonth && 
               paymentDate.getFullYear() === currentYear &&
               payment.status === "COMPLETED";
      })
      .reduce((total, payment) => total + payment.amount, 0);
  };
  
  const monthlyRevenue = calculateMonthlyRevenue();
  
  // Calculate completion rate
  const calculateCompletionRate = () => {
    if (sessions.length === 0) return 0;
    
    const completedSessions = sessions.filter(session => 
      session.status === "COMPLETED"
    ).length;
    
    return Math.round((completedSessions / sessions.length) * 100);
  };
  
  const completionRate = calculateCompletionRate();
  
  // Create revenue data for chart
  const getRevenueData = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const monthName = month.toLocaleString('default', { month: 'short' });
      
      const revenueInMonth = payments
        .filter(payment => {
          const paymentDate = new Date(payment.paymentDate);
          return paymentDate.getMonth() === month.getMonth() && 
                 paymentDate.getFullYear() === month.getFullYear() &&
                 payment.status === "COMPLETED";
        })
        .reduce((total, payment) => total + payment.amount, 0);
      
      months.push({
        name: monthName,
        revenue: revenueInMonth
      });
    }
    
    return months;
  };
  
  const revenueData = getRevenueData();
  
  // Get license type distribution
  const getLicenseTypeData = () => {
    if (enrollments.length === 0) return [];
    
    const licenseCounts = {};
    
    enrollments.forEach(enrollment => {
      const program = programs.find(p => p.id === enrollment.programId);
      if (program) {
        const licenseType = program.licenseType || "Unknown";
        licenseCounts[licenseType] = (licenseCounts[licenseType] || 0) + 1;
      }
    });
    
    const licenseColors = {
      "MOTORCYCLE": '#4cceac',
      "LIGHT_VEHICLE": '#6870fa',
      "HEAVY_VEHICLE": '#ff9f43',
      "Unknown": '#888888'
    };
    
    return Object.keys(licenseCounts).map(key => ({
      name: key.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase()),  // Format license type name
      value: licenseCounts[key],
      color: licenseColors[key] || '#888888'
    }));
  };
  
  const licenseTypeData = getLicenseTypeData();
  
  // Get upcoming sessions
  const getUpcomingSessions = () => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    // Filter upcoming sessions
    return sessions
      .filter(session => {
        const sessionDate = new Date(session.startTime);
        const sessionDayStart = new Date(sessionDate);
        sessionDayStart.setHours(0, 0, 0, 0);
        
        // Basic filter: future sessions that aren't cancelled
        const isUpcoming = sessionDate > now && session.status !== "CANCELLED";
        
        // Additional filter: only today's sessions if showTodayOnly is true
        if (showTodayOnly) {
          return isUpcoming && sessionDayStart.getTime() === today.getTime();
        }
        
        return isUpcoming;
      })
      .sort((a, b) => new Date(a.startTime) - new Date(b.startTime))
      .slice(0, 4) // Show top 4 sessions
      .map(session => {
        // Find customer name
        const enrollment = enrollments.find(e => e.id === session.enrollmentId);
        const customer = enrollment ? 
          customers.find(c => c.id === enrollment.customerId) : null;
        
        return {
          id: session.id,
          customer: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown",
          title: session.title,
          type: session.type || "Session",
          time: formatTime(session.startTime),
          date: formatDate(session.startTime)
        };
      });
  };
  
  // Re-calculate whenever showTodayOnly changes
  const upcomingSessionsData = getUpcomingSessions();
  
  // Get recent payments
  const getRecentPayments = () => {
    return payments
      .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))
      .slice(0, 3)
      .map(payment => {
        // Find customer name
        const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
        const customer = enrollment ? 
          customers.find(c => c.id === enrollment.customerId) : null;
        
        return {
          id: payment.id,
          customer: customer ? `${customer.firstName} ${customer.lastName}` : "Unknown",
          amount: payment.amount,
          date: formatDate(payment.paymentDate),
          status: payment.status
        };
      });
  };
  
  const recentPaymentsData = getRecentPayments();

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={4} bgcolor="error.main" color="error.contrastText" borderRadius={2}>
        <Typography variant="h6">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h2" fontWeight="bold" mb={4}>
        Dashboard
      </Typography>

      {/* Stat Cards */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={4}
        mb={4}
      >
        {/* Total Students */}
        <Box 
          gridColumn="span 3" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Box
            bgcolor={colors.greenAccent[600]}
            p={2}
            borderRadius="50%"
            mr={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FiUsers size={24} style={{ color: colors.primary[400] }} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Total Students
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {totalStudents}
            </Typography>
          </Box>
        </Box>

        {/* Today's Sessions */}
        <Box 
          gridColumn="span 3" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Box
            bgcolor={colors.blueAccent[600]}
            p={2}
            borderRadius="50%"
            mr={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FiCalendar size={24} style={{ color: colors.primary[400] }} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Today's Sessions
            </Typography>
            <Typography variant="h3" fontWeight="bold">
              {todaySessionsCount}
            </Typography>
          </Box>
        </Box>

        {/* Monthly Revenue */}
        <Box 
          gridColumn="span 3" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Box
            bgcolor={colors.redAccent[600]}
            p={2}
            borderRadius="50%"
            mr={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FiDollarSign size={24} style={{ color: colors.primary[400] }} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Monthly Revenue
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
              Rs.{monthlyRevenue}
            </Typography>
          </Box>
        </Box>

        {/* Completion Rate */}
        <Box 
          gridColumn="span 3" 
          backgroundColor={colors.primary[400]} 
          p={3} 
          borderRadius="10px"
          display="flex"
          alignItems="center"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Box
            bgcolor={colors.greenAccent[600]}
            p={2}
            borderRadius="50%"
            mr={2}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <FiCheckCircle size={24} style={{ color: colors.primary[400] }} />
          </Box>
          <Box>
            <Typography variant="h6" color={colors.grey[100]}>
              Completion Rate
            </Typography>
            <Typography variant="h3" fontWeight="bold" color={colors.greenAccent[500]}>
              {completionRate}%
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Charts */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={4}
        mb={4}
      >
        {/* Revenue Trend Chart */}
        <Box
          gridColumn="span 8"
          backgroundColor={colors.primary[400]}
          p={3}
          borderRadius="10px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" fontWeight="600" mb={2}>
            Revenue Trend
          </Typography>
          <Box height="300px">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={revenueData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={colors.greenAccent[500]} stopOpacity={0.8} />
                    <stop offset="95%" stopColor={colors.greenAccent[500]} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="name" 
                  stroke={colors.grey[100]}
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke={colors.grey[100]}
                  style={{ fontSize: '12px' }}
                  tickFormatter={(v) => `Rs.${v}`}
                />
                <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
                <Tooltip 
                  formatter={(value) => [`$${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: colors.primary[500],
                    borderColor: colors.grey[800],
                    color: colors.grey[100]
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke={colors.greenAccent[500]} 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Box>
        </Box>

        {/* Distribution by License Type */}
        <Box
          gridColumn="span 4"
          backgroundColor={colors.primary[400]}
          p={3}
          borderRadius="10px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" fontWeight="600" mb={2}>
            Students by License Type
          </Typography>
          <Box height="300px" display="flex" alignItems="center" justifyContent="center">
            {licenseTypeData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={licenseTypeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {licenseTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}`, 'Students']}
                    contentStyle={{
                      backgroundColor: colors.primary[500],
                      borderColor: colors.grey[800],
                      color: colors.grey[100]
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <Typography color={colors.grey[300]}>No license data available</Typography>
            )}
          </Box>
        </Box>
      </Box>

      {/* Upcoming Sessions and Recent Payments */}
      <Box
        display="grid"
        gridTemplateColumns="repeat(12, 1fr)"
        gap={4}
      >
        {/* Upcoming Sessions */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          p={3}
          borderRadius="10px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" fontWeight="600" mb={2}>
            Upcoming Sessions
          </Typography>
          
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box 
              component="label" 
              display="flex" 
              alignItems="center" 
              gap={1}
              sx={{ cursor: 'pointer' }}
            >
              <input 
                type="checkbox" 
                checked={showTodayOnly} 
                onChange={() => setShowTodayOnly(!showTodayOnly)}
              />
              <Typography variant="body2" color={colors.grey[300]}>
                Show today's sessions only
              </Typography>
            </Box>
            <Typography variant="caption" color={colors.grey[400]}>
              {showTodayOnly ? "Showing today only" : "Showing all upcoming"}
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
            {upcomingSessionsData.length > 0 ? (
              upcomingSessionsData.map((session) => (
                <Box 
                  key={session.id}
                  p={2}
                  backgroundColor={colors.primary[500]}
                  borderRadius="4px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  boxShadow="0 2px 5px rgba(0,0,0,0.08)"
                >
                  <Box display="flex" alignItems="center">
                    <Box
                      backgroundColor={
                        session.type === "TEST" 
                          ? colors.redAccent[500] 
                          : session.type === "THEORY"
                            ? colors.blueAccent[500]
                            : colors.greenAccent[500]
                      }
                      p={1}
                      borderRadius="50%"
                      mr={2}
                      display="flex"
                      justifyContent="center"
                      alignItems="center"
                    >
                      <FiClock size={16} style={{ color: colors.primary[400] }} />
                    </Box>
                    <Box>
                      <Typography variant="body1" fontWeight="bold">
                        {session.title || "Scheduled Session"}
                      </Typography>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2" color={colors.grey[300]}>
                          {session.type}
                        </Typography>
                        <Typography variant="caption" color={colors.grey[400]}>
                          {session.date}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                  <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.blueAccent[300] }}>
                    {session.time}
                  </Typography>
                </Box>
              ))
            ) : (
              <Box 
                p={2}
                backgroundColor={colors.primary[500]}
                borderRadius="4px"
                textAlign="center"
              >
                <Typography color={colors.grey[300]}>
                  No upcoming sessions
                </Typography>
              </Box>
            )}
          </Box>
        </Box>

        {/* Recent Payments */}
        <Box
          gridColumn="span 6"
          backgroundColor={colors.primary[400]}
          p={3}
          borderRadius="10px"
          boxShadow="0 4px 10px rgba(0, 0, 0, 0.1)"
        >
          <Typography variant="h5" fontWeight="600" mb={3}>
            Recent Payments
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
            {recentPaymentsData.length > 0 ? (
              recentPaymentsData.map((payment) => (
                <Box 
                  key={payment.id}
                  p={2}
                  backgroundColor={colors.primary[500]}
                  borderRadius="4px"
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                  boxShadow="0 2px 5px rgba(0,0,0,0.08)"
                >
                  <Box>
                    <Typography variant="body1" fontWeight="bold">
                      {payment.customer}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      {payment.date}
                    </Typography>
                  </Box>
                  <Box display="flex" alignItems="center">
                    <Typography 
                      variant="body1" 
                      fontWeight="bold" 
                      color={colors.greenAccent[400]}
                      mr={2}
                    >
                      Rs.{payment.amount}
                    </Typography>
                    <Box 
                      px={1.5}
                      py={0.5}
                      borderRadius="4px"
                      backgroundColor={
                        payment.status === "COMPLETED"
                          ? colors.greenAccent[600]
                          : colors.redAccent[600]
                      }
                    >
                      <Typography variant="body2" color="#ffffff">
                        {payment.status}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              ))
            ) : (
              <Box 
                p={2}
                backgroundColor={colors.primary[500]}
                borderRadius="4px"
                textAlign="center"
              >
                <Typography color={colors.grey[300]}>
                  No recent payments
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;