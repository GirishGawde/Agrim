import React, { createContext, useContext, useState, useEffect } from 'react';

// ─── Synthetic demo users — no real data ────────────────────────
const DEMO_USERS = {
  'authority@demo.goa': { id: 'auth-01', name: 'Authority Sharma', role: 'authority', password: 'demo1234' },
  'volunteer@demo.goa': { id: 'vol-01',  name: 'Arjun Naik',      role: 'volunteer', password: 'demo1234' },
  'citizen@demo.goa':   { id: 'cit-01',  name: 'Meera D',         role: 'citizen',   password: 'demo1234' },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Restore session from localStorage (mock token = JSON-encoded user)
    try {
      const raw = localStorage.getItem('agrim_token');
      if (raw) setUser(JSON.parse(atob(raw)));
    } catch { /* invalid token, ignore */ }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const found = DEMO_USERS[email];
    if (!found || found.password !== password) throw new Error('Invalid credentials');
    const { password: _, ...userObj } = found;
    setUser(userObj);
    // Encode as base64 so api.js can read it as a "token"
    localStorage.setItem('agrim_token', btoa(JSON.stringify(userObj)));
    return userObj;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('agrim_token');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
