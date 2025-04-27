import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('authToken') || localStorage.getItem('token');
  return {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  };
};

// Fetch all data needed for reports
export const fetchReportData = async () => {
  try {
    // Fetch customers
    const customersResponse = await axios.get(
      `${API_BASE_URL}/customers`,
      getAuthHeaders()
    );
    
    // Fetch enrollments
    const enrollmentsResponse = await axios.get(
      `${API_BASE_URL}/staff/enrollments`,
      getAuthHeaders()
    );
    
    // Fetch payments
    const paymentsResponse = await axios.get(
      `${API_BASE_URL}/staff/payments`,
      getAuthHeaders()
    );
    
    // Fetch sessions
    const sessionsResponse = await axios.get(
      `${API_BASE_URL}/staff/sessions`,
      getAuthHeaders()
    );
    
    // Fetch training programs
    const programsResponse = await axios.get(
      `${API_BASE_URL}/staff/training-programs`,
      getAuthHeaders()
    );
    
    return {
      customers: customersResponse.data || [],
      enrollments: enrollmentsResponse.data || [],
      payments: paymentsResponse.data || [],
      sessions: sessionsResponse.data || [],
      programs: programsResponse.data || []
    };
  } catch (error) {
    console.error("Error fetching report data:", error);
    throw error;
  }
};

// Export report data to CSV
export const exportReportToCsv = (reportType, data) => {
  let csvContent = "data:text/csv;charset=utf-8,";
  
  // Add headers and format based on report type
  if (reportType === 'revenue') {
    csvContent += "Month,Revenue\n";
    // Add data rows
    data.forEach(item => {
      csvContent += `${item.month},${item.revenue}\n`;
    });
  } else if (reportType === 'enrollments') {
    csvContent += "Program,Enrollments\n";
    // Add data rows
    data.forEach(item => {
      csvContent += `${item.program},${item.enrollments}\n`;
    });
  } else if (reportType === 'sessions') {
    csvContent += "Status,Count\n";
    // Add data rows for status
    data.byStatus.forEach(item => {
      csvContent += `${item.status},${item.count}\n`;
    });
    csvContent += "\nType,Count\n";
    // Add data rows for type
    data.byType.forEach(item => {
      csvContent += `${item.type},${item.count}\n`;
    });
  } else if (reportType === 'customers') {
    csvContent += "Age Group,Count\n";
    // Add data rows
    data.forEach(item => {
      csvContent += `${item.ageGroup},${item.count}\n`;
    });
  }
  
  // Create a download link
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${reportType}_report_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

// Process revenue data
export const processRevenueData = (payments, enrollments, programs, dateRange, licenseType) => {
  const start = dateRange.startDate;
  const end = dateRange.endDate;
  
  // Filter payments by date range and license type if specified
  const filteredPayments = payments.filter(payment => {
    const paymentDate = new Date(payment.paymentDate);
    const isInDateRange = paymentDate >= start && paymentDate <= end;
    
    if (licenseType === 'all') return isInDateRange;
    
    // Filter by license type
    const enrollment = enrollments.find(e => e.id === payment.enrollmentId);
    if (!enrollment) return false;
    
    const program = programs.find(p => p.id === enrollment.programId);
    if (!program) return false;
    
    return isInDateRange && program.licenseType === licenseType;
  });
  
  // Group payments by month
  const monthlyRevenue = {};
  filteredPayments.forEach(payment => {
    const date = new Date(payment.paymentDate);
    const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
    
    if (!monthlyRevenue[monthYear]) {
      monthlyRevenue[monthYear] = 0;
    }
    
    if (payment.status === "COMPLETED") {
      monthlyRevenue[monthYear] += payment.amount;
    }
  });
  
  // Convert to array for chart
  const data = Object.keys(monthlyRevenue).map(month => ({
    month,
    revenue: monthlyRevenue[month]
  }));
  
  // Sort by date
  data.sort((a, b) => {
    const dateA = new Date(a.month);
    const dateB = new Date(b.month);
    return dateA - dateB;
  });
  
  return data;
};

// Process enrollment data
export const processEnrollmentData = (enrollments, programs, dateRange, licenseType) => {
  const start = dateRange.startDate;
  const end = dateRange.endDate;
  
  // Filter enrollments by date range
  const filteredEnrollments = enrollments.filter(enrollment => {
    const enrollmentDate = new Date(enrollment.enrollmentDate);
    return enrollmentDate >= start && enrollmentDate <= end;
  });
  
  // Group enrollments by program type
  const enrollmentsByProgram = {};
  filteredEnrollments.forEach(enrollment => {
    const program = programs.find(p => p.id === enrollment.programId);
    if (!program) return;
    
    if (licenseType !== 'all' && program.licenseType !== licenseType) return;
    
    const programName = program.name;
    
    if (!enrollmentsByProgram[programName]) {
      enrollmentsByProgram[programName] = 0;
    }
    
    enrollmentsByProgram[programName]++;
  });
  
  // Convert to array for chart
  const data = Object.keys(enrollmentsByProgram).map(program => ({
    program,
    enrollments: enrollmentsByProgram[program]
  }));
  
  // Sort by enrollment count
  data.sort((a, b) => b.enrollments - a.enrollments);
  
  return data;
};

// Process sessions data
export const processSessionsData = (sessions, dateRange) => {
  const start = dateRange.startDate;
  const end = dateRange.endDate;
  
  // Filter sessions by date range
  const filteredSessions = sessions.filter(session => {
    const sessionDate = new Date(session.startTime);
    return sessionDate >= start && sessionDate <= end;
  });
  
  // Group sessions by status
  const sessionsByStatus = {
    SCHEDULED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
    NO_SHOW: 0
  };
  
  // Group sessions by type
  const sessionsByType = {
    PRACTICAL: 0,
    THEORY: 0,
    TEST: 0
  };
  
  filteredSessions.forEach(session => {
    // Count by status
    if (sessionsByStatus.hasOwnProperty(session.status)) {
      sessionsByStatus[session.status]++;
    }
    
    // Count by type
    if (sessionsByType.hasOwnProperty(session.type)) {
      sessionsByType[session.type]++;
    }
  });
  
  // Convert to array for chart
  const statusData = Object.keys(sessionsByStatus).map(status => ({
    status,
    count: sessionsByStatus[status]
  }));
  
  const typeData = Object.keys(sessionsByType).map(type => ({
    type,
    count: sessionsByType[type]
  }));
  
  return {
    byStatus: statusData,
    byType: typeData
  };
};

// Process customer demographics
export const processCustomerDemographics = (customers) => {
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
  const data = Object.keys(ageGroups).map(group => ({
    ageGroup: group,
    count: ageGroups[group]
  }));
  
  return data;
};