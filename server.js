import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS
app.use(cors({
  origin: "*",  // only allow your React app
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// Get dirname (because ES Modules don’t have __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Songs folder (inside public/songs)
const songsDir = path.join(__dirname, "public/songs");

// API route to get folders and files
app.get("/api/songs", (req, res) => {
  try {
    const folders = fs.readdirSync(songsDir);

    const result = folders.map(folder => {
      const folderPath = path.join(songsDir, folder);
      const stats = fs.statSync(folderPath);

      if (stats.isDirectory()) {
        // ✅ include ALL files now
        const files = fs.readdirSync(folderPath);
        return { folder, files };
      }
      return null;
    }).filter(Boolean);

    res.json(result);
  } catch (error) {
    console.error("Error reading songs folder:", error);
    res.status(500).json({ error: "Failed to read songs folder" });
  }
});

// Serve static files (so you can play the actual mp3s, and access images/json too)
app.use("/songs", express.static(songsDir));

app.listen(PORT, () => {
  console.log(`🎶 Server running at http://localhost:${PORT}`);
});
