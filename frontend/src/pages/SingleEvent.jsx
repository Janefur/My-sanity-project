import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import './SingleEvent.css';

function SingleEvent() {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvent = async () => {
      if (slug) {
        try {
          const eventData = await sanityQueries.getEventBySlug(slug);
          setEvent(eventData);
        } catch (error) {
          console.error('Error fetching event:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEvent();
  }, [slug]);

  if (loading) {
    return <div className="single-event">Laddar event...</div>;
  }

  if (!event) {
    return <div className="single-event">Event hittades inte</div>;
  }

  return (
    <div className="single-event">
      <h1>{event.name}</h1>
      <div className="event-details">
        <p><strong>📍 Plats:</strong> {event.location}</p>
        <p><strong>📅 Datum:</strong> {new Date(event.date).toLocaleDateString()}</p>
        {event.description && <p><strong>Beskrivning:</strong> {event.description}</p>}
        {event.numberOfAttendees && <p><strong>Antal deltagare:</strong> {event.numberOfAttendees}</p>}

        {event.tags && event.tags.length > 0 && (
          <div className="event-tags">
            <strong>Kategorier:</strong>
            <div className="tags-container">
              {event.tags.map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          </div>
        )}

        {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={event.name}
            className="event-image"
          />
        )}
      </div>
    </div>
  );
}
export default SingleEvent;
