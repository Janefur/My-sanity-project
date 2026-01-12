// Centraliserade Sanity queries
import { sanityClient } from './sanityClient';

// Base queries
export const queries = {
  // Hämta en pageType baserat på slug
  pageBySlug: (slug) => `*[_type == "pageType" && slug.current == "${slug}"][0] {
    _id,
    title,
    slug,
    body,
    carousel[] {
      title,
      events[]->{
        _id,
        name,
        "imageUrl": photo.asset->url,
        description,
        location,
        date
      }
    }
  }`,
 

  // Hämta alla events
  allEvents: () => `*[_type == "event"] {
    _id,
    name,
    date,
    slug,
    location,
    description,
    numberOfAttendees,
    tags,
    "imageUrl": photo.asset->url
  }`,

  // Hämta ett specifikt event
  eventById: (slug) => `*[_type == "event" && slug.current == "${slug}"][0] {
    _id,
    name,
    date,
    slug,
    location,
    description,
    numberOfAttendees,
    tags,
    "imageUrl": photo.asset->url
  }`,

  // Hämta events filtrerade på tags
  eventsByTag: (tag) => `*[_type == "event" && "${tag}" in tags] {
    _id,
    name,
    date,
    slug,
    location,
    description,
    numberOfAttendees,
    tags,
    "imageUrl": photo.asset->url
  }`
};

// Helper functions för att köra queries
export const sanityQueries = {
  // Hämta sida baserat på slug
  getPageBySlug: async (slug) => {
    return await sanityClient.fetch(queries.pageBySlug(slug));
  },

  // Hämta alla events
  getAllEvents: async () => {
    return await sanityClient.fetch(queries.allEvents());
  },

  // Hämta specifikt event
  getEventBySlug: async (slug) => {
    return await sanityClient.fetch(queries.eventById(slug));
  },

  // Hämta events med specifik tag
  getEventsByTag: async (tag) => {
    return await sanityClient.fetch(queries.eventsByTag(tag));
  },

  // Skapa ett nytt event
  createEvent: async (doc) => {
    return await sanityClient.create(doc);
  },

  // Publicera ett event
  publishEvent: async (id) => {
    return await sanityClient.patch(id).commit();
  }
};