// src/components/student/StudentRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function StudentRoute({ children }) {
  const { currentUser, role } = useAuth();

  if (!currentUser || (role !== 'student' && role !== 'candidate')) {
    return <Navigate to="/signin" />;
  }

  return children;
}

export default StudentRoute;
