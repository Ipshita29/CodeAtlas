import { NavLink } from "react-router-dom";
import { Shield, LayoutDashboard, MessageSquare, Activity } from "lucide-react";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '4px', height: '16px', backgroundColor: 'var(--primary)' }}></div>
          <span style={{ fontWeight: 900, fontSize: '1.25rem', letterSpacing: '-0.02em' }}>CODEATLAS</span>
        </div>
        <span className="mono-label" style={{ fontSize: '9px', opacity: 0.3, paddingLeft: '16px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>v3.1.0</span>
      </div>

      <div className="nav-links">
        <NavLink to="/" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Shield size={12} />
          <span>HOME</span>
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={12} />
          <span>ANALYZE</span>
        </NavLink>
        <NavLink to="/chat" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <MessageSquare size={12} />
          <span>CHAT</span>
        </NavLink>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Activity size={12} style={{ color: 'var(--primary)', opacity: 0.5 }} />
          <span className="mono-label" style={{ fontSize: '9px', opacity: 0.3 }}>SERVER: FAST</span>
        </div>
        <div style={{ paddingLeft: '40px', borderLeft: '1px solid rgba(255,255,255,0.1)' }}>
          <span className="mono-label" style={{ fontSize: '9px', opacity: 0.3 }}>CONNECTED</span>
        </div>
      </div>
    </nav>
  );
};
