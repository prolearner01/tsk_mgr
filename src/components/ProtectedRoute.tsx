
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export const ProtectedRoute = () => {
    const { session, loading } = useAuthStore();

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-page flex items-center justify-center">
                <p className="text-secondary-gray">Loading...</p>
            </div>
        );
    }

    if (!session) {
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};
