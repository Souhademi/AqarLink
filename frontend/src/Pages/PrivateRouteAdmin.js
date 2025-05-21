import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteAdmin = ({ children }) => {
  const isAuthenticated = localStorage.getItem("adminLoggedIn");
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

export default PrivateRouteAdmin;
