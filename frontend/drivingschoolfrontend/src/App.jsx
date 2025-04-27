import React from 'react';
import LandingPage from './Pages/LandingPage';
import Login from './Components/Login/Login';
import CustomerRegister from './Components/Registration/CustomerRegister';
import CustomerDashboard from './Components/Customer/CustomerDashboard';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import ProtectedRoute from './Components/ProtectedRoute';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import admin components
import AdminLayout from "./Components/Admin/AdminLayout";
import AdminDashboard from "./Components/Admin/AdminDashboard";
import CustomersPage from "./Components/Admin/CustomersPage";
import SessionsPage from "./Components/Admin/SessionsPage";
import PaymentsPage from "./Components/Admin/PaymentsPage";
import DocumentsPage from "./Components/Admin/DocumentsPage";
import TrainingPage from "./Components/Admin/TrainingPage";
import SettingsPage from "./Components/Admin/SettingsPage";
import EnrollmentsPage from "./Components/Admin/EnrollmentsPage";
import FeedbackPage from './Components/Admin/FeedbackPage';
import ReportsPage from './Components/Admin/ReportsPage'; // Add this line

const App = () => {
  return (
    <BrowserRouter>
      <div>
        <ToastContainer />
        <Routes>
          <Route index element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/customer/register" element={<CustomerRegister />} />

          {/* Protected Routes */}
          <Route path="/customer/dashboard" element={
            <ProtectedRoute>
              <CustomerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/staff" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="customers" element={<CustomersPage />} />
            <Route path="sessions" element={<SessionsPage />} />
            <Route path="training" element={<TrainingPage />} />
            <Route path="enrollments" element={<EnrollmentsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="documents" element={<DocumentsPage />} />
            <Route path="reports" element={<ReportsPage />} /> {/* Add this line */}
            <Route path="settings" element={<SettingsPage />} />
            <Route path="feedback" element={<FeedbackPage />} />
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;