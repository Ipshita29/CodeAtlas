import { Button } from "../components/Button";
import { Link } from "react-router-dom";
import { ArrowRight, Cpu, Network, Database } from "lucide-react";

export const LandingPage = () => {
  return (
    <div className="pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-2 mb-6">
              <span className="bg-[#ff8f6f]/10 text-[#ff8f6f] text-[10px] font-mono px-2 py-1 tracking-widest border border-[#ff8f6f]/20">
                AI REPOSITORY INTELLIGENCE
              </span>
            </div>
            <h1 className="text-6xl md:text-8xl mb-8 leading-[0.9]">
              DECODE THE <br />
              <span className="text-[#ff8f6f]">STRUCTURE</span>
            </h1>
            <p className="text-white/60 text-lg mb-12 max-w-md font-light leading-relaxed">
              CodeAtlas is a high-precision analyzer for elite engineers. Navigate complex codebases with machine-learning insights and architecture mapping.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <Button>
                  INITIALIZE SYSTEM <ArrowRight size={18} />
                </Button>
              </Link>
              <Button variant="secondary">DOCUMENTATION</Button>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-square border border-white/5 bg-gradient-to-br from-[#131313] to-black p-8 relative overflow-hidden">
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-32 h-32 border-t border-r border-[#ff8f6f]/20"></div>
              <div className="absolute bottom-0 left-0 w-32 h-32 border-b border-l border-[#ff8f6f]/20"></div>
              
              <div className="h-full w-full flex flex-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                  {[
                    { icon: Cpu, label: "ANALYZER" },
                    { icon: Network, label: "MAPPING" },
                    { icon: Database, label: "CONTEXT" },
                    { icon: Terminal, label: "INSIGHTS" }
                  ].map((item, i) => (
                    <div key={i} className="bg-white/5 border border-white/5 p-6 flex flex-col items-center gap-3 hover:border-[#ff8f6f]/40 transition-colors group">
                      <item.icon className="text-white/40 group-hover:text-[#ff8f6f] transition-colors" size={32} />
                      <span className="text-[10px] font-mono opacity-40 group-hover:opacity-100">{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-40 grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { title: "SCHEMA ANALYSIS", desc: "Automated extraction of database schemas and entity relationships." },
            { title: "LOGIC FLOW", desc: "Mapping of cross-component interactions and data propagation paths." },
            { title: "OPTIMIZATION", desc: "AI-driven suggestions for structural refactoring and performance." }
          ].map((feature, i) => (
            <div key={i} className="border-t border-white/10 pt-8">
              <span className="text-[#ff8f6f] font-mono text-xs mb-4 block">0{i+1}</span>
              <h3 className="text-xl mb-4">{feature.title}</h3>
              <p className="text-white/40 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Terminal = ({ size, className }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <polyline points="4 17 10 11 4 5"></polyline>
    <line x1="12" y1="19" x2="20" y2="19"></line>
  </svg>
);
