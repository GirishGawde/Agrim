import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Bell, Map, HeartHandshake, BookOpen, ClipboardList,
  LogOut, Sun, Moon, Wifi, WifiOff, Menu, X, ShieldAlert
} from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const NAV_ITEMS = [
  { to: '/dashboard',  label: 'Dashboard',         icon: LayoutDashboard, roles: ['authority'] },
  { to: '/alerts',     label: 'Alert Approval',     icon: Bell,            roles: ['authority'] },
  { to: '/shelters',   label: 'Shelters & Resources', icon: Map,           roles: ['authority', 'volunteer'] },
  { to: '/recovery',   label: 'Recovery Tracker',   icon: HeartHandshake,  roles: ['authority', 'volunteer', 'citizen'] },
  { to: '/lessons',    label: 'Lessons Learned',    icon: BookOpen,        roles: ['authority'] },
  { to: '/tasks',      label: 'My Tasks',           icon: ClipboardList,   roles: ['volunteer'] },
];

export function Navbar({ theme, onThemeToggle, lowBw, onLowBwToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const visibleItems = NAV_ITEMS.filter(n => !user || n.roles.includes(user.role));

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const NavItem = ({ item }) => (
    <NavLink
      to={item.to}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150
        ${isActive
          ? 'bg-primary-900/60 text-primary-300 border border-primary-700/50'
          : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200 border border-transparent'}`
      }
      aria-current={({ isActive }) => isActive ? 'page' : undefined}
    >
      <item.icon size={18} aria-hidden />
      {item.label}
    </NavLink>
  );

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:flex flex-col w-60 min-h-screen bg-surface-card border-r border-surface-border p-4 gap-2 fixed left-0 top-0 z-30">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 pb-4 border-b border-surface-border mb-2">
          <ShieldAlert size={24} className="text-primary-400" aria-hidden />
          <span className="text-lg font-bold text-slate-100">Agrim</span>
          <span className="ml-auto text-xs bg-primary-900/60 text-primary-300 px-2 py-0.5 rounded-full border border-primary-700/40">
            Module 5
          </span>
        </div>

        {/* Nav items */}
        <nav aria-label="Main navigation" className="flex-1 flex flex-col gap-1">
          {visibleItems.map(item => <NavItem key={item.to} item={item} />)}
        </nav>

        {/* Bottom controls */}
        <div className="border-t border-surface-border pt-3 space-y-2">
          {/* Low bandwidth toggle */}
          <button
            onClick={onLowBwToggle}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-700/50 transition-colors"
            aria-pressed={lowBw}
            title="Toggle low-bandwidth mode (disables animations)"
          >
            {lowBw ? <WifiOff size={16} aria-hidden /> : <Wifi size={16} aria-hidden />}
            {lowBw ? 'Low-BW on' : 'Low-BW off'}
          </button>

          {/* Theme toggle */}
          <button
            onClick={onThemeToggle}
            className="flex items-center gap-2 w-full px-3 py-2 rounded-xl text-sm text-slate-400 hover:bg-slate-700/50 transition-colors"
            aria-label="Toggle dark/light mode"
          >
            {theme === 'dark' ? <Sun size={16} aria-hidden /> : <Moon size={16} aria-hidden />}
            {theme === 'dark' ? 'Light mode' : 'Dark mode'}
          </button>

          {/* User + logout */}
          {user && (
            <div className="flex items-center gap-2 px-3 py-2">
              <div className="w-7 h-7 rounded-full bg-primary-700 flex items-center justify-center text-xs font-bold text-primary-100 shrink-0">
                {user.name[0]}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-200 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 capitalize">{user.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="ml-auto p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-900/30 transition-colors"
                aria-label="Log out"
              >
                <LogOut size={15} aria-hidden />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile topbar ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-surface-card border-b border-surface-border px-4 h-14 flex items-center gap-3">
        <ShieldAlert size={22} className="text-primary-400" aria-hidden />
        <span className="text-base font-bold text-slate-100 flex-1">Agrim</span>
        <button onClick={() => setOpen(!open)} aria-label="Toggle menu" className="p-2 rounded-lg hover:bg-slate-700/50">
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </header>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden fixed inset-0 z-30 bg-black/60" onClick={() => setOpen(false)}>
          <nav
            className="absolute top-14 left-0 bottom-0 w-64 bg-surface-card border-r border-surface-border p-4 flex flex-col gap-1"
            onClick={e => e.stopPropagation()}
            aria-label="Mobile navigation"
          >
            {visibleItems.map(item => <NavItem key={item.to} item={item} />)}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 mt-auto px-3 py-2 rounded-xl text-sm text-red-400 hover:bg-red-900/30 transition-colors"
              >
                <LogOut size={16} aria-hidden /> Log out ({user.name})
              </button>
            )}
          </nav>
        </div>
      )}
    </>
  );
}
