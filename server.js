import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS (you can later restrict to your frontend domain)
const allowedOrigin = process.env.ALLOWED_ORIGIN || "*";
app.use(cors({
  origin: allowedOrigin,
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

// ES modules fix
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Songs folder (inside public/songs)
const songsDir = path.join(__dirname, "public", "songs");

// API route: list folders and files
app.get("/api/songs", (req, res) => {
  try {
    const folders = fs.readdirSync(songsDir);

    const result = folders.map(folder => {
      const folderPath = path.join(songsDir, folder);
      const stats = fs.statSync(folderPath);

      if (stats.isDirectory()) {
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

// Serve static files (mp3s, images, json, etc.)
app.use("/songs", express.static(songsDir));

app.listen(PORT, () => {
  console.log(`🎶 Server running on port ${PORT}`);
  console.log(`➡️ Open in browser: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);
});
