import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Map, AlertTriangle, ShieldAlert, Route, FileText, ShieldCheck, LogOut } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (location.pathname === '/') return null;

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/map', label: 'Live Map', icon: Map },
    { path: '/report', label: 'Report', icon: AlertTriangle },
    { path: '/alerts', label: 'Alerts', icon: ShieldAlert },
    { path: '/route', label: 'Safe Route', icon: Route },
    { path: '/plan', label: 'My Plan', icon: FileText },
  ];

  return (
    <header style={{ position: 'sticky', top: 0, zIndex: 100 }}>
      {/* Top dark strip */}
      <div style={{ backgroundColor: '#111', padding: '0.6rem 0', borderBottom: '1px solid #222' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <ShieldCheck size={20} color="#5cb82b" />
            <span style={{ color: '#5cb82b', fontWeight: 800, fontSize: '1rem', letterSpacing: '0.08em' }}>AGRIM</span>
          </div>
          <div style={{ display: 'flex', gap: '2rem', fontSize: '0.8rem' }}>
            {['About Us', 'FAQ', 'Contact Us', 'Our Partners'].map(item => (
              <a key={item} href="#" style={{ color: '#888', transition: 'color 0.2s' }}
                 onMouseOver={e => e.target.style.color = '#5cb82b'}
                 onMouseOut={e => e.target.style.color = '#888'}>
                {item}
              </a>
            ))}
            <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#f26b1d', fontWeight: 600, fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main green nav */}
      <div style={{ backgroundColor: '#5cb82b', boxShadow: '0 4px 10px rgba(0,0,0,0.15)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 1.5rem', display: 'flex', overflowX: 'auto', scrollbarWidth: 'none' }}>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={({ isActive }) => ({
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.9rem 1.25rem',
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                backgroundColor: isActive ? 'rgba(0,0,0,0.2)' : 'transparent',
                borderRight: '1px solid rgba(255,255,255,0.15)',
                transition: 'background 0.15s',
                whiteSpace: 'nowrap',
                textDecoration: 'none'
              })}
              onMouseOver={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.backgroundColor = 'rgba(0,0,0,0.1)'; }}
              onMouseOut={e => { if (!e.currentTarget.classList.contains('active')) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <item.icon size={17} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
