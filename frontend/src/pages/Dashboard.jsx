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
    setOutput("SYSTEM_STATUS: INITIALIZING_ANALYSIS...\nACCESSING_REPOSITORY...");

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
        setOutput(`ERROR_CODE: 0xFD\nMESSAGE: ${data.message}`);
      }
    } catch (err) {
      setOutput(`SYSTEM_FAULT: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const uploadZip = async () => {
    if (!file) return;
    setIsAnalyzing(true);
    setOutput("SYSTEM_STATUS: UPLOADING_PACKAGE...\nEXTRACTING_DATA...");

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
        setOutput(`ERROR_CODE: 0xFE\nMESSAGE: ${data.message}`);
      }
    } catch (err) {
      setOutput(`SYSTEM_FAULT: ${err.message}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const formatOutput = (data) => {
    let text = `ANALYSIS_COMPLETE\n-----------------\n`;
    text += `ARCHITECTURE_MAP:\n${data.architecture}\n\n`;
    text += `README_STABILITY: ${data.readmeStatus}\n\n`;
    if (data.updatedReadme) {
      text += `PROPOSED_DOCUMENTATION:\n${data.updatedReadme}`;
    }
    setOutput(text);
  };

  return (
    <div className="container">
      <div className="mb-12" style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '32px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <Shield size={14} style={{ color: 'var(--primary)' }} />
            <span className="mono-label" style={{ fontSize: '10px' }}>RECON_MODULE_01</span>
          </div>
          <h2 style={{ fontSize: '4rem', fontWeight: 900 }}>ANALYZE <span style={{ color: 'var(--primary)' }}>STATION</span></h2>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span className="mono-label" style={{ fontSize: '10px', opacity: 0.4 }}>UPLINK_STATUS: SECURE</span>
          <p className="mono-label" style={{ fontSize: '9px', opacity: 0.2, marginTop: '4px' }}>ENCRYPTION: AES-256-GCM</p>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        <div style={{ display: 'flex', flexCol: 'column', gap: '32px', flexDirection: 'column' }}>
          <Card title="GHT_ACCESS_POINT" id="CA-REC-A">
            <p className="mono-label" style={{ fontSize: '10px', opacity: 0.4, marginBottom: '32px' }}>ENTER PUBLIC GITHUB URL FOR ARCHITECTURE SCAN</p>
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
                {isAnalyzing ? "WORKING..." : "INIT_SCAN"}
              </Button>
            </div>
          </Card>

          <Card title="PROCESS_READOUT" id="CA-REC-B">
            <div style={{ backgroundColor: '#000', padding: '32px', border: '1px solid rgba(255,255,255,0.05)', minHeight: '400px', overflowY: 'auto', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: 1.6 }}>
              <pre style={{ color: 'rgba(255,255,255,0.6)', whiteSpace: 'pre-wrap' }}>
                {output || "AWAITING_INPUT_COMMANDS..."}
              </pre>
            </div>
          </Card>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          <Card title="LOCAL_INGESTION" id="CA-REC-C">
            <p className="mono-label" style={{ fontSize: '10px', opacity: 0.4, marginBottom: '24px' }}>UPLOAD ENCRYPTED ZIP PACKAGE</p>
            <label style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', height: '160px', border: '1px dashed rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.02)', cursor: 'pointer' }}>
              <Upload size={24} style={{ color: 'var(--primary)', opacity: 0.4 }} />
              <span className="mono-label" style={{ fontSize: '9px', opacity: 0.4 }}>{file ? file.name : "SELECT .ZIP ARCHIVE"}</span>
              <input type="file" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files[0])} accept=".zip" />
            </label>
            <Button onClick={uploadZip} variant="secondary" style={{ width: '100%', marginTop: '16px' }} disabled={isAnalyzing}>
              PROCESS_PACKAGE
            </Button>
          </Card>

          <Card title="DIAGNOSTICS" id="CA-REC-D">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {[
                { label: "CORE_LINK", status: "STABLE", val: 100 },
                { label: "IO_STREAM", status: "NOMINAL", val: 100 },
                { label: "BUFF_CAP", status: "98.2%", val: 98 }
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
