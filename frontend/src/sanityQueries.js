import { sanityClient } from "./sanityClient";

export const queries = {
   pageBySlug: (
      slug,
      language = "sv"
   ) => `*[_type == "pageType" && slug.current == "${slug}" && language == "${language}"][0] {
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

   allEvents: (
      language = "sv"
   ) => `*[_type == "event" && language == "${language}"] {
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

   eventById: (
      slug,
      language = "sv"
   ) => `*[_type == "event" && slug.current == "${slug}" && language == "${language}"][0] {
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

   eventsByTag: (
      tag,
      language = "sv"
   ) => `*[_type == "event" && "${tag}" in tags && language == "${language}"] {
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
};

export const sanityQueries = {
   getPageBySlug: async (slug, language = "sv") => {
      return await sanityClient.fetch(queries.pageBySlug(slug, language));
   },

   // Hämta alla events
   getAllEvents: async (language = "sv") => {
      return await sanityClient.fetch(queries.allEvents(language));
   },

   // Hämta specifikt event
   getEventBySlug: async (slug, language = "sv") => {
      return await sanityClient.fetch(queries.eventById(slug, language));
   },

   // Hämta events med specifik tag
   getEventsByTag: async (tag, language = "sv") => {
      return await sanityClient.fetch(queries.eventsByTag(tag, language));
   },
   // Skapa ett nytt event
   createEvent: async (doc) => {
      return await sanityClient.create(doc);
   },

   // Publicera ett event
   publishEvent: async (id) => {
      return await sanityClient.patch(id).commit();
   },
};
