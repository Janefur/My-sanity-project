import { createClient } from "@sanity/client";

export const sanityClient = createClient({
  projectId: "MY_SANITY_PROJECT",

  dataset: "production",

  useCdn: true,

  apiVersion: "2026-01-07",
});
