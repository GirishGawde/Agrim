import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

/**
 * RoleGuard — hides a page if the logged-in user's role is not in `roles`.
 * If the user is not logged in, redirects to /login.
 */
export function RoleGuard({ roles, children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // wait for auth to hydrate

  if (!user) return <Navigate to="/login" replace />;

  if (roles && !roles.includes(user.role)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-3 text-slate-500">
        <span className="text-4xl">🔒</span>
        <p className="text-lg font-medium text-slate-300">Access restricted</p>
        <p className="text-sm">Your role ({user.role}) cannot access this page.</p>
        <a href="/" className="mt-2 text-primary-400 underline text-sm">Go home</a>
      </div>
    );
  }

  return children;
}
