// API endpoint för att skapa events säkert
import { createClient } from "@sanity/client";

// Sanity client med write-token (bara på servern)
const sanityClient = createClient({
  projectId: "pu3m65bh",
  dataset: "production",
  useCdn: false,
  apiVersion: "2023-01-01",
  token: process.env.SANITY_AUTH_TOKEN, // Server-side token
});

export default async function handler(req, res) {
  // Bara tillåt POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
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

    // Skapa i Sanity
    const created = await sanityClient.create(doc);
    
    // Returnera svar
    res.status(201).json({ 
      success: true, 
      event: created 
    });

  } catch (error) {
    console.error('Error creating event:', error);
    res.status(500).json({ 
      error: 'Kunde inte skapa event',
      details: error.message 
    });
  }
}