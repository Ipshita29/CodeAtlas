import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Network, Database, Zap } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="container">
      <div className="hero-grid">
        
        {/* Left Column */}
        <div>
          <div className="mb-8" style={{ display: 'inline-block' }}>
            <div style={{ padding: '8px 16px', border: '1px solid rgba(255,143,111,0.2)', backgroundColor: 'rgba(255,143,111,0.05)', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: 'var(--primary)' }}></div>
              <span className="mono-label" style={{ fontSize: '10px' }}>AI CODE ANALYSIS</span>
            </div>
          </div>

          <h1 className="mb-12">
            UNDERSTAND YOUR <br />
            <span className="text-primary">CODE</span>
          </h1>

          <p className="mb-12" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.6, maxWidth: '600px' }}>
            CodeAtlas helps you understand complex codebases. Get clear insights and maps of your project's structure.
          </p>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/dashboard">
              <Button>
                GET STARTED <ArrowRight size={18} />
              </Button>
            </Link>
            <Button variant="secondary">READ GUIDE</Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="hud-modules">
          {[
            { icon: Cpu, title: "SCANNER", status: "ONLINE", id: "01-X" },
            { icon: Network, title: "DIAGRAMS", status: "READY", id: "02-Y" },
            { icon: Database, title: "KNOWLEDGE", status: "STABLE", id: "03-Z" },
            { icon: Zap, title: "IDEAS", status: "ACTIVE", id: "04-W" }
          ].map((module, i) => (
            <div key={i} className="hud-module">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <module.icon style={{ color: 'rgba(255,255,255,0.2)' }} size={32} />
                <span className="mono-label" style={{ fontSize: '8px', opacity: 0.3 }}>{module.id}</span>
              </div>
              <div>
                <h3 style={{ fontSize: '1.25rem', marginBottom: '4px' }}>{module.title}</h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: '6px', height: '6px', backgroundColor: 'var(--primary)', opacity: 0.5 }}></div>
                  <span className="mono-label" style={{ fontSize: '9px', opacity: 0.4 }}>{module.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Footer Features */}
      <div className="feature-grid">
        {[
          { id: "01", title: "DATABASE MAPS", desc: "Automatically see how your database tables connect." },
          { id: "02", title: "CODE PATHS", desc: "See how data moves through your app." },
          { id: "03", title: "IMPROVEMENTS", desc: "Smart tips to make your code better and faster." }
        ].map((item, i) => (
          <div key={i}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', marginBottom: '24px' }}>
              <span style={{ color: 'var(--primary)', fontWeight: 900, fontSize: '1.5rem' }}>{item.id}</span>
              <h3 style={{ fontSize: '1.5rem' }}>{item.title}</h3>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.875rem', lineHeight: 1.6 }}>{item.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
