import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import './SingleEvent.css';

function SingleEvent({ language = "sv", currentUser }) {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // "attendees" eller "waitlist"
const [isExpanded, setIsExpanded] = useState(false);

const maxLength = 200; // Antal tecken att visa
const description = event?.description || '';
const shouldShowButton = description.length > maxLength;
const displayText = isExpanded ? description : description.slice(0, maxLength);
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
    const alreadyAttending = event.attendees?.includes(currentUser.username);
    const alreadyOnWaitlist = event.waitlist?.includes(currentUser.username);
    
    if (alreadyAttending || alreadyOnWaitlist) {
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
          userName: currentUser.username
        })
      });

      const data = await response.json();

      if (response.ok) {
        setBookingStatus(data.status); // "attendees" eller "waitlist"
        
        // Hämta uppdaterad data från Sanity
        const updatedEvent = await sanityQueries.getEventBySlug(slug, language);
        setEvent(updatedEvent);

        if (data.status === 'attendees') {
          alert('Bokning lyckades! 🎉');
        } else if (data.status === 'waitlist') {
          alert('Du är tillagd på väntelistan 📝');
        }
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
  const hasBooked = event.attendees?.includes(currentUser?.username) || event.waitlist?.includes(currentUser?.username);
  const isOnWaitlist = event.waitlist?.includes(currentUser?.username);
  const bookedCount = (event.attendees?.length || 0);
  const availableSpots = event.capacity - bookedCount;
  const isFull = availableSpots <= 0;

  return (
    <div className="single-event">
         {event.imageUrl && (
          <img
            src={event.imageUrl}
            alt={eventName}
            className="event-image"
          />
        )}
      <h1>{eventName}</h1>
      <div className="event-details">
        
        {language === "sv" ? (
          <>
            <p><strong>Plats:</strong> {event.location}</p>
            <p><strong>Datum:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Platser kvar:</strong> {isFull ? 'Fullbokad' : availableSpots}</p>

            <p>{displayText}{!isExpanded && shouldShowButton && '...'}</p>
            {shouldShowButton && (
              <button className="show-more-button" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Visa mindre' : 'Visa mer'}
              </button>
            )}

          </>
        ) : (
          <>
            <p><strong>Location:</strong> {event.location}</p>
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Available Spots:</strong> {isFull ? 'Fully Booked' : availableSpots}</p>

            <p>{displayText}{!isExpanded && shouldShowButton && '...'}</p>
            {shouldShowButton && (
              <button className="show-more-button" onClick={() => setIsExpanded(!isExpanded)}>
                {isExpanded ? 'Show less' : 'Show more'}
              </button>
            )}
          </>
        )
        }
     

     
      </div>

      {/* Bokningsknapp */}
      {currentUser && !hasBooked && (
        <button
          onClick={handleBooking}
          disabled={bookingLoading}
          className={`booking-button ${isFull ? 'waitlist' : ''}`}
        >
          {bookingLoading ? 'Bokar...' : (isFull ? 'Väntelista' : 'Boka in dig på event')}
        </button>
      )}

      {hasBooked && (
        <p className={`booking-status ${isOnWaitlist ? 'waitlist' : 'booked'}`}>
          {isOnWaitlist ? 'Du står på väntelistan' : 'Bokad'}
        </p>
      )}
      
      {!currentUser && <p className="login-message">Logga in för att boka</p>}


    </div>
  );
}
export default SingleEvent;
