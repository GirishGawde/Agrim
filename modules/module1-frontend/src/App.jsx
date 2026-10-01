import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import LiveMap from './pages/LiveMap';
import ReportHazard from './pages/ReportHazard';
import Alerts from './pages/Alerts';
import SafeRoute from './pages/SafeRoute';
import HouseholdPlan from './pages/HouseholdPlan';

function App() {
  return (
    <Router>
      <div className="app-layout">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/map" element={<LiveMap />} />
            <Route path="/report" element={<ReportHazard />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/route" element={<SafeRoute />} />
            <Route path="/plan" element={<HouseholdPlan />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
