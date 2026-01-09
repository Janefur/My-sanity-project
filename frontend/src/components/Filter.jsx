import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanityQueries } from "../sanityQueries";
import './Filter.css';

export async function getEventsByTags(filters) {
  try {
    const allEvents = await sanityQueries.getAllEvents();

    const filteredEvents = allEvents.filter((event) => {
      const matchesTags = filters.tags.length > 0 ? filters.tags.some(tag => event.tags.includes(tag)) : true;

      return matchesTags;
    });

    return filteredEvents;
  } catch (error) {
    console.error('Error fetching filtered events:', error);
    return [];
  }
}
function Filter({ event, showAllTags = false }) {
  const [allEvents, setAllEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);
  const [taggedEvents, setTaggedEvents] = useState([]);

  // Fetcha alla events när showAllTags är true
  useEffect(() => {
    if (showAllTags) {
      const fetchEvents = async () => {
        setLoading(true);
        try {
          const events = await sanityQueries.getAllEvents();
          setAllEvents(events);
        } catch (error) {
          console.error('Error fetching events for tags:', error);
        } finally {
          setLoading(false);
        }
      };
      fetchEvents();
    }
  }, [showAllTags]);

  // Hantera tag-klick
  const handleTagClick = async (tag) => {
    if (selectedTag === tag) {
      setSelectedTag(null);
      setTaggedEvents([]);
      return;
    }

    setSelectedTag(tag);
    try {
      const events = await sanityQueries.getEventsByTag(tag);
      setTaggedEvents(events);
    } catch (error) {
      console.error('Error fetching events by tag:', error);
    }
  };

  // Om ett specifikt event skickas, visa dess tags
  if (event && event.tags) {
    return (
      <div className="tags-container">
        {event.tags.map(tag => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    );
  }
  
  // Om showAllTags är true, visa alla unika tags från alla events
  if (showAllTags) {
    if (loading) {
      return <div>Laddar kategorier...</div>;
    }

    if (allEvents.length === 0) {
      return null;
    }

    const allTags = Array.from(new Set(allEvents.flatMap(event => event.tags || [])));
    
    if (allTags.length === 0) {
      return <div>Inga kategorier tillgängliga</div>;
    }
    
    return (
      <div className="all-tags">
        <h3>Tillgängliga kategorier:</h3>
        <div className="tags-container">
          {allTags.map(tag => (
            <button 
              key={tag} 
              className={`tag ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
        
        {/* Visa events för vald tag */}
        {selectedTag && taggedEvents.length > 0 && (
          <div className="tagged-events">
            <h4>Events för "{selectedTag}":</h4>
            <div className="events-list">
              {taggedEvents.map(event => (
                <Link 
                  key={event._id} 
                  to={`/events/${event.slug.current}`}
                  className="event-link"
                >
                  <div className="event-preview">
                    <h5>{event.name}</h5>
                    <p>📍 {event.location}</p>
                    <p>📅 {new Date(event.date).toLocaleDateString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  return null;
}



export default Filter;
