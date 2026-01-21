import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import './SingleEvent.css';
import { IoIosArrowRoundBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

function SingleEvent({ language = "sv", currentUser }) {
  const { slug } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingStatus, setBookingStatus] = useState(null); // "attendees" eller "waitlist"
const [isExpanded, setIsExpanded] = useState(false);
const navigate = useNavigate();
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
          console.log('Bokning lyckades! 🎉');
        } else if (data.status === 'waitlist') {
          console.log('Du är tillagd på väntelistan 📝');
        }
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error('Kunde inte boka:', error);
    } finally {
      setBookingLoading(false);
    }
  };

    const handleCancelBooking = async () => {
try {
      const response = await fetch('http://localhost:3001/api/cancel-booking', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventId: event._id,
          userName: currentUser.username
        })
      })

      const data = await response.json();
    } catch (error) {
      console.error('Kunde inte avboka:', error);
    } finally {
      // Hämta uppdaterad data från Sanity
      const updatedEvent = await sanityQueries.getEventBySlug(slug, language);
      setEvent(updatedEvent);
    }
  }
  

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
      <div onClick={() => navigate(-1)} className="back-container">
                <IoIosArrowRoundBack size={30} />
                <p className="back-text">Tillbaka</p>
              </div>
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
      {hasBooked && (
          <button
            onClick={handleCancelBooking}
            className="cancel-button"
          >
            Avboka
          </button>
      )}

      {!currentUser && <p className="login-message">Logga in för att boka</p>}


    </div>
  );
}
export default SingleEvent;
