import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Search, Upload, Shield } from "lucide-react";

const BACKEND_URL = "http://127.0.0.1:5001";

export const Dashboard = () => {
  const [repoUrl, setRepoUrl] = useState("");
  const [output, setOutput] = useState("");
  const [file, setFile] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const analyzeRepo = async () => {
    if (!repoUrl) return;
    setIsAnalyzing(true);
    setOutput("Starting analysis...\nConnecting to code...");

    try {
      const res = await fetch(`${BACKEND_URL}/repo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl }),
      });
      const data = await res.json();
      if (data.success) {
        formatOutput(data);
      } else {
        setOutput(`Scan Error\nMessage: ${data.message}`);
      }
    } catch (err) {
      setOutput(`System Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const uploadZip = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setOutput("Uploading code...\nReading files...");

    const formData = new FormData();
    formData.append("zipFile", file);

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        formatOutput(data);
      } else {
        setOutput(`Upload Error\nMessage: ${data.message}`);
      }
    } catch (err) {
      setOutput(`System Error: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatOutput = (data) => {
    let text = `Analysis Finished\n-----------------\n`;
    text += `Project Structure:\n${data.architecture}\n\n`;
    text += `Documentation Health: ${data.readmeStatus}\n\n`;
    if (data.updatedReadme) {
      text += `Suggested Readme:\n${data.updatedReadme}`;
    }
    setOutput(text);
  };

  return (
    <div className="container">
      <div className="mb-12" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={14} style={{ color: 'var(--primary)' }} />
            <span className="mono-label" style={{ fontSize: '10px' }}>ANALYSIS TOOL</span>
          </div>
          <h2 style={{ fontSize: '4rem', fontWeight: 900 }}>ANALYZE <span style={{ color: 'var(--primary)' }}>PROJECT</span></h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="mono-label" style={{ fontSize: '10px', opacity: 0.4 }}>STATUS: CONNECTED</span>
          <p className="mono-label" style={{ fontSize: '9px', opacity: 0.2, marginTop: '4px' }}>SECURE CONNECTION</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexCol: 'column', gap: '32px', flexDirection: 'column' }}>
          <Card title="IMPORT FROM GITHUB" id="CA-REC-A">
            <p className="mono-label" style={{ fontSize: '10px', opacity: 0.4, marginBottom: '32px' }}>ENTER A GITHUB LINK TO SCAN YOUR PROJECT</p>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', opacity: 0.2 }} size={18} />
                <input
                  type="text"
                  style={{ width: '100%', backgroundColor: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)', padding: '20px 16px 20px 52px', color: 'var(--primary)', fontFamily: 'var(--font-mono)', fontSize: '14px', outline: 'none' }}
                  placeholder="https://github.com/user/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <Button onClick={analyzeRepo} disabled={isAnalyzing}>
                {isAnalyzing ? "ANALYZING..." : "START SCAN"}
              </Button>
            </div>
          </Card>

          <Card title="ANALYSIS RESULTS" id="CA-REC-B">
            <div style={{ backgroundColor: '#000', padding: '32px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '400px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6 }}>
              <pre style={{ color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap' }}>
                {output || "Ready to scan..."}
              </pre>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card title="UPLOAD FILES" id="CA-REC-C">
            <p className="mono-label" style={{ fontSize: '10px', opacity: 0.4, marginBottom: '24px' }}>UPLOAD A ZIP FILE OF YOUR CODE</p>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', height: '160px', border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
              <Upload size={24} style={{ color: 'var(--primary)', opacity: 0.4 }} />
              <span className="mono-label" style={{ fontSize: '9px', opacity: 0.4 }}>{file ? file.name : "SELECT A .ZIP FILE"}</span>
              <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} accept=".zip" />
            </label>
            <Button onClick={uploadZip} variant="secondary" style={{ width: '100%', marginTop: '16px' }} disabled={isAnalyzing}>
              UPLOAD AND SCAN
            </Button>
          </Card>

          <Card title="SYSTEM HEALTH" id="CA-REC-D">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: "SERVER", status: "STABLE", val: 100 },
                { label: "NETWORK", status: "NOMINAL", val: 100 },
                { label: "MEMORY", status: "98.2%", val: 98 }
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span className="mono-label" style={{ fontSize: '9px', opacity: 0.4 }}>{item.label}</span>
                    <span className="mono-label" style={{ fontSize: '9px', color: '#22c55e' }}>{item.status}</span>
                  </div>
                  <div style={{ height: '2px', backgroundColor: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ height: '100%', width: `${item.val}%`, backgroundColor: 'var(--primary)' }}></div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
