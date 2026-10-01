import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert, Eye, EyeOff, User, Lock } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState('citizen');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');

  const handleEnter = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: '#0d1117',
      fontFamily: "'Inter', sans-serif",
      overflow: 'hidden',
      position: 'relative'
    }}>
      {/* Hero Background */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/hero.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        filter: 'brightness(0.35)',
        zIndex: 0
      }} />

      {/* Gradient overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 40%, rgba(0,0,0,0.7) 100%)',
        zIndex: 1
      }} />

      {/* Top Bar */}
      <div style={{ position: 'relative', zIndex: 10, padding: '1.25rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, #5cb82b, #3a8a12)', padding: '0.5rem', borderRadius: '8px' }}>
            <ShieldAlert size={22} color="white" />
          </div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '1.25rem', letterSpacing: '0.05em' }}>
            Agrim
          </span>
        </div>
        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.9rem' }}>
          {['About Us', 'FAQ', 'Contact Us', 'Introduction'].map(item => (
            <a key={item} href="#" style={{ color: 'rgba(255,255,255,0.7)', transition: 'color 0.2s' }}
               onMouseOver={e => e.target.style.color = '#5cb82b'}
               onMouseOut={e => e.target.style.color = 'rgba(255,255,255,0.7)'}>
              {item}
            </a>
          ))}
        </div>
      </div>

      {/* Main Hero Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        flex: 1, display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '4rem 2rem',
        textAlign: 'center',
        gap: '2rem'
      }}>
        {/* Tag */}
        <div style={{
          background: 'rgba(92,184,43,0.15)',
          border: '1px solid rgba(92,184,43,0.4)',
          color: '#5cb82b',
          padding: '0.4rem 1.2rem',
          borderRadius: '9999px',
          fontSize: '0.85rem',
          fontWeight: 600,
          letterSpacing: '0.08em',
          textTransform: 'uppercase'
        }}>
          Community Disaster Resilience Platform — Goa
        </div>

        {/* Main Headline */}
        <div>
          <h1 style={{
            fontSize: 'clamp(2.5rem, 6vw, 5rem)',
            fontWeight: 900,
            color: 'white',
            margin: '0 0 0.25rem 0',
            lineHeight: 1.1,
            textShadow: '2px 2px 20px rgba(0,0,0,0.5)'
          }}>
            It's time for
          </h1>
          <h1 style={{
            fontSize: 'clamp(3rem, 8vw, 7rem)',
            fontWeight: 900,
            margin: '0 0 1.5rem 0',
            lineHeight: 1,
            background: 'linear-gradient(135deg, #5cb82b, #a3e635)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            CHANGE
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 2vw, 1.3rem)',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
            lineHeight: 1.7
          }}>
            Find out how you can obtain resilience and peace with our platform. 
            Share your reports and we will help protect your community.
          </p>
        </div>

        {/* Login Card */}
        <div style={{
          background: 'rgba(255,255,255,0.97)',
          borderRadius: '16px',
          padding: '2.5rem',
          width: '100%',
          maxWidth: '420px',
          boxShadow: '0 25px 60px rgba(0,0,0,0.4)',
          backdropFilter: 'blur(20px)',
          textAlign: 'left'
        }}>
          <h2 style={{ margin: '0 0 0.5rem 0', color: '#1a1a1a', fontSize: '1.5rem' }}>Welcome Back</h2>
          <p style={{ margin: '0 0 2rem 0', color: '#666', fontSize: '0.9rem' }}>Select your role and enter the platform</p>

          <form onSubmit={handleEnter} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Name */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#444', fontSize: '0.875rem' }}>Your Name</label>
              <div style={{ position: 'relative' }}>
                <User size={18} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type="text"
                  placeholder="e.g. Priya Naik"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  style={{
                    width: '100%', padding: '0.875rem 1rem 0.875rem 2.75rem',
                    borderRadius: '8px', border: '1px solid #ddd',
                    fontSize: '1rem', color: '#333', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#5cb82b'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#444', fontSize: '0.875rem' }}>I am a…</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
                {['citizen', 'volunteer', 'authority'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    style={{
                      padding: '0.625rem',
                      borderRadius: '8px',
                      border: `2px solid ${role === r ? '#5cb82b' : '#ddd'}`,
                      background: role === r ? '#f0fce8' : 'white',
                      color: role === r ? '#3a8a12' : '#666',
                      fontWeight: role === r ? 700 : 500,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      textTransform: 'capitalize',
                      transition: 'all 0.2s'
                    }}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Password placeholder */}
            <div>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontWeight: 600, color: '#444', fontSize: '0.875rem' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={18} color="#aaa" style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter any password"
                  defaultValue="demo"
                  style={{
                    width: '100%', padding: '0.875rem 3rem 0.875rem 2.75rem',
                    borderRadius: '8px', border: '1px solid #ddd',
                    fontSize: '1rem', color: '#333', outline: 'none',
                    transition: 'border-color 0.2s', boxSizing: 'border-box'
                  }}
                  onFocus={e => e.target.style.borderColor = '#5cb82b'}
                  onBlur={e => e.target.style.borderColor = '#ddd'}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  {showPassword ? <EyeOff size={18} color="#aaa" /> : <Eye size={18} color="#aaa" />}
                </button>
              </div>
            </div>

            {/* CTA */}
            <button type="submit" style={{
              width: '100%',
              padding: '1rem',
              background: 'linear-gradient(135deg, #f26b1d, #d95a12)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '1.05rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(242,107,29,0.4)',
              transition: 'all 0.2s',
              letterSpacing: '0.02em'
            }}
            onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Enter Platform →
            </button>
          </form>
        </div>

        {/* Stats Row */}
        <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', justifyContent: 'center', marginTop: '1rem' }}>
          {[
            { label: 'Active Alerts', value: '12' },
            { label: 'Areas Monitored', value: '24' },
            { label: 'Volunteers Ready', value: '180' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2.25rem', fontWeight: 800, color: '#5cb82b' }}>{stat.value}</div>
              <div style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', marginTop: '0.25rem' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Login;
