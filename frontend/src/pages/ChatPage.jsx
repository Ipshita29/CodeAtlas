import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { MessageSquare, Send, Sparkles, Brain, Code } from "lucide-react";

const BACKEND_URL = "http://localhost:5001";

export const ChatPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    { role: "system", content: "INTELLIGENCE_MODULE_LOADED. I am ready to analyze your repository suggestions." }
  ]);

  useEffect(() => {
    fetchSuggestions();
  }, []);

  const fetchSuggestions = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/suggestions`);
      const data = await res.json();
      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 px-8 h-screen flex flex-col">
      <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col overflow-hidden">
        <div className="mb-8">
          <h2 className="text-4xl mb-2">INTELLIGENCE UNIT</h2>
          <p className="text-white/40 font-mono text-xs tracking-widest">STATION_ALPHA // AI_SUGGESTIONS_ENGINE</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 flex-1 overflow-hidden">
          {/* Suggestions Sidebar */}
          <div className="lg:col-span-1 flex flex-col gap-6 overflow-hidden">
            <Card title="SUGGESTIONS_FEED" className="flex-1 flex flex-col overflow-hidden">
              <div className="overflow-y-auto pr-2 space-y-4">
                {isLoading ? (
                  <div className="text-[10px] font-mono opacity-40 animate-pulse">POLLING_DATA...</div>
                ) : suggestions.length === 0 ? (
                  <div className="text-[10px] font-mono opacity-40">NO_DATA_FOUND. INITIALIZE_ANALYSIS.</div>
                ) : (
                  suggestions.map((s, i) => (
                    <div 
                      key={i} 
                      className="p-4 bg-white/5 border-l-2 border-[#ff8f6f]/20 hover:border-[#ff8f6f] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 mb-2 text-[#ff8f6f]">
                        <Sparkles size={12} />
                        <span className="text-[10px] font-mono font-bold tracking-tighter">SUGGESTION_{i+1}</span>
                      </div>
                      <p className="text-xs text-white/80 font-medium mb-3">{s.text}</p>
                      {s.files && (
                        <div className="flex flex-wrap gap-1">
                          {s.files.map((f, idx) => (
                            <span key={idx} className="text-[8px] font-mono bg-white/10 px-1 py-0.5 opacity-60">
                              {f.split('/').pop()}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
              <Button onClick={fetchSuggestions} variant="secondary" className="mt-6 w-full py-2">
                REFRESH_FEED
              </Button>
            </Card>
          </div>

          {/* Chat Interface */}
          <div className="lg:col-span-3 flex flex-col gap-6 overflow-hidden">
            <Card title="NEURAL_INTERFACE" className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto pr-2 space-y-6 mb-6">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[80%] p-4 ${msg.role === 'user' ? 'bg-[#ff8f6f] text-black' : 'bg-white/5 border border-white/5'}`}>
                      <div className="flex items-center gap-2 mb-2 opacity-60">
                        {msg.role === 'user' ? <Brain size={12} /> : <Cpu size={12} />}
                        <span className="text-[8px] font-mono uppercase">{msg.role === 'user' ? 'USER_INPUT' : 'SYSTEM_READOUT'}</span>
                      </div>
                      <p className="text-sm font-light leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <div className="flex-1 relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border-b-2 border-white/10 px-12 py-4 outline-none focus:border-[#ff8f6f] transition-colors font-mono text-sm"
                    placeholder="QUERY SYSTEM..."
                  />
                </div>
                <Button className="px-8">
                  <Send size={18} />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Cpu = ({ size, className }) => (
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
    <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
    <rect x="9" y="9" width="6" height="6"></rect>
    <line x1="9" y1="1" x2="9" y2="4"></line>
    <line x1="15" y1="1" x2="15" y2="4"></line>
    <line x1="9" y1="20" x2="9" y2="23"></line>
    <line x1="15" y1="20" x2="15" y2="23"></line>
    <line x1="20" y1="9" x2="23" y2="9"></line>
    <line x1="20" y1="15" x2="23" y2="15"></line>
    <line x1="1" y1="9" x2="4" y2="9"></line>
    <line x1="1" y1="15" x2="4" y2="15"></line>
  </svg>
);
