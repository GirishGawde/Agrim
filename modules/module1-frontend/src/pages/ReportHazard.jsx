import React, { useState } from 'react';
import { Camera, MapPin, Send, ChevronDown } from 'lucide-react';

const HAZARD_TYPES = [
  { value: 'flood', label: 'Flood / Waterlogging', color: '#3b82f6' },
  { value: 'landslide', label: 'Landslide', color: '#92400e' },
  { value: 'fire', label: 'Fire / Forest Fire', color: '#f26b1d' },
  { value: 'roadblock', label: 'Blocked Road', color: '#ef4444' },
  { value: 'other', label: 'Other Hazard', color: '#6b7280' },
];

const ReportHazard = () => {
  const [hazardType, setHazardType] = useState('flood');
  const [submitted, setSubmitted] = useState(false);

  const activeHazard = HAZARD_TYPES.find(h => h.value === hazardType);

  if (submitted) {
    return (
      <div style={{ background: '#f3f4ee', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '16px', padding: '3rem', maxWidth: '480px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div style={{ width: '72px', height: '72px', background: '#dcfce7', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
            <Send size={32} color="#16a34a" />
          </div>
          <h2 style={{ color: '#1a1a1a', marginBottom: '0.75rem' }}>Report Submitted!</h2>
          <p style={{ color: '#666', lineHeight: 1.6, marginBottom: '2rem' }}>
            Your report has been sent for verification. It will appear on the live map once approved by an authority.
          </p>
          <button onClick={() => setSubmitted(false)} style={{ background: '#5cb82b', color: 'white', border: 'none', borderRadius: '8px', padding: '0.875rem 2rem', fontWeight: 700, cursor: 'pointer', fontSize: '1rem' }}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#f3f4ee', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Page Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e2da', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', marginBottom: '0.25rem' }}>Report a Hazard</h1>
          <p style={{ color: '#777', margin: 0, fontSize: '0.9rem' }}>Help keep your community safe. Reports are verified before going live.</p>
        </div>
      </div>

      <div style={{ maxWidth: '760px', margin: '2rem auto', padding: '0 2rem' }}>
        <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }}>

          {/* Hazard Type */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>1. Select Hazard Type</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
              {HAZARD_TYPES.map(h => (
                <button
                  key={h.value}
                  type="button"
                  onClick={() => setHazardType(h.value)}
                  style={{
                    padding: '0.875rem 0.75rem',
                    borderRadius: '10px',
                    border: `2px solid ${hazardType === h.value ? h.color : '#e0e2da'}`,
                    background: hazardType === h.value ? `${h.color}12` : 'white',
                    color: hazardType === h.value ? h.color : '#555',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    transition: 'all 0.15s'
                  }}
                >
                  {h.label}
                </button>
              ))}
            </div>
          </div>

          {/* Location */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>2. Confirm Location</h3>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <input
                type="text"
                defaultValue="Patto-Panaji, Goa"
                style={{ flex: 1, padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e0e2da', fontSize: '0.95rem', color: '#333', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = '#5cb82b'}
                onBlur={e => e.target.style.borderColor = '#e0e2da'}
              />
              <button type="button" style={{ background: '#f3f4ee', border: '1px solid #e0e2da', borderRadius: '8px', padding: '0 1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#555', fontSize: '0.875rem' }}>
                <MapPin size={16} color="#5cb82b" /> Use GPS
              </button>
            </div>
          </div>

          {/* Description */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>3. Describe the Situation</h3>
            <textarea
              rows="4"
              placeholder="e.g. The road near the market is completely submerged. Water is about knee-deep and rising..."
              style={{ width: '100%', padding: '0.875rem 1rem', borderRadius: '8px', border: '1px solid #e0e2da', fontSize: '0.95rem', color: '#333', outline: 'none', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
              onFocus={e => e.target.style.borderColor = '#5cb82b'}
              onBlur={e => e.target.style.borderColor = '#e0e2da'}
            />
          </div>

          {/* Photo */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1rem', color: '#333' }}>4. Upload Photo <span style={{ color: '#ef4444', fontSize: '0.8rem' }}>Required for verification</span></h3>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <div style={{
                border: '2px dashed #c8cdc0',
                borderRadius: '10px',
                padding: '3rem 1rem',
                textAlign: 'center',
                transition: 'all 0.2s',
                background: '#fafaf8'
              }}
              onMouseOver={e => { e.currentTarget.style.borderColor = '#5cb82b'; e.currentTarget.style.background = '#f0fce8'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = '#c8cdc0'; e.currentTarget.style.background = '#fafaf8'; }}
              >
                <Camera size={40} color="#9ca3af" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <p style={{ fontWeight: 600, color: '#555', margin: '0 0 0.25rem' }}>Click to upload or take a photo</p>
                <p style={{ fontSize: '0.8rem', color: '#aaa', margin: 0 }}>JPEG, PNG · Max 10MB</p>
              </div>
              <input type="file" accept="image/*" style={{ display: 'none' }} />
            </label>
          </div>

          <button type="submit" style={{
            width: '100%',
            padding: '1rem',
            background: 'linear-gradient(135deg, #f26b1d, #d95a12)',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '1.05rem',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
            boxShadow: '0 4px 14px rgba(242,107,29,0.35)',
            transition: 'all 0.2s'
          }}
          onMouseOver={e => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseOut={e => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <Send size={20} /> Submit Report
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReportHazard;
