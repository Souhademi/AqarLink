import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRouteInvestor = ({ children }) => {
  const isAuthenticated = localStorage.getItem("investorToken");

  // If authenticated, allow access. Else, redirect to investor login
  return isAuthenticated ? children : <Navigate to="/investor/login" replace />;
};

export default PrivateRouteInvestor;
