import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  FaUserShield,
  FaUser,
  FaCertificate,
  FaBell,
  FaUsers,
  FaUpload, 
  FaCheckCircle,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import styled from "styled-components";
import { useAuthContext } from "../Context/authContext";
import { Navigate } from "react-router-dom";
import LogoutButton from "./LogoutButton";

const cardVariants = {
  initial: { opacity: 0, y: 30, scale: 0.97 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, type: "spring" } },
  exit: { opacity: 0, y: 30, scale: 0.97, transition: { duration: 0.3 } },
};

export default function Dashboard() {
  const {user ,isAuthenticated,setIsAuthenticated,setUser} = useAuthContext();
  const [showLogin, setShowLogin] = useState(false);


  if (!user) {
    return <Navigate to="/login" />;
  }
  const handleLogout = ()=>{
    try {
      // Clear auth token from localStorage
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      
      // Reset auth context
      setIsAuthenticated(false);
      setUser(null);
      
      // Redirect to login page
      return <Navigate to="/login" />
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
  
  
  
  return (
     <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-0 md:p-6">
           {/* Header section remains the same */}

     
           <div className="max-w-4xl mx-auto mt-8">
             {/* Profile Card */}
             <motion.div
               className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg p-6 mb-10 gap-6"
               variants={cardVariants}
               initial="initial"
               animate="animate"
               exit="exit"
             >
               <div className="relative">
                 <motion.div
                   className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center"
                   whileHover={{ scale: 1.08, rotate: 2 }}
                 >
                   {user.role === 'admin' ? 
                     <FaUserShield className="text-4xl text-green-600" /> :
                     <FaUser className="text-4xl text-blue-600" />
                   }
                 </motion.div>
                 <span
                   className={`absolute bottom-2 right-2 w-5 h-5 rounded-full border-2 border-white ${
                     user.role === "admin" ? "bg-green-500" : "bg-blue-500"
                   }`}
                   title={user.role === "admin" ? "Admin" : "Client"}
                 />
               </div>
               <div className="flex-1">
                 <h1 className="text-2xl md:text-3xl font-bold text-green-700 mb-1">
                   {user.role === "admin" ? "Admin Dashboard" : "Citizen Dashboard"}
                 </h1>
                 <div className="flex flex-wrap items-center gap-4 text-gray-700">
                   <span className="font-semibold flex items-center gap-1">
                     {user.role === "admin" ? <FaUserShield /> : <FaUser />}
                     {user.fullName}
                   </span>
                   <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-mono tracking-wider">
                     ID: {user.email}
                   </span>
                 </div>
                 <p className="mt-2 text-gray-500">
                   Welcome, {user.fullName}!{" "}
                   {user.role === "admin"
                     ? "Manage certificates, users, and approvals below."
                     : "Access your certificates and apply for new ones easily."}
                 </p>
               </div>
               <div className="button"><button onClick={handleLogout}><LogoutButton></LogoutButton></button></div>
             </motion.div>
     
             {/* Service Cards */}
             <AnimatePresence>
               {user.role === "client" ? (
                 <motion.div
                   className="mb-10"
                   variants={cardVariants}
                   initial="initial"
                   animate="animate"
                   exit="exit"
                 >
                   <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                     <FaUser className="text-blue-500" /> User Services
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Link
                       to="/user/certificates"
                       className="bg-white p-6 rounded-2xl shadow hover:bg-green-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                     >
                       <FaCertificate className="text-3xl text-blue-600 mb-2" />
                       <h3 className="text-lg font-bold mb-1 text-green-700">View Certificates</h3>
                       <p className="text-center text-gray-600 text-sm">
                         Access and download your certificates.
                       </p>
                     </Link>
                      <Link
                        to="/user/forms"
                        className="bg-white p-6 rounded-2xl shadow hover:bg-green-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                      >
                        <FaCheckCircle className="text-3xl text-green-600 mb-2" />
                        <h3 className="text-lg font-bold mb-1 text-green-700">Apply for Certificate</h3>
                        <p className="text-center text-gray-600 text-sm">
                          Submit new requests for official certificates.
                        </p>
                      </Link>
                      <Link
                        to="/user/notifications"
                        className="bg-white p-6 rounded-2xl shadow hover:bg-green-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                      >
                        <FaBell className="text-3xl text-yellow-500 mb-2" />
                        <h3 className="text-lg font-bold mb-1 text-green-700">Notifications</h3>
                        <p className="text-center text-gray-600 text-sm">
                          Get updates about your application status.
                        </p>
                      </Link>
                   </div>
                 </motion.div>
               ) : (
                 <motion.div
                   variants={cardVariants}
                   initial="initial"
                   animate="animate"
                   exit="exit"
                 >
                   <h2 className="text-2xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                     <FaUserShield className="text-green-600" /> Admin Services
                   </h2>
                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     <Link
                       to="/admin/users"
                       className="bg-white p-6 rounded-2xl shadow hover:bg-yellow-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                     >
                       <FaUsers className="text-3xl text-yellow-600 mb-2" />
                       <h3 className="text-lg font-bold mb-1 text-yellow-700">Manage Users</h3>
                       <p className="text-center text-gray-600 text-sm">
                         View and manage user requests.
                       </p>
                     </Link>
                     <Link
                        to="/admin/approvals"
                        className="bg-white p-6 rounded-2xl shadow hover:bg-yellow-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                      >
                        <FaCheckCircle className="text-3xl text-green-600 mb-2" />
                        <h3 className="text-lg font-bold mb-1 text-yellow-700">Certificate Approvals</h3>
                        <p className="text-center text-gray-600 text-sm">
                          Approve or reject submitted certificate forms.
                        </p>
                      </Link>
                      <Link
                        to="/admin/upload"
                        className="bg-white p-6 rounded-2xl shadow hover:bg-yellow-50 transition-all duration-300 hover:scale-105 flex flex-col items-center"
                      >
                        <FaUpload className="text-3xl text-blue-600 mb-2" />
                        <h3 className="text-lg font-bold mb-1 text-yellow-700">Upload Certificates</h3>
                        <p className="text-center text-gray-600 text-sm">
                          Upload finalized certificates for users to download.
                        </p>
                      </Link>
                   </div>
                 </motion.div>
               )}
             </AnimatePresence>
           </div>
         </div>
  );
}

const StyledWrapper = styled.div`
  .form-box {
    background: white;
    border-radius: 1rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 2rem;
    width: 90%;
    max-width: 400px;
    position: relative;
    overflow: hidden;
    border: 1px solid #e5e7eb;
  }

  .title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .subtitle {
    font-size: 0.875rem;
    color: #6b7280;
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .form-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .input {
    padding: 0.75rem 1rem;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    font-size: 1rem;
    color: #374151;
    transition: border-color 0.3s;
  }

  .input:focus {
    border-color: #4f46e5;
    outline: none;
  }

  .login-btn-client,
  .login-btn-admin {
    flex: 1;
    padding: 0.75rem;
    border-radius: 0.5rem;
    font-weight: 500;
    transition: background-color 0.3s, transform 0.3s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .login-btn-client {
    background-color: #2563eb;
    color: white;
  }

  .login-btn-client:hover {
    background-color: #1d4ed8;
    transform: translateY(-2px);
  }

  .login-btn-admin {
    background-color: #16a34a;
    color: white;
  }

  .login-btn-admin:hover {
    background-color: #15803d;
    transform: translateY(-2px);
  }

  .form-section {
    text-align: center;
    margin-top: 1rem;
  }
`;
