import React from 'react';
import { Navigate } from 'react-router-dom';

const AgencyPrivateRoute = ({ children }) => {
    const isAuthenticated = localStorage.getItem("token");

    // If the agency admin is authenticated, render the children (dashboard), else navigate to login
    return isAuthenticated ? children : < Navigate to = "/estateAgency/login"
    replace/> ;
};

export default AgencyPrivateRoute;