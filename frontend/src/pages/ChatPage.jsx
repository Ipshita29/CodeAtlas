import { useState, useEffect } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Send, Sparkles, Brain, Cpu, Terminal } from "lucide-react";

const BACKEND_URL = "http://127.0.0.1:5001";

export const ChatPage = () => {
  const [suggestions, setSuggestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [messages] = useState([
    { role: "system", content: "AI is ready. How can I help you with your code today?" }
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
    <div className="container" style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div className="mb-8" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Sparkles size={14} style={{ color: 'var(--primary)' }} />
            <span className="mono-label" style={{ fontSize: '10px' }}>SMART SUGGESTIONS</span>
          </div>
          <h2 style={{ fontSize: '4rem', fontWeight: 900 }}>AI <span style={{ color: 'var(--primary)' }}>BRAIN</span></h2>
        </div>
        <div style={{ padding: '12px 24px', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Brain size={16} style={{ color: 'var(--primary)' }} />
          <span className="mono-label" style={{ fontSize: '10px' }}>STATUS: READY</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', flex: 1, minHeight: 0 }}>
        {/* Suggestions Sidebar */}
        <Card title="AI TIPS" id="CA-INT-A" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px', paddingRight: '8px' }}>
            {suggestions.map((s, i) => (
              <div key={i} style={{ padding: '24px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ width: '24px', height: '24px', border: '1px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)', fontSize: '10px', fontFamily: 'var(--font-mono)' }}>{i+1}</div>
                  <span className="mono-label" style={{ fontSize: '9px', opacity: 0.4 }}>SUGGESTION</span>
                </div>
                <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <Button onClick={fetchSuggestions} variant="secondary" style={{ width: '100%', marginTop: '24px' }}>GET MORE TIPS</Button>
        </Card>

        {/* Chat Interface */}
        <Card title="AI CHAT" id="CA-INT-B" style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '32px', paddingRight: '8px', marginBottom: '32px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{ maxWidth: '80%', padding: '32px', backgroundColor: msg.role === 'user' ? 'var(--primary)' : 'rgba(0,0,0,0.5)', border: msg.role === 'user' ? 'none' : '1px solid rgba(255,255,255,0.05)', color: msg.role === 'user' ? '#000' : '#fff', position: 'relative' }}>
                  {msg.role === 'system' && (
                    <div style={{ position: 'absolute', top: '-12px', left: '24px', padding: '4px 8px', backgroundColor: 'var(--primary)', color: '#000' }}>
                      <Cpu size={14} />
                    </div>
                  )}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px', opacity: 0.4 }}>
                    <span className="mono-label" style={{ fontSize: '8px', color: msg.role === 'user' ? '#000' : 'var(--primary)' }}>{msg.role === 'user' ? 'YOU' : 'AI'}</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: msg.role === 'user' ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.1)' }}></div>
                    <span className="mono-label" style={{ fontSize: '8px', color: msg.role === 'user' ? '#000' : 'var(--primary)' }}>T+{i*2}S</span>
                  </div>
                  <p style={{ fontSize: '0.875rem', lineHeight: 1.6, fontWeight: msg.role === 'user' ? 700 : 300 }}>{msg.content}</p>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '16px' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <Terminal style={{ position: 'absolute', left: '24px', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)', opacity: 0.5 }} size={18} />
              <input 
                type="text" 
                style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '24px 24px 24px 64px', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '14px', outline: 'none' }}
                placeholder="Ask a question about your code..."
              />
            </div>
            <Button style={{ height: '70px', padding: '0 32px' }}><Send size={20} /></Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
