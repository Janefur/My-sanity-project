const express = require('express');
const cors = require('cors');
const { createClient } = require('@sanity/client');
require('dotenv').config({ path: '../.env' }); // Läs .env från root

const app = express();
const PORT = 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sanity client med write-token
const sanityClient = createClient({
  projectId: "pu3m65bh",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_AUTH_TOKEN,
});

// API endpoint för att skapa events
app.post('/api/create-event', async (req, res) => {
  try {
    console.log('Received request:', req.body);
    console.log('Token exists:', !!process.env.SANITY_AUTH_TOKEN);

    const { name, date, location, description } = req.body;

    // Validering
    if (!name || !date || !location) {
      return res.status(400).json({ error: 'Namn, datum och plats krävs' });
    }

    // Skapa event-dokument
    const doc = {
      _type: "event",
      name: name.trim(),
      date,
      location: location.trim(),
      description: description?.trim() || "",
    };

    console.log('Creating document:', doc);

    // Skapa i Sanity
    const created = await sanityClient.create(doc);
    
    console.log('Created successfully:', created._id);

    // Publicera dokumentet så det blir synligt för frontend
    const published = await sanityClient
      .patch(created._id)
      .commit();
    
    console.log('Published successfully:', published._id);

    // Returnera svar
    res.status(201).json({ 
      success: true, 
      event: published 
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      error: 'Kunde inte skapa event',
      details: error.message 
    });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running' });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
  console.log(`Token loaded: ${process.env.SANITY_AUTH_TOKEN ? 'YES' : 'NO'}`);
});