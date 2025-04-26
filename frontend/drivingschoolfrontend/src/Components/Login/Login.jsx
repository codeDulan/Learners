import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEnvelope, FaLock } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [userType, setUserType] = useState('customer'); // 'customer' or 'staff'
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginUrl = userType === 'staff' 
        ? 'http://localhost:8080/api/staff/auth/login' 
        : 'http://localhost:8080/api/customers/auth/login';

      const response = await axios.post(loginUrl, {
        email,
        password
      });

      // Store token in localStorage
      localStorage.setItem('authToken', response.data.token);
      localStorage.setItem('userType', userType); // Store user type for later use
      
      // Redirect based on user type
      if (userType === 'staff') {
        navigate('/staff/dashboard');
      } else {
        navigate('/customer/dashboard');
      }

      toast.success('Login successful!');

    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      {/* Left Side - Gradient Background */}
      <div className="w-full md:w-1/2 h-1/3 md:h-full bg-gradient-to-br from-[#003366] to-[#002244] flex flex-col justify-center items-center p-10">
        <h1 className="text-4xl md:text-5xl text-white font-bold text-center">Drive Your Dreams Forward</h1>
        <p className="text-lg text-white mt-2">Login to Tharuka Driving School!</p>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 h-2/3 md:h-full bg-[#f5f5f5] flex flex-col justify-center items-center px-8 sm:px-16 md:px-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <h3 className="text-3xl text-[#060606] font-semibold mb-2">Login</h3>
          <p className="text-base mb-6">Welcome Back! Please enter your details.</p>

          {/* User Type Toggle */}
          <div className="flex items-center justify-center mb-6">
            <div className="flex items-center bg-gray-200 rounded-full p-1">
              <button
                type="button"
                className={`px-4 py-2 rounded-full transition-colors ${userType === 'customer' ? 'bg-[#003366] text-white' : 'text-gray-700'}`}
                onClick={() => setUserType('customer')}
              >
                Customer
              </button>
              <button
                type="button"
                className={`px-4 py-2 rounded-full transition-colors ${userType === 'staff' ? 'bg-[#003366] text-white' : 'text-gray-700'}`}
                onClick={() => setUserType('staff')}
              >
                Staff
              </button>
            </div>
          </div>

          <form onSubmit={handleLogin}>
            {/* Input Fields */}
            <div className="w-full flex flex-col gap-4 mb-6">
              <div className="relative">
                <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-transparent border-b border-black outline-none focus:ring-2 focus:ring-[#003366] shadow-sm"
                  required
                />
              </div>

              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 bg-transparent border-b border-black outline-none focus:ring-2 focus:ring-[#003366] shadow-sm"
                  required
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="w-full flex flex-col mt-6">
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full text-white font-semibold bg-[#003366] hover:scale-105 transition-transform duration-200 rounded-md p-4 disabled:opacity-50"
              >
                {isLoading ? 'Logging in...' : 'Log in'}
              </button>
              <Link to={userType === 'customer' ? "/customer/register" : "/staff/register"}>
                <button 
                  type="button"
                  className="w-full text-[#003366] border-2 border-[#003366] hover:bg-[#003366] hover:text-white transition-all duration-200 rounded-md p-4 mt-3"
                >
                  Register as {userType}
                </button>
              </Link>
            </div>
          </form>

          {/* Sign-up Link */}
          <div className="w-full flex items-center justify-center mt-6">
            <p className="text-sm font-normal text-[#060606]">
              Don't have an account?
              <Link 
                to={`/register/${userType}`} 
                className="font-semibold underline underline-offset-2 cursor-pointer ml-1 relative after:content-[''] after:absolute after:bg-[#003366] after:h-[2px] after:w-0 after:left-0 after:bottom-[-2px] hover:after:w-full after:transition-all after:duration-300"
              >
                Sign up as {userType}
              </Link>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;