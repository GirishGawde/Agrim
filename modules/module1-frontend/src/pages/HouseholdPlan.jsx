import React from 'react';
import { CheckCircle2, Navigation, Phone, Leaf, FileText } from 'lucide-react';

const HouseholdPlan = () => {
  return (
    <div style={{ background: '#f3f4ee', minHeight: '100vh', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: 'white', borderBottom: '1px solid #e0e2da', padding: '1.5rem 2rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#1a1a1a', margin: 0 }}>My Household Plan</h1>
            <p style={{ color: '#777', margin: '0.25rem 0 0', fontSize: '0.9rem' }}>Personalized disaster preparedness for your household</p>
          </div>
          <span style={{ background: '#fef3c7', color: '#d97706', border: '1px solid #fcd34d', padding: '0.35rem 1rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            ⚡ Medium Risk Zone
          </span>
        </div>
      </div>

      <div style={{ maxWidth: '900px', margin: '2rem auto', padding: '0 2rem' }}>
        {/* Top Info Card */}
        <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', flexWrap: 'wrap' }}>
          <div style={{ background: '#f0fce8', border: '1px solid #bbf7d0', padding: '1.25rem', borderRadius: '12px' }}>
            <Leaf size={36} color="#5cb82b" />
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ margin: '0 0 0.25rem', fontSize: '1.3rem' }}>Fisherman Family</h2>
            <p style={{ margin: 0, color: '#777', fontSize: '0.9rem' }}>Location: Panaji Coastline · Language: English · 4 members</p>
          </div>
          <button style={{ background: 'transparent', border: '1px solid #e0e2da', borderRadius: '8px', padding: '0.6rem 1.2rem', fontWeight: 600, cursor: 'pointer', color: '#555', fontSize: '0.875rem' }}>
            Edit Profile
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
          {/* What to do now */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1a1a1a' }}>
              <CheckCircle2 size={20} color="#5cb82b" /> What to Do Now
            </h3>
            <ul style={{ paddingLeft: '1.25rem', color: '#444', lineHeight: '1.8', fontSize: '0.9rem', margin: 0 }}>
              <li>Secure fishing nets and boats to strong moorings.</li>
              <li>Move important documents to a waterproof bag on a high shelf.</li>
              <li>Stock drinking water and non-perishable food for 3 days.</li>
              <li>Keep flashlights and battery radios fully charged.</li>
              <li>Avoid going to sea until the alert is lifted.</li>
            </ul>
          </div>

          {/* Evacuation */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#1a1a1a' }}>
              <Navigation size={20} color="#3b82f6" /> Evacuation Plan
            </h3>
            <p style={{ color: '#555', lineHeight: 1.7, fontSize: '0.9rem', marginBottom: '1rem' }}>
              If a <strong>Red Alert</strong> is issued, move to your primary shelter immediately without delay.
            </p>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginBottom: '0.75rem' }}>
              <strong style={{ color: '#1d4ed8', fontSize: '0.85rem' }}>Primary Shelter</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#555', fontSize: '0.85rem' }}>Panaji Community Hall · 1.2 km away</p>
            </div>
            <div style={{ background: '#f0fce8', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '1rem' }}>
              <strong style={{ color: '#15803d', fontSize: '0.85rem' }}>Alternate Shelter</strong>
              <p style={{ margin: '0.25rem 0 0', color: '#555', fontSize: '0.85rem' }}>St. Inez School · 2.1 km away</p>
            </div>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
          {/* Emergency Contacts */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <Phone size={20} color="#f26b1d" /> Emergency Contacts
            </h3>
            {[
              { label: 'Disaster Helpline', number: '1070', color: '#ef4444' },
              { label: 'Ambulance', number: '108', color: '#ef4444' },
              { label: 'Fire Brigade', number: '101', color: '#f26b1d' },
              { label: 'Local Coordinator', number: '98765 43210', color: '#5cb82b' },
            ].map((c, i, arr) => (
              <div key={c.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: i < arr.length - 1 ? '0.75rem' : 0, marginBottom: i < arr.length - 1 ? '0.75rem' : 0, borderBottom: i < arr.length - 1 ? '1px solid #f0f0ec' : 'none' }}>
                <span style={{ fontSize: '0.875rem', color: '#555' }}>{c.label}</span>
                <span style={{ fontWeight: 700, color: c.color, fontSize: '0.875rem' }}>{c.number}</span>
              </div>
            ))}
          </div>

          {/* Resources */}
          <div style={{ background: 'white', border: '1px solid #e0e2da', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <FileText size={20} color="#8b5cf6" /> My Resources
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: 1.6, marginBottom: '1rem' }}>
              You have listed a <strong style={{ color: '#1a1a1a' }}>motorboat</strong> and <strong style={{ color: '#1a1a1a' }}>first-aid kit</strong>. The community may request your help during a crisis.
            </p>
            <div style={{ background: '#faf5ff', border: '1px solid #ddd6fe', borderRadius: '8px', padding: '0.875rem', fontSize: '0.85rem', color: '#7c3aed', marginBottom: '1rem' }}>
              ✓ Status: Available for community use
            </div>
            <button style={{ width: '100%', background: 'transparent', border: '1px solid #e0e2da', borderRadius: '8px', padding: '0.7rem', fontWeight: 600, cursor: 'pointer', color: '#555', fontSize: '0.875rem', transition: 'all 0.15s' }}
              onMouseOver={e => e.currentTarget.style.background = '#f3f4ee'}
              onMouseOut={e => e.currentTarget.style.background = 'transparent'}
            >
              Update Resource Status
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdPlan;
