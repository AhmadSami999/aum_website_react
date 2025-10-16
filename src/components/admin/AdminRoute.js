// src/components/admin/AdminRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { currentUser, role } = useAuth();

  if (!currentUser || role !== 'admin') {
    return <Navigate to="/signin" replace />;
  }

  return children;
};

export default AdminRoute;
