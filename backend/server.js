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
import os from "os";

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

// Ensure required directories exist in system temp to keep project folder clean
const tempBase = path.join(os.tmpdir(), "codeatlas-temp");
const uploadBase = path.join(os.tmpdir(), "codeatlas-uploads");
if (!fs.existsSync(tempBase)) fs.mkdirSync(tempBase, { recursive: true });
if (!fs.existsSync(uploadBase)) fs.mkdirSync(uploadBase, { recursive: true });

const upload = multer({ dest: uploadBase });


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
    files: [], // we will store objects here {name: 'file.js', path: 'src/file.js', content: '...'}
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
        result.totalFiles++;
        
        let content = "";
        const isReadme = file.toLowerCase() === "readme.md";
        const isImportant = ["package.json", "requirements.txt", "manage.py", "pyproject.toml"].includes(file);
        
        // Simple line count helper
        let lines = 0;
        let hasComments = false;
        
        try {
          const raw = fs.readFileSync(fullPath, "utf-8");
          lines = raw.split("\n").length;
          hasComments = raw.includes("//") || raw.includes("#");
          
          if (isReadme || isImportant) {
            content = raw;
          }
        } catch (e) {
          console.log("Could not read file metadata:", relPath);
        }

        result.files.push({
          name: file,
          path: relPath,
          content: content.substring(0, 1000),
          lines: lines,
          hasComments: hasComments
        });
      }
    }
  };

  traverse(dir);
  return result;
};

// 1. ARCHITECTURE OVERVIEW (AI POWERED):
async function getArchitecture(files) {
  // Much better basic detection if AI fails
  const guessArchitecture = (files) => {
    const rootFiles = files.filter(f => !f.path.includes(path.sep)).map(f => f.name);
    const hasPackageJson = rootFiles.includes("package.json");
    const hasManagePy = rootFiles.includes("manage.py");
    const hasRequirements = rootFiles.includes("requirements.txt") || rootFiles.includes("pyproject.toml");
    const hasCMake = rootFiles.includes("CMakeLists.txt") || files.some(f => f.name === "CMakeLists.txt");
    
    // Count extensions
    let extCount = {};
    files.forEach(f => {
      let ext = path.extname(f.name);
      extCount[ext] = (extCount[ext] || 0) + 1;
    });

    if (hasManagePy) return "Django (Python) project.";
    if (hasPackageJson && (extCount[".js"] || 0) > (extCount[".py"] || 0)) return "Node.js based project.";
    if (hasRequirements || (extCount[".py"] || 0) > (extCount[".js"] || 0)) return "Python based project.";
    if (hasCMake || (extCount[".cpp"] || 0) > 0) return "C++ based project.";
    if ((extCount[".html"] || 0) > 0 && (extCount[".js"] || 0) > 0) return "Frontend (Web) project.";
    
    return "General project structure.";
  };

  let fileContext = files
    .filter(f => f.path.split(path.sep).length <= 2)
    .map(f => f.path)
    .slice(0, 40)
    .join("\n");

  let prompt = `Analyze these files and show me the architecture and tech stack accurately.
Files:
${fileContext}

Return simple:
"This is a [Type].
Uses: [Tech]
Flow: [Flow]"`;

  console.log("Calling Gemini for Architecture...");

  const models = ["gemini-2.5-flash", "gemini-2.0-flash", "gemini-flash-latest"];
  let lastError = "";

  for (let model of models) {
     try {
        const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
          contents: [{ parts: [{ text: prompt }] }]
        });
        if (response.data?.candidates?.[0]?.content) {
            return response.data.candidates[0].content.parts[0].text;
        }
     } catch (err) {
        lastError = err.response?.data?.error?.message || err.message;
        console.log(`Model ${model} failed:`, lastError);
        if (err.response?.status !== 429) break; // If not rate limited, stop trying others
     }
  }

  return `This is a ${guessArchitecture(files)}\n\n(AI was busy: ${lastError})`;
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
      return `# Project README\n\nThis is a ${tech} project.`;
  }

  const models = ["gemini-2.0-flash", "gemini-2.5-flash", "gemini-flash-latest"];
  let lastError = "";

  for (let model of models) {
    try {
      const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        contents: [{ parts: [{ text: prompt }] }]
      });

      if (response.data && response.data.candidates && response.data.candidates[0].content) {
          return response.data.candidates[0].content.parts[0].text;
      }
    } catch (err) {
      lastError = err.response?.data?.error?.message || err.message;
      console.log(`README Generator ${model} failed:`, lastError);
      if (err.response?.status !== 429) break;
    }
  }

  return `# Project Overview\n\n${tech}\n\n(AI was too busy for a full README: ${lastError})`;
}

// 4. IMPROVEMENT SUGGESTIONS (NEW FEATURE):
let lastSuggestions = [];

function getSuggestions(files) {
  let suggestions = [];

  // 1. README CHECK
  const hasReadme = files.some(f => f.name.toLowerCase() === "readme.md");
  if (!hasReadme) {
    suggestions.push({
      text: "Add a README file to explain the project",
      file: "root folder"
    });
  }

  // 2. LARGE FILE CHECK
  const largeFiles = files.filter(f => f.lines > 300);
  if (largeFiles.length > 0) {
    largeFiles.forEach(f => {
      suggestions.push({
        text: `Break down this large file (${f.lines} lines) into smaller modules`,
        file: f.path
      });
    });
  }

  // 3. FILE COUNT CHECK
  if (files.length > 50) {
    suggestions.push({
      text: "Organize files into subdirectories for better structure",
      file: "project structure"
    });
  }

  // 4. COMMENTS CHECK
  const filesWithoutComments = files.filter(f => !f.hasComments && f.lines > 20);
  if (filesWithoutComments.length > 0) {
    filesWithoutComments.slice(0, 3).forEach(f => {
      suggestions.push({
        text: "Add comments to explain the complex logic",
        file: f.path
      });
    });
  }

  // 5. PACKAGE FILE CHECK
  const hasPackage = files.some(f => f.name === "package.json" || f.name === "requirements.txt");
  if (!hasPackage) {
    suggestions.push({
      text: "Add a dependency file (package.json or requirements.txt) for easy setup",
      file: "root folder"
    });
  }

  return suggestions;
}

async function refineSuggestionsAI(hints) {
  if (hints.length === 0) return ["Project looks well structured"];
  
  // Format hints with location for AI
  let hintsToRefine = hints.map(h => `- ${h.text} (Location: ${h.file})`).join("\n");
  
  let prompt = `Improve and rewrite these coding project suggestions. 
  Each suggestion includes a location. Make sure to keep the location clear in the final result so the user knows exactly where to fix it.
  
  Rules:
  1. Keep it professional but simple.
  2. Format: "[Suggestion] in [File Path]"
  
  Hints with locations:
  ${hintsToRefine}`;

  try {
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      contents: [{ parts: [{ text: prompt }] }]
    });

    if (response.data?.candidates?.[0]?.content) {
      let text = response.data.candidates[0].content.parts[0].text;
      return text.split("\n").filter(line => line.trim().length > 0).map(line => line.replace(/^- /, ""));
    }
  } catch (e) {
    console.log("AI Suggestions failed, using raw hints with location info");
  }
  
  return hints.map(h => `${h.text} in ${h.file}`); // Fallback includes file
}

app.get("/suggestions", async (req, res) => {
  res.json({ suggestions: lastSuggestions });
});

app.post("/repo", async (req, res) => {
  const { repoUrl } = req.body;
  const tempDir = path.join(tempBase, Date.now().toString());

  try {
    if (!fs.existsSync(tempBase)) {
      fs.mkdirSync(tempBase, { recursive: true });
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

    // get suggestions
    const rawHints = getSuggestions(processed.files);
    lastSuggestions = await refineSuggestionsAI(rawHints);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });

    res.json({ 
      success: true, 
      architecture: arch,
      readmeStatus: readmeStatus.status,
      updatedReadme: updatedReadme,
      totalFiles: processed.totalFiles,
      suggestions: lastSuggestions
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

  const tempDir = path.join(tempBase, Date.now().toString());

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

    // get suggestions
    const rawHints = getSuggestions(processed.files);
    lastSuggestions = await refineSuggestionsAI(rawHints);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.unlinkSync(req.file.path);

    res.json({ 
      success: true, 
      architecture: arch,
      readmeStatus: readmeStatus.status,
      updatedReadme: updatedReadme,
      totalFiles: processed.totalFiles,
      suggestions: lastSuggestions
     });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));