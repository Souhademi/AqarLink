import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("clientToken");

    // If the user is authenticated, render the children (dashboard), else navigate to login
    return isAuthenticated ? children : < Navigate to = "/client/login"
    replace/> ;
};

export default PrivateRoute;