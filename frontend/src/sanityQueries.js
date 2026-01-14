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
};

export const sanityQueries = {
  getPageBySlug: (slug) => sanityClient.fetch(queries.pageBySlug(slug)),
  getAllEvents: () => sanityClient.fetch(queries.allEvents()),
  getEventBySlug: (slug) => sanityClient.fetch(queries.eventById(slug)),
};
