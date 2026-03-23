import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { db } from "./db/connection.js";

dotenv.config();
import { execSync } from "child_process";
import fs from "fs";
import path from "path";
import multer from "multer";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors({ origin: ["http://localhost:5173", "http://127.0.0.1:5173"] }));

app.use(express.json());

// Log every request to help debug
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Ensure required directories exist
const tempBase = path.join(__dirname, "temp");
const uploadBase = path.join(__dirname, "uploads");
if (!fs.existsSync(tempBase)) fs.mkdirSync(tempBase);
if (!fs.existsSync(uploadBase)) fs.mkdirSync(uploadBase);

const upload = multer({ dest: "uploads/" });


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/test-db", async (req, res) => {
  try {
    console.log("database connected successfully.");
    res.json({ success: true, message: "DB Route working" });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: e.message });
  }
});

// Helper function to process files
const processFiles = (dir) => {
  const result = {
    totalFiles: 0,
    files: [], // we will store objects here {name: 'file.js', path: 'src/file.js', lines: 10, content: '...'}
  };

  const traverse = (currentDir, relativeDir = "") => {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (file === ".git" || file === "node_modules") continue;
      const fullPath = path.join(currentDir, file);
      const relPath = path.join(relativeDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath, relPath);
      } else {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n").length;
        result.totalFiles++;
        result.files.push({
          name: file,
          path: relPath,
          lines: lines,
          content: content.substring(0, 500)
        });
      }
    }
  };

  traverse(dir);
  return result;
};

// 1. ARCHITECTURE OVERVIEW (AI POWERED):
async function getArchitecture(files) {
  // list top level files and folders to give AI context
  let fileContext = files
    .filter(f => f.path.split(path.sep).length <= 2)
    .map(f => f.path)
    .slice(0, 40)
    .join("\n");

  let prompt = `Analyze this list of files from a repository and determine the architecture and technology stack.
Files:
${fileContext}

Return a concise explaination (student-level) like:
"This project is a [Type].
It uses: [Tech]
Flow: [Simplified Flow]"

Be very accurate. If it is not Node.js, do not say it is Node.js. Check for py, java, cpp, etc.
Keep it simple and beginner friendly.`;

  console.log("Calling Gemini for accurate Architecture Detection...");

  if (!process.env.GEMINI_API_KEY) {
      return "AI Key missing. (Node.js/Python guess could go here)";
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    if (response.data && response.data.candidates && response.data.candidates[0].content) {
        return response.data.candidates[0].content.parts[0].text;
    }
    return "Could not determine architecture accurately.";
  } catch (err) {
    console.log("Arch AI Error:", err.message);
    return "Error detecting architecture.";
  }
}

// 2. README LOGIC:
function checkReadme(files) {
  let readmeFile = files.find(f => f.name.toLowerCase() === "readme.md");

  if (!readmeFile) {
    return { status: "missing", content: null };
  }

  let content = readmeFile.content;
  let lines = content.split("\n").length;
  
  let hasKeywords = content.toLowerCase().includes("install") || 
                    content.toLowerCase().includes("usage") || 
                    content.toLowerCase().includes("setup");

  if (lines < 50 || !hasKeywords) {
    return { status: "needs improvement", content: content };
  }

  return { status: "good", content: content };
}

// 3. GENERATE README (AI CALL)
async function generateReadmeAI(files, tech) {
  let mainFiles = files.slice(0, 15).map(f => f.name).join(", ");
  
  let prompt = `Make a very simple README.md for this coding project.
Tech stack: ${tech}
Main files: ${mainFiles}

Keep it clean, easy instructions for students. Use simple markdown.`;

  console.log("Calling Gemini API for README...");

  if (!process.env.GEMINI_API_KEY) {
      console.log("No API Key found in .env");
      return `# Project README\n\nThis is a ${tech} project.\n\nFiles found: ${mainFiles}.\n\n(Add GEMINI_API_KEY to .env for AI generation)`;
  }

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    if (response.data && response.data.candidates && response.data.candidates[0].content) {
        return response.data.candidates[0].content.parts[0].text;
    } else {
        return "AI response structure unexpected. Check API key.";
    }
  } catch (err) {
    console.log("AI API Error:", err.response ? err.response.data : err.message);
    return "Could not generate README. Please check if your API key is valid.";
  }
}

app.post("/repo", async (req, res) => {
  const { repoUrl } = req.body;
  const tempDir = path.join(__dirname, "temp", Date.now().toString());

  try {
    if (!fs.existsSync(path.join(__dirname, "temp"))) {
      fs.mkdirSync(path.join(__dirname, "temp"));
    }

    console.log(`Cloning ${repoUrl} to ${tempDir}`);
    execSync(`git clone --depth 1 ${repoUrl} ${tempDir}`);

    const processed = processFiles(tempDir);
    
    // get architecture (now async)
    const arch = await getArchitecture(processed.files);
    
    // check readme
    const readmeStatus = checkReadme(processed.files);
    
    let updatedReadme = null;
    if (readmeStatus.status === "missing" || readmeStatus.status === "needs improvement") {
      updatedReadme = await generateReadmeAI(processed.files, arch);
    }

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });

    res.json({ 
      success: true, 
      architecture: arch,
      readmeStatus: readmeStatus.status,
      updatedReadme: updatedReadme,
      totalFiles: processed.totalFiles
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.post("/upload", upload.single("zipFile"), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: "No file uploaded" });
  }

  const tempDir = path.join(__dirname, "temp", Date.now().toString());

  try {
    const zip = new AdmZip(req.file.path);
    zip.extractAllTo(tempDir, true);

    const processed = processFiles(tempDir);

    // architecture & readme logic
    const arch = await getArchitecture(processed.files);
    const readmeStatus = checkReadme(processed.files);
    
    let updatedReadme = null;
    if (readmeStatus.status === "missing" || readmeStatus.status === "needs improvement") {
      updatedReadme = await generateReadmeAI(processed.files, arch);
    }

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      architecture: arch,
      readmeStatus: readmeStatus.status,
      updatedReadme: updatedReadme,
      totalFiles: processed.totalFiles
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));