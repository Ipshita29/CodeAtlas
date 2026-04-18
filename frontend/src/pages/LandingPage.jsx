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
              <span className="mono-label" style={{ fontSize: '10px' }}>AI REPOSITORY INTELLIGENCE</span>
            </div>
          </div>

          <h1 className="mb-12">
            DECODE THE <br />
            <span className="text-primary">STRUCTURE</span>
          </h1>

          <p className="mb-12" style={{ fontSize: '1.25rem', color: 'rgba(255,255,255,0.6)', fontWeight: 300, lineHeight: 1.6, maxWidth: '600px' }}>
            CodeAtlas is a high-precision analyzer for elite engineers. Navigate complex codebases with machine-learning insights and architecture mapping.
          </p>
          
          <div style={{ display: 'flex', gap: '24px' }}>
            <Link to="/dashboard">
              <Button>
                INITIALIZE SYSTEM <ArrowRight size={18} />
              </Button>
            </Link>
            <Button variant="secondary">DOCUMENTATION</Button>
          </div>
        </div>

        {/* Right Column */}
        <div className="hud-modules">
          {[
            { icon: Cpu, title: "ANALYZER", status: "ONLINE", id: "01-X" },
            { icon: Network, title: "MAPPING", status: "READY", id: "02-Y" },
            { icon: Database, title: "CONTEXT", status: "STABLE", id: "03-Z" },
            { icon: Zap, title: "INSIGHTS", status: "ACTIVE", id: "04-W" }
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
          { id: "01", title: "SCHEMA ANALYSIS", desc: "Automated extraction of database schemas and entity relationships." },
          { id: "02", title: "LOGIC FLOW", desc: "Mapping of cross-component interactions and data propagation paths." },
          { id: "03", title: "OPTIMIZATION", desc: "AI-driven suggestions for structural refactoring and performance." }
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
