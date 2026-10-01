import React, { useState, useEffect } from 'react';
import { Map, AlertTriangle, ShieldAlert, Route, FileText, Home, ArrowRight, CloudRain, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [alertsCount, setAlertsCount] = useState(0);
  const [reportsCount, setReportsCount] = useState(0);
  const [recentAlerts, setRecentAlerts] = useState([]);

  useEffect(() => {
    // Fetch alerts
    fetch('http://127.0.0.1:8000/alerts/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length >= 0) {
          setAlertsCount(data.length);
          // take top 3
          const top3 = data.slice(-3).reverse().map(a => {
            let icon = ShieldAlert;
            let color = '#3b82f6';
            if (a.hazard_type === 'flood') { icon = CloudRain; color = '#3b82f6'; }
            if (a.hazard_type === 'fire') { icon = Flame; color = '#f26b1d'; }
            if (a.hazard_type === 'landslide') { icon = AlertTriangle; color = '#92400e'; }
            if (a.hazard_type === 'roadblock') { icon = Route; color = '#7c3aed'; }
            
            return {
              id: a.id,
              icon: icon,
              color: color,
              text: a.message.substring(0, 50) + (a.message.length > 50 ? '...' : ''),
              time: 'Recent'
            };
          });
          setRecentAlerts(top3);
        }
      })
      .catch(err => console.error(err));

    // Fetch reports
    fetch('http://127.0.0.1:8000/reports/')
      .then(res => res.json())
      .then(data => {
        if (data && data.length >= 0) {
          setReportsCount(data.length);
        }
      })
      .catch(err => console.error(err));
  }, []);

  const modules = [
    {
      path: '/map',
      label: 'Live Hazard Map',
      icon: Map,
      color: '#5cb82b',
      bgColor: '#f0fce8',
      borderColor: '#bbf7d0',
      desc: 'Real-time risk zones, flood markers, shelters & blocked roads.',
      tag: 'Live'
    },
    {
      path: '/report',
      label: 'Report a Hazard',
      icon: AlertTriangle,
      color: '#f26b1d',
      bgColor: '#fff7ed',
      borderColor: '#fed7aa',
      desc: 'Submit a photo report for flood, landslide, fire, or road block.',
      tag: 'Active'
    },
    {
      path: '/alerts',
      label: 'Community Alerts',
      icon: ShieldAlert,
      color: '#ef4444',
      bgColor: '#fef2f2',
      borderColor: '#fecaca',
      desc: 'Official alerts in English, Konkani, Marathi & Hindi.',
      tag: alertsCount > 0 ? `${alertsCount} New` : null
    },
    {
      path: '/route',
      label: 'Find Safe Route',
      icon: Route,
      color: '#3b82f6',
      bgColor: '#eff6ff',
      borderColor: '#bfdbfe',
      desc: 'Navigate around flooded or blocked roads to reach safety.',
      tag: null
    },
    {
      path: '/plan',
      label: 'My Household Plan',
      icon: FileText,
      color: '#8b5cf6',
      bgColor: '#f5f3ff',
      borderColor: '#ddd6fe',
      desc: 'Your personalized action plan, emergency contacts & resources.',
      tag: null
    },
  ];

  return (
    <div style={{ background: '#f3f4ee', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2d3a1e 100%)',
        padding: '3rem 2rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'url(/hero.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 60%',
          opacity: 0.15
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '1100px', margin: '0 auto' }}>
          <span style={{
            background: 'rgba(92,184,43,0.2)',
            border: '1px solid rgba(92,184,43,0.5)',
            color: '#7dd449',
            padding: '0.3rem 1rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em'
          }}>
            Goa Community Resilience Platform
          </span>
          <h1 style={{ color: 'white', fontSize: '2.5rem', fontWeight: 800, marginTop: '1rem', marginBottom: '0.5rem' }}>
            Welcome, Citizen 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.65)', maxWidth: '500px', fontSize: '1rem', lineHeight: 1.7 }}>
            Monitor hazards, report incidents, and navigate safely. Select a module below to get started.
          </p>

          {/* Stats row */}
          <div style={{ display: 'flex', gap: '2.5rem', marginTop: '2rem', flexWrap: 'wrap' }}>
            {[
              { label: 'Active Alerts', value: alertsCount, color: '#ef4444' },
              { label: 'Volunteers Online', value: '48', color: '#5cb82b' },
              { label: 'Reports Today', value: reportsCount, color: '#f26b1d' },
              { label: 'Shelters Open', value: '5', color: '#3b82f6' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: s.color }}>{s.value}</div>
                <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: '0.1rem' }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '2.5rem 2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' }}>

          {/* Modules Grid */}
          <div>
            <h2 style={{ fontWeight: 700, fontSize: '1.2rem', color: '#333', marginBottom: '1.25rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Modules
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {modules.map((mod, idx) => (
                <Link key={idx} to={mod.path} style={{ display: 'block', color: 'inherit', textDecoration: 'none' }}>
                  <div style={{
                    background: 'white',
                    border: `1px solid #e5e7e0`,
                    borderRadius: '12px',
                    padding: '1.25rem 1.5rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1.25rem',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
                  }}
                  onMouseOver={e => {
                    e.currentTarget.style.borderColor = mod.color;
                    e.currentTarget.style.boxShadow = `0 4px 15px ${mod.color}25`;
                    e.currentTarget.style.transform = 'translateX(4px)';
                  }}
                  onMouseOut={e => {
                    e.currentTarget.style.borderColor = '#e5e7e0';
                    e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.05)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                  >
                    <div style={{
                      background: mod.bgColor,
                      border: `1px solid ${mod.borderColor}`,
                      padding: '0.9rem',
                      borderRadius: '10px',
                      flexShrink: 0
                    }}>
                      <mod.icon size={28} color={mod.color} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.35rem' }}>
                        <h3 style={{ margin: 0, fontWeight: 700, fontSize: '1.05rem', color: '#1a1a1a' }}>{mod.label}</h3>
                        {mod.tag && (
                          <span style={{
                            background: mod.color === '#ef4444' ? '#fee2e2' : '#f0fce8',
                            color: mod.color,
                            padding: '0.15rem 0.6rem',
                            borderRadius: '9999px',
                            fontSize: '0.7rem',
                            fontWeight: 700
                          }}>{mod.tag}</span>
                        )}
                      </div>
                      <p style={{ margin: 0, color: '#777', fontSize: '0.9rem', lineHeight: 1.5 }}>{mod.desc}</p>
                    </div>
                    <ArrowRight size={20} color="#ccc" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Recent Alerts */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7e0', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid #f0f0ec', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Recent Alerts</h3>
                <Link to="/alerts" style={{ fontSize: '0.8rem', color: '#5cb82b', fontWeight: 600 }}>View All →</Link>
              </div>
              <div>
                {recentAlerts.map((alert, idx) => (
                  <div key={idx} style={{
                    padding: '1rem 1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '0.75rem',
                    borderBottom: idx !== recentAlerts.length - 1 ? '1px solid #f5f5f0' : 'none'
                  }}>
                    <div style={{ background: `${alert.color}15`, padding: '0.5rem', borderRadius: '8px', flexShrink: 0, marginTop: '0.1rem' }}>
                      <alert.icon size={16} color={alert.color} />
                    </div>
                    <div>
                      <p style={{ margin: '0 0 0.25rem', fontSize: '0.85rem', fontWeight: 600, color: '#333', lineHeight: 1.4 }}>{alert.text}</p>
                      <span style={{ fontSize: '0.75rem', color: '#aaa' }}>{alert.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Report */}
            <div style={{
              background: 'linear-gradient(135deg, #f26b1d, #d95a12)',
              borderRadius: '12px',
              padding: '1.5rem',
              color: 'white'
            }}>
              <AlertTriangle size={28} color="rgba(255,255,255,0.9)" style={{ marginBottom: '0.75rem' }} />
              <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.1rem' }}>See a Hazard?</h3>
              <p style={{ margin: '0 0 1.25rem', fontSize: '0.875rem', opacity: 0.85, lineHeight: 1.5 }}>
                Report it instantly so the community can stay safe.
              </p>
              <Link to="/report" style={{
                display: 'inline-block',
                background: 'white',
                color: '#f26b1d',
                fontWeight: 700,
                padding: '0.625rem 1.25rem',
                borderRadius: '8px',
                fontSize: '0.9rem'
              }}>
                Submit Report →
              </Link>
            </div>

            {/* Weather Widget */}
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #e5e7e0', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0, fontWeight: 700, fontSize: '0.95rem', color: '#1a1a1a' }}>Weather — Panaji</h3>
                <span style={{ fontSize: '0.75rem', color: '#aaa' }}>Live</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <CloudRain size={40} color="#3b82f6" />
                <div>
                  <div style={{ fontSize: '2rem', fontWeight: 800, color: '#1a1a1a', lineHeight: 1 }}>27°C</div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>Heavy Rain · 95% Humidity</div>
                </div>
              </div>
              <div style={{
                marginTop: '1rem',
                padding: '0.75rem',
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '8px',
                fontSize: '0.8rem',
                color: '#ef4444',
                fontWeight: 600
              }}>
                ⚠ IMD Red Alert active for North Goa
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
