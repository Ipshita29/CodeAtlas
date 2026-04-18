import { useState } from "react";
import { Button } from "../components/Button";
import { Card } from "../components/Card";
import { Search, Upload, FileCode, CheckCircle, AlertTriangle } from "lucide-react";

const BACKEND_URL = "http://localhost:5001";

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
    <div className="pt-32 pb-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h2 className="text-4xl mb-2">SYSTEM DASHBOARD</h2>
          <p className="text-white/40 font-mono text-xs tracking-widest">STATION_ALPHA // REPO_ANALYSIS_MODULE</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <Card title="GHT_ACCESS" className="lg:col-span-2">
            <p className="text-white/40 text-xs mb-6 font-mono">ENTER PUBLIC GITHUB URL FOR ARCHITECTURE EXTRACTION</p>
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/20" size={18} />
                <input 
                  type="text" 
                  className="w-full bg-white/5 border-b-2 border-white/10 px-12 py-4 outline-none focus:border-[#ff8f6f] transition-colors font-mono text-sm"
                  placeholder="https://github.com/user/repo"
                  value={repoUrl}
                  onChange={(e) => setRepoUrl(e.target.value)}
                />
              </div>
              <Button onClick={analyzeRepo} disabled={isAnalyzing}>
                {isAnalyzing ? "WORKING..." : "ANALYZE"}
              </Button>
            </div>
          </Card>

          <Card title="PKG_UPLOAD">
            <p className="text-white/40 text-xs mb-6 font-mono">UPLOAD LOCAL ZIP PACKAGE</p>
            <div className="flex flex-col gap-4">
              <label className="w-full bg-white/5 border border-dashed border-white/10 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-white/10 transition-colors">
                <Upload size={24} className="text-[#ff8f6f]" />
                <span className="text-[10px] font-mono opacity-60">
                  {file ? file.name : "SELECT .ZIP FILE"}
                </span>
                <input 
                  type="file" 
                  className="hidden" 
                  accept=".zip"
                  onChange={(e) => setFile(e.target.files[0])}
                />
              </label>
              <Button onClick={uploadZip} variant="secondary" disabled={isAnalyzing}>
                PROCESS PACKAGE
              </Button>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-4">
            <Card title="SYS_LOGS">
              <div className="space-y-4">
                {[
                  { label: "CONNECTION", status: "STABLE", icon: CheckCircle, color: "text-green-500" },
                  { label: "CORE_ENGINE", status: "ACTIVE", icon: CheckCircle, color: "text-green-500" },
                  { label: "MEMORY_USAGE", status: "NOMINAL", icon: CheckCircle, color: "text-green-500" },
                  { label: "API_QUOTA", status: "92%", icon: AlertTriangle, color: "text-yellow-500" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-[10px] font-mono">
                    <span className="opacity-40">{item.label}</span>
                    <div className="flex items-center gap-2">
                      <span className={item.color}>{item.status}</span>
                      <item.icon size={10} className={item.color} />
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card title="PROCESS_OUTPUT">
              <div className="bg-black/50 p-6 font-mono text-sm leading-relaxed overflow-auto max-h-[600px] border border-white/5">
                <pre className="text-white/80 whitespace-pre-wrap">
                  {output || "AWAITING_INPUT..."}
                </pre>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
