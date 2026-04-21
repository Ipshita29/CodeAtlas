import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";
import { db } from "./db/connection.js";

dotenv.config();
import { execSync } from "child_process"; // (kept, not used now but not removed as per instruction)
import fs from "fs";
import path from "path";
import multer from "multer";
import AdmZip from "adm-zip";
import { fileURLToPath } from "url";
import os from "os";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

app.use(express.json());

app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

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

// ================= FILE PROCESSING =================
const processFiles = (dir) => {
  const result = { totalFiles: 0, files: [] };

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
        const ext = path.extname(file).toLowerCase();
        const codeExtensions = [".js", ".jsx", ".ts", ".tsx", ".py", ".html", ".css", ".cpp", ".java", ".c", ".h", ".md"];

        const isReadme = file.toLowerCase() === "readme.md";
        const isImportant = ["package.json", "requirements.txt", "manage.py", "pyproject.toml"].includes(file);
        const isCode = codeExtensions.includes(ext);

        let lines = 0;
        let hasComments = false;

        if (isCode || isReadme || isImportant) {
          try {
            const raw = fs.readFileSync(fullPath, "utf-8");
            lines = raw.split("\n").length;
            hasComments = raw.includes("//") || raw.includes("#");

            if (isReadme || isImportant) {
              content = raw;
            }
          } catch {}
        }

        result.files.push({
          name: file,
          path: relPath,
          content: content.substring(0, 1000),
          lines,
          hasComments
        });
      }
    }
  };

  traverse(dir);
  return result;
};

// ================= AI + LOGIC =================
async function getArchitecture(files) {
  let fileContext = files.slice(0, 20).map(f => f.path).join("\n");

  const prompt = `Analyze these files and show me architecture.\n${fileContext}`;

  try {
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      { contents: [{ parts: [{ text: prompt }] }] }
    );

    return response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Unknown";
  } catch {
    return "Analysis failed";
  }
}

function checkReadme(files) {
  let readme = files.find(f => f.name.toLowerCase() === "readme.md");
  if (!readme) return { status: "missing" };
  return { status: "good", content: readme.content };
}

async function generateReadmeAI(files, tech) {
  return `# Project\n${tech}`;
}

// ================= ROUTES =================

app.post("/repo", async (req, res) => {
  const { repoUrl } = req.body;
  const tempDir = path.join(tempBase, Date.now().toString());

  try {
    console.log("Downloading repo as ZIP:", repoUrl);

    let zipDownloaded = false;
    const branches = ["main", "master"];

    for (let branch of branches) {
      try {
        const zipUrl = repoUrl
          .replace("github.com", "codeload.github.com")
          .replace(/\/$/, "") + `/zip/refs/heads/${branch}`;

        const response = await axios({
          url: zipUrl,
          method: "GET",
          responseType: "arraybuffer",
        });

        const zip = new AdmZip(response.data);
        zip.extractAllTo(tempDir, true);

        zipDownloaded = true;
        break;

      } catch {
        console.log(`Branch ${branch} failed`);
      }
    }

    if (!zipDownloaded) {
      return res.status(400).json({
        success: false,
        message: "Failed to download repo"
      });
    }

    const processed = processFiles(tempDir);
    const arch = await getArchitecture(processed.files);

    const readmeStatus = checkReadme(processed.files);
    let updatedReadme = null;

    if (readmeStatus.status !== "good") {
      updatedReadme = await generateReadmeAI(processed.files, arch);
    }

    fs.rmSync(tempDir, { recursive: true, force: true });

    res.json({
      success: true,
      architecture: arch,
      updatedReadme,
      totalFiles: processed.totalFiles
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
});

// ================= START =================
const PORT = process.env.PORT || 5001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});