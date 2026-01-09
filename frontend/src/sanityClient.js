import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "pu3m65bh",
  dataset: "production",
  useCdn: false, // inaktivera CDN för utveckling
  apiVersion: "2023-01-01",
  token: process.env.SANITY_AUTH_TOKEN,
});
