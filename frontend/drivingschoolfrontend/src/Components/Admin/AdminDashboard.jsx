import React from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { tokens } from '../../theme';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { FiUsers, FiCalendar, FiDollarSign, FiClock, FiCheckCircle } from 'react-icons/fi';

// Sample data - replace with actual data from your backend
const revenueData = [
  { name: "Jan", revenue: 5000 },
  { name: "Feb", revenue: 6000 },
  { name: "Mar", revenue: 8000 },
  { name: "Apr", revenue: 7500 },
  { name: "May", revenue: 9000 },
  { name: "Jun", revenue: 11000 },
];

const licenseTypeData = [
  { name: 'Motorcycle', value: 30, color: '#4cceac' },
  { name: 'Light Vehicle', value: 40, color: '#6870fa' },
  { name: 'Heavy Vehicle', value: 30, color: '#ff9f43' },
];

const upcomingSessionsData = [
  { id: 1, customer: 'John Doe', type: 'Driving Practice', time: '10:00 AM', date: '2025-04-25' },
  { id: 2, customer: 'Jane Smith', type: 'Theory Lesson', time: '01:30 PM', date: '2025-04-25' },
  { id: 3, customer: 'Mike Johnson', type: 'Driving Test', time: '11:00 AM', date: '2025-04-26' },
  { id: 4, customer: 'Sarah Williams', type: 'Driving Practice', time: '03:00 PM', date: '2025-04-27' },
];

const recentPaymentsData = [
  { id: 1, customer: 'John Doe', amount: 250, date: '2025-04-22', status: 'Completed' },
  { id: 2, customer: 'Jane Smith', amount: 300, date: '2025-04-21', status: 'Completed' },
  { id: 3, customer: 'Mike Johnson', amount: 150, date: '2025-04-20', status: 'Pending' },
];

const AdminDashboard = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);

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
              154
            </Typography>
          </Box>
        </Box>

        {/* Upcoming Sessions */}
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
              8
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
              $11,000
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
              85%
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
                  tickFormatter={(v) => `$${v}`}
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
                  formatter={(value) => [`${value}%`, 'Students']}
                  contentStyle={{
                    backgroundColor: colors.primary[500],
                    borderColor: colors.grey[800],
                    color: colors.grey[100]
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
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
          <Typography variant="h5" fontWeight="600" mb={3}>
            Today's Upcoming Sessions
          </Typography>
          
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, maxHeight: '300px', overflowY: 'auto', pr: 1 }}>
            {upcomingSessionsData.map((session) => (
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
                      session.type === "Driving Test" 
                        ? colors.redAccent[500] 
                        : session.type === "Theory Lesson"
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
                      {session.customer}
                    </Typography>
                    <Typography variant="body2" color={colors.grey[300]}>
                      {session.type}
                    </Typography>
                  </Box>
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 'medium', color: colors.blueAccent[300] }}>
                  {session.time}
                </Typography>
              </Box>
            ))}
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
            {recentPaymentsData.map((payment) => (
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
                    ${payment.amount}
                  </Typography>
                  <Box 
                    px={1.5}
                    py={0.5}
                    borderRadius="4px"
                    backgroundColor={
                      payment.status === "Completed"
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
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default AdminDashboard;