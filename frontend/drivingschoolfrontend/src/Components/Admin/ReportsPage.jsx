import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, useTheme, Grid, Card, CardContent, 
         CircularProgress, Button, Select, MenuItem, FormControl, 
         InputLabel, Stack } from '@mui/material';
import { tokens } from '../../theme';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
         ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiDownload, FiRefreshCw, FiBarChart2, FiUsers, 
         FiDollarSign, FiCalendar, FiPrinter } from 'react-icons/fi';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

const ReportsPage = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  
  // Refs for the printable sections
  const revenueReportRef = useRef(null);
  const enrollmentReportRef = useRef(null);
  const sessionsReportRef = useRef(null);
  const customerReportRef = useRef(null);
  
  // Data loading states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for data
  const [customers, setCustomers] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [payments, setPayments] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [programs, setPrograms] = useState([]);

  // Filter state
  const [timeFrame, setTimeFrame] = useState('month');
  
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
  
  // Format currency
  const formatCurrency = (value) => {
    return `Rs.${value.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      
      try {
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
        
        // Fetch sessions
        const sessionsResponse = await axios.get(
          `${API_BASE_URL}/staff/sessions`,
          getAuthHeaders()
        );
        setSessions(sessionsResponse.data || []);
        
        // Fetch training programs
        const programsResponse = await axios.get(
          `${API_BASE_URL}/staff/training-programs`,
          getAuthHeaders()
        );
        setPrograms(programsResponse.data || []);
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(`Failed to load report data: ${err.message}`);
        setLoading(false);
      }
    };
    
    fetchAllData();
  }, []);

  // Get revenue data
  const getRevenueData = () => {
    // Set date filters based on timeframe
    const now = new Date();
    let startDate;
    
    if (timeFrame === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else if (timeFrame === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else { // week
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek;
    }
    
    // Group by month for month and year, by day for week
    const groupByFormat = timeFrame === 'week' ? 'day' : 'month';
    
    // Filter payments by date
    const filteredPayments = payments.filter(payment => {
      const paymentDate = new Date(payment.paymentDate);
      return paymentDate >= startDate && payment.status === "COMPLETED";
    });
    
    // Group payments
    const groupedRevenue = {};
    
    filteredPayments.forEach(payment => {
      const date = new Date(payment.paymentDate);
      let key;
      
      if (groupByFormat === 'month') {
        key = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      } else {
        key = date.toLocaleDateString();
      }
      
      if (!groupedRevenue[key]) {
        groupedRevenue[key] = 0;
      }
      
      groupedRevenue[key] += payment.amount;
    });
    
    // Convert to array for chart
    let data = Object.keys(groupedRevenue).map(key => ({
      label: key,
      value: groupedRevenue[key]
    }));
    
    // Sort chronologically
    data.sort((a, b) => {
      // Simple string comparison works for our format
      return a.label.localeCompare(b.label);
    });
    
    // Calculate totals
    const totalRevenue = filteredPayments.reduce((sum, payment) => sum + payment.amount, 0);
    const avgRevenue = data.length > 0 ? totalRevenue / data.length : 0;
    
    return {
      chartData: data,
      totalRevenue,
      avgRevenue,
      periodLabel: timeFrame === 'month' ? 'Monthly' : timeFrame === 'year' ? 'Yearly' : 'Weekly'
    };
  };

  // Get enrollment data
  const getEnrollmentData = () => {
    // Set date filters based on timeframe
    const now = new Date();
    let startDate;
    
    if (timeFrame === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else if (timeFrame === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else { // week
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek;
    }
    
    // Filter enrollments by date
    const filteredEnrollments = enrollments.filter(enrollment => {
      const enrollmentDate = new Date(enrollment.enrollmentDate);
      return enrollmentDate >= startDate;
    });
    
    // Group by program type
    const enrollmentsByProgram = {};
    
    filteredEnrollments.forEach(enrollment => {
      const program = programs.find(p => p.id === enrollment.programId);
      if (!program) return;
      
      const programName = program.name;
      
      if (!enrollmentsByProgram[programName]) {
        enrollmentsByProgram[programName] = 0;
      }
      
      enrollmentsByProgram[programName]++;
    });
    
    // Convert to array for chart
    const data = Object.keys(enrollmentsByProgram).map(program => ({
      name: program,
      value: enrollmentsByProgram[program]
    }));
    
    // Sort by count
    data.sort((a, b) => b.value - a.value);
    
    // Calculate totals
    const totalEnrollments = filteredEnrollments.length;
    const topProgram = data.length > 0 ? data[0].name : 'None';
    
    return {
      chartData: data,
      totalEnrollments,
      topProgram
    };
  };

  // Get session data
  const getSessionData = () => {
    // Set date filters based on timeframe
    const now = new Date();
    let startDate;
    
    if (timeFrame === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else if (timeFrame === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else { // week
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek;
    }
    
    // Filter sessions by date
    const filteredSessions = sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      return sessionDate >= startDate;
    });
    
    // Group by status
    const sessionsByStatus = {
      COMPLETED: 0,
      SCHEDULED: 0,
      CANCELLED: 0,
      NO_SHOW: 0
    };
    
    filteredSessions.forEach(session => {
      if (sessionsByStatus.hasOwnProperty(session.status)) {
        sessionsByStatus[session.status]++;
      }
    });
    
    // Convert to array for chart
    const statusData = Object.keys(sessionsByStatus).map(status => ({
      name: status,
      value: sessionsByStatus[status]
    }));
    
    // Calculate totals and rates
    const totalSessions = filteredSessions.length;
    const completedSessions = sessionsByStatus.COMPLETED || 0;
    const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
    
    return {
      chartData: statusData,
      totalSessions,
      completedSessions,
      completionRate
    };
  };

  // Get customer data
  const getCustomerData = () => {
    // Set date filters based on timeframe
    const now = new Date();
    let startDate;
    
    if (timeFrame === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    } else if (timeFrame === 'year') {
      startDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
    } else { // week
      const lastWeek = new Date(now);
      lastWeek.setDate(now.getDate() - 7);
      startDate = lastWeek;
    }
    
    // Filter new customers by registration date
    const newCustomers = customers.filter(customer => {
      const registrationDate = new Date(customer.registrationDate || customer.createdAt);
      return registrationDate >= startDate;
    });
    
    // Group customers by age group
    const ageGroups = {
      "18-24": 0,
      "25-34": 0,
      "35-44": 0,
      "45+": 0
    };
    
    customers.forEach(customer => {
      if (!customer.dateOfBirth) return;
      
      const dob = new Date(customer.dateOfBirth);
      const age = new Date().getFullYear() - dob.getFullYear();
      
      if (age < 18) return;
      if (age <= 24) ageGroups["18-24"]++;
      else if (age <= 34) ageGroups["25-34"]++;
      else if (age <= 44) ageGroups["35-44"]++;
      else ageGroups["45+"]++;
    });
    
    // Convert to array for chart
    const ageData = Object.keys(ageGroups).map(group => ({
      name: group,
      value: ageGroups[group]
    }));
    
    return {
      totalCustomers: customers.length,
      newCustomers: newCustomers.length,
      ageData
    };
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = (reportType) => {
    let csvContent = "data:text/csv;charset=utf-8,";
    let fileName = "";
    
    // Select data based on report type
    if (reportType === 'revenue') {
      const { chartData } = getRevenueData();
      csvContent += "Period,Revenue\n";
      chartData.forEach(item => {
        csvContent += `${item.label},${item.value}\n`;
      });
      fileName = "revenue_report";
    } 
    else if (reportType === 'enrollments') {
      const { chartData } = getEnrollmentData();
      csvContent += "Program,Enrollments\n";
      chartData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      fileName = "enrollment_report";
    }
    else if (reportType === 'sessions') {
      const { chartData } = getSessionData();
      csvContent += "Status,Count\n";
      chartData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      fileName = "session_report";
    }
    else if (reportType === 'customers') {
      const { ageData } = getCustomerData();
      csvContent += "Age Group,Count\n";
      ageData.forEach(item => {
        csvContent += `${item.name},${item.value}\n`;
      });
      fileName = "customer_report";
    }
    
    // Create a download link
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${fileName}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Print report function
  const printReport = (reportRef, title) => {
    if (!reportRef.current) return;
    
    const printWindow = window.open('', '_blank');
    
    if (!printWindow) {
      alert("Please allow pop-ups to print reports");
      return;
    }
    
    const reportContent = reportRef.current.innerHTML;
    const currentDate = new Date().toLocaleDateString();
    
    // Create print document with better styling
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${title} - ${currentDate}</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              padding: 20px;
              color: #333;
            }
            .report-header {
              text-align: center;
              margin-bottom: 20px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ccc;
            }
            .report-title {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .report-date {
              font-size: 14px;
              color: #666;
            }
            .stats-container {
              display: flex;
              justify-content: space-around;
              margin-bottom: 20px;
              flex-wrap: wrap;
            }
            .stat-box {
              padding: 15px;
              background-color: #f5f5f5;
              border-radius: 5px;
              margin: 10px;
              min-width: 150px;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            .stat-label {
              font-size: 12px;
              color: #666;
              margin-bottom: 5px;
            }
            .stat-value {
              font-size: 20px;
              font-weight: bold;
              color: #2a3f54;
            }
            .chart-container {
              width: 100%;
              margin-top: 20px;
              page-break-inside: avoid;
            }
            @media print {
              body {
                padding: 0;
                margin: 0;
              }
            }
          </style>
        </head>
        <body>
          <div class="report-header">
            <div class="report-title">${title}</div>
            <div class="report-date">Generated on ${currentDate}</div>
          </div>
          <div class="report-content">
            ${reportContent}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() { window.close(); }, 500);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
  };

  // Get report data based on current filters
  const revenueData = loading ? null : getRevenueData();
  const enrollmentData = loading ? null : getEnrollmentData();
  const sessionData = loading ? null : getSessionData();
  const customerData = loading ? null : getCustomerData();
  
  // Define chart colors
  const COLORS = [
    colors.greenAccent[500], 
    colors.blueAccent[500], 
    colors.redAccent[500],
    colors.greenAccent[300],
    colors.blueAccent[300],
    colors.redAccent[300]
  ];

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
        <Button 
          variant="contained" 
          color="secondary" 
          startIcon={<FiRefreshCw />} 
          sx={{ mt: 2 }}
          onClick={handleRefresh}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h2" fontWeight="bold">
          Reports
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <FormControl sx={{ minWidth: 150 }}>
            <InputLabel>Time Frame</InputLabel>
            <Select
              value={timeFrame}
              label="Time Frame"
              onChange={(e) => setTimeFrame(e.target.value)}
              size="small"
            >
              <MenuItem value="week">Last 7 Days</MenuItem>
              <MenuItem value="month">Last 6 Months</MenuItem>
              <MenuItem value="year">Last Year</MenuItem>
            </Select>
          </FormControl>
          
          <Button 
            variant="outlined"
            startIcon={<FiRefreshCw />}
            onClick={handleRefresh}
          >
            Refresh
          </Button>
        </Box>
      </Box>

      <Grid container spacing={3} direction="column">
        {/* Revenue Report Card */}
        <Grid item xs={12}>
          <Card sx={{ 
            backgroundColor: colors.primary[400],
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <FiDollarSign 
                    size={24} 
                    style={{ 
                      color: colors.greenAccent[500],
                      marginRight: '10px'
                    }} 
                  />
                  <Typography variant="h5" fontWeight="600">
                    Revenue Report
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small"
                    startIcon={<FiPrinter />}
                    onClick={() => printReport(revenueReportRef, "Revenue Report")}
                  >
                    Print
                  </Button>
                  <Button 
                    size="small"
                    startIcon={<FiDownload />}
                    onClick={() => handleExport('revenue')}
                  >
                    Export CSV
                  </Button>
                </Stack>
              </Box>
              
              <div ref={revenueReportRef}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Total {revenueData.periodLabel} Revenue
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                        {formatCurrency(revenueData.totalRevenue)}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Average {revenueData.periodLabel} Revenue
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                        {formatCurrency(revenueData.avgRevenue)}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box height={300}>
                  {revenueData.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
                        <XAxis 
                          dataKey="label" 
                          stroke={colors.grey[100]}
                          style={{ fontSize: '12px' }}
                          angle={-45}
                          textAnchor="end"
                          height={80}
                        />
                        <YAxis 
                          stroke={colors.grey[100]}
                          style={{ fontSize: '12px' }}
                          tickFormatter={(value) => `Rs.${value}`}
                        />
                        <Tooltip
                          formatter={(value) => [formatCurrency(value), 'Revenue']}
                          contentStyle={{
                            backgroundColor: colors.primary[500],
                            borderColor: colors.grey[800],
                            color: colors.grey[100]
                          }}
                        />
                        <Bar 
                          dataKey="value" 
                          fill={colors.greenAccent[500]} 
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box 
                      height="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      sx={{ backgroundColor: colors.primary[500], borderRadius: '4px' }}
                    >
                      <Typography color={colors.grey[300]}>
                        No revenue data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Enrollments Report Card */}
        <Grid item xs={12}>
          <Card sx={{ 
            backgroundColor: colors.primary[400],
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <FiUsers 
                    size={24} 
                    style={{ 
                      color: colors.blueAccent[500],
                      marginRight: '10px'
                    }} 
                  />
                  <Typography variant="h5" fontWeight="600">
                    Enrollment Report
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small"
                    startIcon={<FiPrinter />}
                    onClick={() => printReport(enrollmentReportRef, "Enrollment Report")}
                  >
                    Print
                  </Button>
                  <Button 
                    size="small"
                    startIcon={<FiDownload />}
                    onClick={() => handleExport('enrollments')}
                  >
                    Export CSV
                  </Button>
                </Stack>
              </Box>
              
              <div ref={enrollmentReportRef}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Total Enrollments
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.blueAccent[500]}>
                        {enrollmentData.totalEnrollments}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Top Program
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color={colors.blueAccent[500]} sx={{ wordBreak: 'break-word' }}>
                        {enrollmentData.topProgram}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box height={300}>
                  {enrollmentData.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={enrollmentData.chartData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name.length > 10 ? name.substring(0, 10) + '...' : name} (${(percent * 100).toFixed(0)}%)`}
                          labelLine={false}
                        >
                          {enrollmentData.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          contentStyle={{
                            backgroundColor: colors.primary[500],
                            borderColor: colors.grey[800],
                            color: colors.grey[100]
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box 
                      height="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      sx={{ backgroundColor: colors.primary[500], borderRadius: '4px' }}
                    >
                      <Typography color={colors.grey[300]}>
                        No enrollment data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Sessions Report Card */}
        <Grid item xs={12}>
          <Card sx={{ 
            backgroundColor: colors.primary[400],
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <FiCalendar 
                    size={24} 
                    style={{ 
                      color: colors.redAccent[500],
                      marginRight: '10px'
                    }} 
                  />
                  <Typography variant="h5" fontWeight="600">
                    Sessions Report
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small"
                    startIcon={<FiPrinter />}
                    onClick={() => printReport(sessionsReportRef, "Sessions Report")}
                  >
                    Print
                  </Button>
                  <Button 
                    size="small"
                    startIcon={<FiDownload />}
                    onClick={() => handleExport('sessions')}
                  >
                    Export CSV
                  </Button>
                </Stack>
              </Box>
              
              <div ref={sessionsReportRef}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={4}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Total Sessions
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                        {sessionData.totalSessions}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Completed
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                        {sessionData.completedSessions}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={4}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Completion Rate
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                        {sessionData.completionRate}%
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box height={300}>
                  {sessionData.chartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sessionData.chartData}
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          dataKey="value"
                          nameKey="name"
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                        >
                          {sessionData.chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value, name) => [value, name]}
                          contentStyle={{
                            backgroundColor: colors.primary[500],
                            borderColor: colors.grey[800],
                            color: colors.grey[100]
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box 
                      height="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      sx={{ backgroundColor: colors.primary[500], borderRadius: '4px' }}
                    >
                      <Typography color={colors.grey[300]}>
                        No session data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Customer Report Card */}
        <Grid item xs={12}>
          <Card sx={{ 
            backgroundColor: colors.primary[400],
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)"
          }}>
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center">
                  <FiBarChart2
                    size={24} 
                    style={{ 
                      color: colors.grey[100],
                      marginRight: '10px'
                    }} 
                  />
                  <Typography variant="h5" fontWeight="600">
                    Customer Report
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                  <Button 
                    size="small"
                    startIcon={<FiPrinter />}
                    onClick={() => printReport(customerReportRef, "Customer Report")}
                  >
                    Print
                  </Button>
                  <Button 
                    size="small"
                    startIcon={<FiDownload />}
                    onClick={() => handleExport('customers')}
                  >
                    Export CSV
                  </Button>
                </Stack>
              </Box>
              
              <div ref={customerReportRef}>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        Total Customers
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.grey[100]}>
                        {customerData.totalCustomers}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box 
                      p={2} 
                      bgcolor={colors.primary[500]}
                      borderRadius="4px"
                    >
                      <Typography variant="body2" color={colors.grey[300]}>
                        New Customers
                      </Typography>
                      <Typography variant="h4" fontWeight="bold" color={colors.greenAccent[500]}>
                        {customerData.newCustomers}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
                
                <Box height={300}>
                  {customerData.ageData.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={customerData.ageData}>
                        <CartesianGrid strokeDasharray="3 3" stroke={colors.grey[800]} />
                        <XAxis dataKey="name" stroke={colors.grey[100]} />
                        <YAxis stroke={colors.grey[100]} />
                        <Tooltip
                          formatter={(value, name, props) => [value, 'Customers']}
                          contentStyle={{
                            backgroundColor: colors.primary[500],
                            borderColor: colors.grey[800],
                            color: colors.grey[100]
                          }}
                        />
                        <Bar dataKey="value" fill={colors.blueAccent[500]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <Box 
                      height="100%" 
                      display="flex" 
                      alignItems="center" 
                      justifyContent="center"
                      sx={{ backgroundColor: colors.primary[500], borderRadius: '4px' }}
                    >
                      <Typography color={colors.grey[300]}>
                        No customer demographic data available
                      </Typography>
                    </Box>
                  )}
                </Box>
              </div>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ReportsPage;