const express = require("express");
const cors = require("cors");
const { createClient } = require("@sanity/client");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: "../.env" }); // Läs .env från root

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Sanity client med write-token
const sanityClient = createClient({
  projectId: "pu3m65bh",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_AUTH_TOKEN,
});

// API endpoint för att skapa events
app.post("/api/create-event", async (req, res) => {
  try {
    console.log("Received request:", req.body);
    console.log("Token exists:", !!process.env.SANITY_AUTH_TOKEN);

    const { name, date, location, description, image } = req.body;

    // Validering
    if (!name || !date || !location) {
      return res.status(400).json({ error: "Namn, datum och plats krävs" });
    }

    // Ladda upp bild om den finns

    let photo = null;

    if (image) {
      const base64Data = image.split(",")[1];
      const buffer = Buffer.from(base64Data, "base64");

      const asset = await sanityClient.assets.upload("image", buffer, {
        filename: "event-image.png",
        contentType: "image/png",
      });

      photo = {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: asset._id,
        },
      };
    }

    // Skapa event-dokument
    const doc = {
      _type: "event",
      name: name.trim(),
      date,
      location: location.trim(),
      description: description?.trim() || "",
      photo,
    };

    console.log("Creating document:", doc);

    // Skapa i Sanity
    const created = await sanityClient.create(doc);

    console.log("Created successfully:", created._id);

    // Publicera dokumentet så det blir synligt för frontend
    const published = await sanityClient.patch(created._id).commit();

    console.log("Published successfully:", published._id);

    // Returnera svar
    res.status(201).json({
      success: true,
      event: published,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      error: "Kunde inte skapa event",
      details: error.message,
    });
  }
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", message: "Backend server is running" });
});

// Login endpoint
app.post("/api/login", (req, res) => {
  try {
    const { username, password } = req.body;

    // Validering
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        error: "Username och password krävs",
      });
    }

    // Läs users.json
    const usersPath = path.join(__dirname, "api", "login", "users.json");
    const usersData = fs.readFileSync(usersPath, "utf8");
    const users = JSON.parse(usersData);

    // Hitta användare
    const user = users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      // Lyckad login
      res.json({
        success: true,
        message: "Login lyckades!",
        user: { id: user.id, username: user.username },
      });
    } else {
      // Misslyckad login
      res.status(401).json({
        success: false,
        error: "Felaktigt användarnamn eller lösenord",
      });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      error: "Server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Token loaded: ${process.env.SANITY_AUTH_TOKEN ? "YES" : "NO"}`);
});
