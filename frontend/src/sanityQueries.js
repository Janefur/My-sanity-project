import { sanityClient } from "./sanityClient";

export const queries = {
  pageBySlug: (
    slug
  ) => `*[_type == "pageType" && slug.current == "${slug}"][0] {
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


export const sanityQueries = {

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
