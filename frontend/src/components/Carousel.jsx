import React, { useRef } from 'react';
import './Carousel.css';
import { Link } from 'react-router-dom';
import { SiGooglemaps } from "react-icons/si";
import { MdDateRange } from "react-icons/md";



function Carousel({ carousel }) {
  const trackRef = useRef(null);
  const containerRef = useRef(null);

  // Fallback för olika data-strukturer
  let photo = [];
  let title = "";

  if (carousel?.images && carousel.images.length > 0) {
    // Struktur med images array
    photo = carousel.images;
    title = carousel.title;
  } else if (carousel?.events && carousel.events.length > 0) {
    // Struktur med events array - konvertera till image format
    photo = carousel.events
  .filter(event => event)
  .map(event => ({
    imageUrl: event.imageUrl,
    alt: event.name,
    caption: event.name,
    location: event.location,
    date: event.date,
    slug: event.slug,      
    _id: event._id,
  }));
    title = carousel.title;
  } else if (carousel?.photo) {
    // Struktur med photo array
    photo = carousel.photo;
    title = carousel.title;
  } else if (Array.isArray(carousel)) {
    // Gammal struktur: [{ imageUrl: "", ... }]
    photo = carousel;
  }

  // Early return
  if (!photo || photo.length === 0) {
    return <div>Inga carousel-bilder att visa. Data: {JSON.stringify(carousel)}</div>;
  }



  return (
    <div className="carousel">
      {title && <h3 className="carousel-title">{title}</h3>}
      <div className="carousel-container">
        <div ref={containerRef} className="carousel-track-container">
          <div ref={trackRef} className="carousel-track">
            {photo.map((event, index) => (
              <div key={index} className="carousel-slide">
                   <Link 
                    key={event._id} 
                    to={`/events/${event.slug?.current}`}
                    className="event-link"
                    >
                  <img
                    className="carousel-image"
                    src={event.imageUrl}
                    alt={event.alt || `Slide ${index + 1}`}
                  />
                  <div className="carousel-caption">
                    <p className="caption-name">{event.caption}</p>
                    {event.location && <p className="caption-location"> <SiGooglemaps /> {event.location}</p>}
                    {event.date && <p className="caption-date"> <MdDateRange /> {new Date(event.date).toLocaleDateString('sv-SE')}</p>}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Carousel;
