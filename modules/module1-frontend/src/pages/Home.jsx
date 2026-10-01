import React from 'react';
import { AlertTriangle, Info, BellRing, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="page-container container page-transition">
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 className="gradient-text">Stay Safe, Stay Informed</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.125rem', maxWidth: '600px', margin: '0 auto' }}>
          Real-time hazard alerts and safety planning for your community.
        </p>
      </div>

      <div className="grid md:grid-cols-2">
        <div className="glass-panel" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
            <div style={{ background: 'rgba(239, 68, 68, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
              <AlertTriangle color="var(--danger-color)" size={28} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.5rem', margin: 0 }}>High Risk Area</h2>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Patto-Panaji</p>
            </div>
          </div>
          
          <div style={{ background: 'rgba(0,0,0,0.2)', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
            <h4 style={{ color: 'var(--danger-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <BellRing size={16} /> Flood Warning
            </h4>
            <p style={{ margin: 0, fontSize: '0.9rem', lineHeight: '1.5' }}>
              Heavy rainfall expected over the next 12 hours. Water levels in Patto area are rising rapidly. Please prepare to move to higher ground.
            </p>
          </div>

          <Link to="/map" className="btn btn-primary" style={{ width: '100%' }}>
            View Live Map
          </Link>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
             <div style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
              <Info color="var(--primary-color)" size={24} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Your Household Plan</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                Review your personalized action plan based on your location.
              </p>
              <Link to="/plan" style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                View Plan &rarr;
              </Link>
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
             <div style={{ background: 'rgba(245, 158, 11, 0.2)', padding: '0.75rem', borderRadius: '50%' }}>
              <MapPin color="var(--warning-color)" size={24} />
            </div>
            <div>
              <h3 style={{ marginBottom: '0.5rem' }}>Report a Hazard</h3>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                See a blocked road or rising water? Let the community know.
              </p>
              <Link to="/report" style={{ fontWeight: 600, color: 'var(--warning-color)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                Submit Report &rarr;
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
