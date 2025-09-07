// src/pages/admin/AdminLogin.jsx
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoginForm from '../../components/admin/LoginForm';

const AdminLogin = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/ktlgmaster/dashboard" replace />;
    }

    return <LoginForm onSuccess={() => window.location.href = '/ktlgmaster/dashboard'} />;
};

export default AdminLogin;