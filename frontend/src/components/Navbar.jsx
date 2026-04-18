import { NavLink } from "react-router-dom";
import { Terminal, LayoutDashboard, MessageSquare, Shield } from "lucide-react";

export const Navbar = () => {
  const linkStyles = "flex items-center gap-2 px-4 py-6 text-xs font-mono tracking-widest transition-all duration-300 relative group";
  const activeStyles = "text-[#ff8f6f]";

  return (
    <nav className="fixed top-0 left-0 w-full h-16 glass z-50 flex items-center justify-between px-8 border-b border-white/5">
      <div className="flex items-center gap-3">
        <div className="bg-[#ff8f6f] p-1">
          <Terminal size={20} color="black" />
        </div>
        <span className="font-black text-lg tracking-tighter">CODEATLAS</span>
        <span className="text-[10px] font-mono opacity-40 ml-2 pt-1">V3.1.0_PRO</span>
      </div>

      <div className="flex items-center">
        <NavLink 
          to="/" 
          className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : "text-white/60"}`}
        >
          <Shield size={14} />
          <span>INIT</span>
          <div className="absolute left-0 bottom-0 w-full h-[2px] bg-[#ff8f6f] scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-20"></div>
        </NavLink>
        
        <NavLink 
          to="/dashboard" 
          className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : "text-white/60"}`}
        >
          <LayoutDashboard size={14} />
          <span>ANALYZE</span>
          <div className="absolute left-0 bottom-0 w-full h-[2px] bg-[#ff8f6f] scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-20"></div>
        </NavLink>

        <NavLink 
          to="/chat" 
          className={({ isActive }) => `${linkStyles} ${isActive ? activeStyles : "text-white/60"}`}
        >
          <MessageSquare size={14} />
          <span>INTELLIGENCE</span>
          <div className="absolute left-0 bottom-0 w-full h-[2px] bg-[#ff8f6f] scale-x-0 group-hover:scale-x-100 transition-transform origin-left opacity-20"></div>
        </NavLink>
      </div>

      <div className="hidden md:block">
        <div className="flex items-center gap-4 text-[10px] font-mono opacity-40">
          <span>LATENCY: 12MS</span>
          <span>STATION: 08-ALPHA</span>
        </div>
      </div>
    </nav>
  );
};
