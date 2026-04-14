import { useState } from "react";
import "./App.css";

function App() {
  const [repoUrl, setRepoUrl] = useState("");
  const [output, setOutput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [file, setFile] = useState(null);

  const BACKEND_URL = "http://localhost:5001";

  // Analyze Repo
  const analyzeRepo = async () => {
    if (!repoUrl) {
      alert("Please enter a repo URL");
      return;
    }

    setOutput("Analyzing repository...");

    try {
      const res = await fetch(`${BACKEND_URL}/repo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ repoUrl }),
      });

      const data = await res.json();

      if (data.success) {
        let text = `Architecture:\n${data.architecture}\n\n`;
        text += `README Status: ${data.readmeStatus}\n\n`;

        if (data.updatedReadme) {
          text += `Updated README:\n${data.updatedReadme}`;
        }

        setOutput(text);
      } else {
        setOutput("Error: " + data.message);
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  // Upload ZIP
  const uploadZip = async () => {
    if (!file) {
      alert("Select a ZIP file");
      return;
    }

    setOutput("Uploading and analyzing...");

    const formData = new FormData();
    formData.append("zipFile", file);

    try {
      const res = await fetch(`${BACKEND_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        let text = `Architecture:\n${data.architecture}\n\n`;
        text += `README Status: ${data.readmeStatus}\n\n`;

        if (data.updatedReadme) {
          text += `Updated README:\n${data.updatedReadme}`;
        }

        setOutput(text);
      } else {
        setOutput("Error: " + data.message);
      }
    } catch (err) {
      setOutput("Error: " + err.message);
    }
  };

  // Get Suggestions
  const getSuggestions = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/suggestions`);
      const data = await res.json();

      setSuggestions(data.suggestions || []);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="container">
      <h1>CodeAtlas</h1>

      {/* Repo Analyzer */}
      <div className="card">
        <h3>Analyze GitHub Repo</h3>
        <input
          type="text"
          placeholder="Enter repo URL"
          value={repoUrl}
          onChange={(e) => setRepoUrl(e.target.value)}
        />
        <button onClick={analyzeRepo}>Analyze</button>
      </div>

      {/* Upload ZIP */}
      <div className="card">
        <h3>Upload ZIP</h3>
        <input
          type="file"
          accept=".zip"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <button onClick={uploadZip}>Upload & Analyze</button>
      </div>

      {/* Suggestions */}
      <div className="card">
        <h3>Suggestions</h3>
        <button onClick={getSuggestions}>Get Suggestions</button>

        <ul>
          {suggestions.map((s, i) => (
            <li key={i}>
              <strong>{s.text}</strong>
              {s.files && s.files.length > 0 && (
                <ul>
                  {s.files.map((f, idx) => (
                    <li key={idx}>{f}</li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* Output */}
      <div className="output">
        <pre>{output}</pre>
      </div>
    </div>
  );
}

export default App;