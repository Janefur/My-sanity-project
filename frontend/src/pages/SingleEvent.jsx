import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import './SingleEvent.css';

function SingleEvent({ language = "sv", currentUser }) {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      if (slug) {
        try {
          const eventData = await sanityQueries.getEventBySlug(slug, language);
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

  const handleBooking = async () => {
    if (!currentUser) {
      alert('Du måste vara inloggad för att boka!');
      return;
    }

    // Extra koll för att förhindra dubbelbokning
    if (event.addedAttendees?.includes(currentUser.id)) {
      alert('Du har redan bokat detta event!');
      return;
    }

    setBookingLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/book-event', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          userId: currentUser.id,
          userName: currentUser.username
        })
      });

      const data = await response.json();

      if (response.ok) {
        setEvent({
          ...event,
          numberOfAttendees: event.numberOfAttendees - 1,
          addedAttendees: [...(event.addedAttendees || []), currentUser.id]
        });
        alert('Bokning lyckades! 🎉');
      } else {
        alert(data.error);
      }
    } catch (error) {
      alert('Kunde inte boka');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return <div className="single-event">Laddar event...</div>;
  }

  if (!event) {
    return <div className="single-event">Event hittades inte</div>;
  }

  // Säkerställ att name och description är strängar
  const eventName = typeof event.name === 'string' ? event.name : event.name?.[language] || event.name?.sv || 'Untitled Event';
  const eventDescription = typeof event.description === 'string' ? event.description : event.description?.[language] || event.description?.sv || '';

  // Bokningslogik
  const hasBooked = event.addedAttendees?.includes(currentUser?.username);
  const isFull = event.numberOfAttendees <= 0;

  return (
    <div className="single-event">
      <h1>{eventName}</h1>
      <div className="event-details">
        {language === "sv" ? (
          <>
            <p><strong>📍 Plats:</strong> {event.location}</p>
            <p><strong>📅 Datum:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {eventDescription && <p><strong>Beskrivning:</strong> {eventDescription}</p>}
            <p>🎫 Platser kvar: {isFull ? ' Fullbokad' : event.numberOfAttendees}</p>
          </>
        ) : (
          <>
            <p><strong>📍 Location:</strong> {event.location}</p>
            <p><strong>📅 Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            {eventDescription && <p><strong>Description:</strong> {eventDescription}</p>}
            <p>🎫 Spots left: {isFull ? ' Fullbokad' : event.numberOfAttendees}</p>
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

      {/* Bokningsknapp */}
      {currentUser && !hasBooked && (
        <button 
          onClick={handleBooking}
          disabled={bookingLoading}
          style={{ 
            background: isFull ? 'orange' : 'green', 
            color: 'white',
            padding: '10px 20px',
            cursor: 'pointer',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px'
          }}
        >
          {bookingLoading ? 'Bokar...' : (isFull ? 'Väntelista' : 'Boka in dig på event')}
        </button>
      )}

            {hasBooked && <p style={{color: 'green'}}>{isFull ? 'Du står på väntelista' : 'Bokad!'}</p>}
      {!currentUser && <p>Logga in för att boka</p>}

    </div>
  );
}
export default SingleEvent;
