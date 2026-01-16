import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import './SingleEvent.css';

function SingleEvent({ language = "sv" }) {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (slug) {
        try {
          const eventData = await sanityQueries.getEventBySlug(slug, language);
          console.log('Fetched event data:', eventData);
          setEvent(eventData);
        } catch (error) {
          console.error('Error fetching event:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [slug, language]);

  if (loading) {
    return <div className="single-event">Laddar event...</div>;
  }

  if (!event) {
    return <div className="single-event">Event hittades inte</div>;
  }

  // Säkerställ att name och description är strängar
  const eventName = typeof event.name === 'string' ? event.name : event.name?.[language] || event.name?.sv || 'Untitled Event';
  const eventDescription = typeof event.description === 'string' ? event.description : event.description?.[language] || event.description?.sv || '';

  return (
    <div className="single-event">
      <h1>{eventName}</h1>
      <div className="event-details">
        {language === "sv" ? (
          <>
            <p><strong>📍 Plats:</strong> {event.location}</p>
            <p><strong>📅 Datum:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {eventDescription && <p><strong>Beskrivning:</strong> {eventDescription}</p>}
            {event.numberOfAttendees && <p><strong>Antal deltagare:</strong> {event.numberOfAttendees}</p>}
          </>
        ) : (
          <>
            <p><strong>📍 Location:</strong> {event.location}</p>
            <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {eventDescription && <p><strong>Description:</strong> {eventDescription}</p>}
            {event.numberOfAttendees && <p><strong>Number of Attendees:</strong> {event.numberOfAttendees}</p>}
          </>
        )
        }
        {event.tags && event.tags.length > 0 && language === "sv" ? (
          <div className="event-tags">
            <strong>Kategorier:</strong>
            <div className="tags-container">
              {event.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        ) : (<div className="event-tags">
            <strong>Categories:</strong>
            <div className="tags-container">
              {event.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>)}

        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={eventName}
            className="event-image"
          />
        )}
      </div>
    </div>
  );
}
export default SingleEvent;
