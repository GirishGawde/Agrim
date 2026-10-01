import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { ShieldAlert, LogIn, Sparkles, CheckCircle2 } from 'lucide-react';
import { ParticlesBg, Meteors, BorderBeam, ShimmerButton, CardSpotlight } from '../components/inspira/index.js';

const DEMO_ACCOUNTS = [
  { email: 'authority@demo.goa', role: 'Authority', hint: 'War Room Dashboard + Alert Approval' },
  { email: 'volunteer@demo.goa', role: 'Volunteer', hint: 'Field Tasks + Shelters + Resource Pickup' },
  { email: 'citizen@demo.goa',   role: 'Citizen',   hint: 'Post-Disaster Recovery & Damage Tracker' },
];

export default function Login() {
  const { login } = useAuth();
  const navigate  = useNavigate();
  const [email, setEmail]       = useState('authority@demo.goa');
  const [password, setPassword] = useState('demo1234');
  const [error, setError]       = useState('');
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const user = await login(email, password);
      // Route to default page per role
      const dest = user.role === 'volunteer' ? '/tasks' : user.role === 'authority' ? '/dashboard' : '/recovery';
      navigate(dest, { replace: true });
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-surface overflow-hidden p-4">
      {/* Inspira UI ParticlesBg constellation effect */}
      <ParticlesBg particleCount={55} particleColor="rgba(96, 165, 250, 0.35)" lineColor="rgba(59, 130, 246, 0.10)" />
      
      {/* Inspira UI Meteors streak in background */}
      <Meteors count={14} />

      <div className="relative z-10 w-full max-w-md space-y-6 animate-slide-up">
        {/* Logo & Headline */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-900/80 to-slate-900 border border-primary-500/40 shadow-lg shadow-primary-950/40 mb-3">
            <ShieldAlert size={34} className="text-primary-400" aria-hidden />
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-100 tracking-tight">
            Agrim <span className="text-primary-400 font-serif font-normal text-2xl">(अग्रिम)</span>
          </h1>
          <p className="text-slate-400 mt-1 text-xs sm:text-sm">
            Disaster Early Warning &amp; Community Recovery · Goa SDMA
          </p>
        </div>

        {/* Card with Inspira BorderBeam */}
        <div className="relative rounded-2xl border border-surface-border bg-surface-card/90 backdrop-blur-md p-6 sm:p-7 space-y-5 shadow-2xl overflow-hidden">
          {/* Glowing animated border beam */}
          <BorderBeam size={280} duration={12} colorFrom="#3b82f6" colorTo="#8b5cf6" borderWidth={1.5} />

          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-100">Sign in to Command Console</h2>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-primary-950/80 text-primary-400 border border-primary-800/50">
              Demo Ready
            </span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-slate-300 mb-1.5">Official Email</label>
              <input
                id="email" type="email" required autoComplete="email"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-surface-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200
                  focus:outline-none focus:border-primary-500 transition-colors shadow-inner"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-slate-300 mb-1.5">Access Credential</label>
              <input
                id="password" type="password" required autoComplete="current-password"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-surface-border rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-slate-200
                  focus:outline-none focus:border-primary-500 transition-colors shadow-inner"
              />
            </div>

            {error && (
              <p className="text-xs text-red-400 bg-red-950/40 border border-red-700/40 rounded-xl px-3 py-2" role="alert">
                {error}
              </p>
            )}

            {/* Inspira ShimmerButton */}
            <ShimmerButton
              type="submit"
              disabled={loading}
              shimmerColor="#93c5fd"
              background="linear-gradient(135deg, rgba(37, 99, 235, 0.95), rgba(29, 78, 216, 0.95))"
              className="w-full py-3 rounded-xl text-white font-bold text-xs sm:text-sm shadow-lg shadow-primary-950/50"
            >
              <LogIn size={15} aria-hidden />
              {loading ? 'Authenticating...' : 'Sign In to Operations'}
            </ShimmerButton>
          </form>

          {/* Demo Account Quick-Fill */}
          <div className="border-t border-surface-border pt-4">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-xs font-semibold text-slate-400">1-Click Role Switcher</span>
              <span className="text-[10px] text-slate-500 font-mono">pwd: demo1234</span>
            </div>
            <div className="space-y-2">
              {DEMO_ACCOUNTS.map(acc => {
                const isActive = email === acc.email;
                return (
                  <button
                    key={acc.email}
                    type="button"
                    onClick={() => { setEmail(acc.email); setPassword('demo1234'); }}
                    className={`w-full text-left flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl border transition-all cursor-pointer ${
                      isActive
                        ? 'bg-primary-950/60 border-primary-600/70 text-white shadow-sm'
                        : 'border-surface-border bg-slate-900/40 text-slate-300 hover:bg-slate-800/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-primary-400">{acc.role}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{acc.email}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5">{acc.hint}</p>
                    </div>
                    {isActive && <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-500">
          Synthetic test telemetry · No real citizen PII used · Sankalp Setu Hackathon 2026
        </p>
      </div>
    </div>
  );
}
