import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanityQueries } from "../sanityQueries";
import './Searchbar.css';

export async function getSearchResults(query) {
  try {
    // Hämta alla events från Sanity
    const allEvents = await sanityQueries.getAllEvents();

    // Filtrera events baserat på sökfrågan (case-insensitive)
    const filteredEvents = allEvents.filter((event) => {
      const lowerCaseQuery = query.toLowerCase();
      return (
        event.name.toLowerCase().includes(lowerCaseQuery) ||
        event.description.toLowerCase().includes(lowerCaseQuery) ||
        event.location.toLowerCase().includes(lowerCaseQuery) ||
        (event.tags && event.tags.some(tag => tag.toLowerCase().includes(lowerCaseQuery)))
      );
    });

    return filteredEvents;
  } catch (error) {
    console.error('Error fetching search results:', error);
    return [];
  }
}

// React komponent för sökresultat
export function SearchResults({ filteredEvents }) {
  if (!filteredEvents || filteredEvents.length === 0) {
    return <div className="no-results">Inga events hittades</div>;
  }

  return (
    <div className="search-results">
      {filteredEvents.map(event => (
        <Link 
          key={event._id} 
          to={`/events/${event.slug.current}`}
          className="search-result-link"
        >
          <div className="search-result">
            <h4>{event.name}</h4>
            <p><strong>Plats:</strong> {event.location}</p>
            <p>Datum: {event.date}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Huvudkomponent för sökfunktionen
function Searchbar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    try {
      const searchResults = await getSearchResults(searchQuery);
      setResults(searchResults);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    
    // Debounce search - vänta 300ms efter användaren slutat skriva
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  return (
    <div className="searchbar-container">
      <div className="searchbar">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Sök efter events..."
          className="search-input"
        />
        {isLoading && <div className="loading">Söker...</div>}
      </div>
      
      {query && <SearchResults filteredEvents={results} />}
    </div>
  );
}

export default Searchbar;