// ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ component: Component }) => {
  const isAuthenticated = localStorage.getItem('authToken') !== null; // Check if token exists

  return isAuthenticated ? <Component /> : <Navigate to="/" />; // Redirect to login if not authenticated
};

export default ProtectedRoute;
