import express from "express";
import cors from "cors";
import { db } from "./db/connection.js";
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
    files: [],
  };

  const traverse = (currentDir) => {
    const files = fs.readdirSync(currentDir);
    for (const file of files) {
      if (file === ".git" || file === "node_modules") continue;
      const fullPath = path.join(currentDir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        traverse(fullPath);
      } else {
        const content = fs.readFileSync(fullPath, "utf-8");
        const lines = content.split("\n").length;
        result.totalFiles++;
        result.files.push(`${file} - ${lines} lines`);
      }
    }
  };

  traverse(dir);
  return result;
};

app.post("/repo", async (req, res) => {
  const { repoUrl } = req.body;
  const tempDir = path.join(__dirname, "temp", Date.now().toString());

  try {
    if (!fs.existsSync(path.join(__dirname, "temp"))) {
      fs.mkdirSync(path.join(__dirname, "temp"));
    }

    console.log(`Cloning ${repoUrl} to ${tempDir}`);
    execSync(`git clone ${repoUrl} ${tempDir}`);

    const result = processFiles(tempDir);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });

    res.json({ success: true, result });
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

    const result = processFiles(tempDir);

    // Clean up
    fs.rmSync(tempDir, { recursive: true, force: true });
    fs.unlinkSync(req.file.path);

    res.json({ success: true, result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
});

app.listen(5001, () => console.log("Server running on port 5001"));