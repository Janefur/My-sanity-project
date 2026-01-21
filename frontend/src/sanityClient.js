import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pu3m65bh",
  dataset: "production",
  useCdn: false, // inaktivera CDN för utveckling
  apiVersion: "2023-01-01",
  token: process.env.REACT_APP_SANITY_READ_TOKEN, // Read-only token för drafts
  perspective: 'drafts', // Visa både drafts och publicerade
});
