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
        "name": coalesce(name.${language}, name),
        "imageUrl": photo.asset->url,
        "description": coalesce(description.${language}, description),
        location,
        date
      }
    }
  }`,

   allEvents: (
      language = "sv",
      sortBy = "date",
      order = "asc"
   ) => `*[_type == "event"] | order(${sortBy} ${order}) {
    _id,
    "name": coalesce(name.${language}, name),
    date,
    slug,
    location,
    "description": coalesce(description.${language}, description),
    capacity,
    tags,
    "imageUrl": photo.asset->url
  }`,

   eventById: (
      slug,
      language = "sv"
   ) => `*[_type == "event" && slug.current == "${slug}"][0] {
    _id,
    "name": coalesce(name.${language}, name),
    date,
    slug,
    location,
    "description": coalesce(description.${language}, description),
    capacity,
    bookings,
    tags,
    "imageUrl": photo.asset->url
  }`,

   eventsByTag: (
      tag,
      language = "sv",
      sortBy = "date",
      order = "asc"
   ) => `*[_type == "event" && "${tag}" in tags] | order(${sortBy} ${order}) {
    _id,
    "name": coalesce(name.${language}, name),
    date,
    slug,
    location,
    "description": coalesce(description.${language}, description),
    capacity,
    tags,
    "imageUrl": photo.asset->url
  }`,
};

export const sanityQueries = {
   getPageBySlug: async (slug, language = "sv") => {
      return await sanityClient.fetch(queries.pageBySlug(slug, language));
   },

   // Hämta alla events
   getAllEvents: async (language = "sv", sortBy = "date", order = "asc") => {
      return await sanityClient.fetch(
         queries.allEvents(language, sortBy, order)
      );
   },

   // Hämta specifikt event
   getEventBySlug: async (slug, language = "sv") => {
      return await sanityClient.fetch(queries.eventById(slug, language));
   },

   // Hämta events med specifik tag
   getEventsByTag: async (
      tag,
      language = "sv",
      sortBy = "date",
      order = "asc"
   ) => {
      return await sanityClient.fetch(
         queries.eventsByTag(tag, language, sortBy, order)
      );
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
