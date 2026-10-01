import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { RoleGuard } from './components/RoleGuard.jsx';
import { ErrorBoundary } from './components/ErrorBoundary.jsx';
import Login               from './pages/Login.jsx';
import AuthorityDashboard  from './pages/AuthorityDashboard.jsx';
import AlertApproval       from './pages/AlertApproval.jsx';
import ShelterResources    from './pages/ShelterResources.jsx';
import RecoveryTracker     from './pages/RecoveryTracker.jsx';
import LessonsLearned      from './pages/LessonsLearned.jsx';
import VolunteerTasks      from './pages/VolunteerTasks.jsx';

// Layout wraps every protected page with the sidebar + main content area
function Layout({ children, theme, onThemeToggle, lowBw, onLowBwToggle }) {
  return (
    <div className="flex min-h-screen">
      <Navbar theme={theme} onThemeToggle={onThemeToggle} lowBw={lowBw} onLowBwToggle={onLowBwToggle} />
      {/* Offset content by sidebar on desktop, topbar on mobile */}
      <main className="flex-1 lg:ml-60 pt-14 lg:pt-0 p-4 sm:p-6 lg:p-8 w-full max-w-[1750px] mx-auto">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </main>
    </div>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('agrim_theme') || 'dark');
  const [lowBw, setLowBw] = useState(() => localStorage.getItem('agrim_lowbw') === 'true');

  useEffect(() => {
    const html = document.documentElement;
    if (theme === 'light') html.classList.add('light'); else html.classList.remove('light');
    localStorage.setItem('agrim_theme', theme);
  }, [theme]);

  useEffect(() => {
    const html = document.documentElement;
    if (lowBw) html.classList.add('low-bw'); else html.classList.remove('low-bw');
    localStorage.setItem('agrim_lowbw', lowBw);
  }, [lowBw]);

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');
  const toggleLowBw = () => setLowBw(b => !b);

  const wrapLayout = (page) => (
    <Layout theme={theme} onThemeToggle={toggleTheme} lowBw={lowBw} onLowBwToggle={toggleLowBw}>
      {page}
    </Layout>
  );

  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Authority-only */}
          <Route path="/dashboard" element={
            <RoleGuard roles={['authority']}>
              {wrapLayout(<AuthorityDashboard />)}
            </RoleGuard>
          } />
          <Route path="/alerts" element={
            <RoleGuard roles={['authority']}>
              {wrapLayout(<AlertApproval />)}
            </RoleGuard>
          } />
          <Route path="/lessons" element={
            <RoleGuard roles={['authority']}>
              {wrapLayout(<LessonsLearned />)}
            </RoleGuard>
          } />

          {/* Authority + Volunteer */}
          <Route path="/shelters" element={
            <RoleGuard roles={['authority', 'volunteer']}>
              {wrapLayout(<ShelterResources />)}
            </RoleGuard>
          } />

          {/* Volunteer-only */}
          <Route path="/tasks" element={
            <RoleGuard roles={['volunteer']}>
              {wrapLayout(<VolunteerTasks />)}
            </RoleGuard>
          } />

          {/* All roles */}
          <Route path="/recovery" element={
            <RoleGuard roles={['authority', 'volunteer', 'citizen']}>
              {wrapLayout(<RecoveryTracker />)}
            </RoleGuard>
          } />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
