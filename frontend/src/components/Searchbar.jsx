import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { sanityQueries } from "../sanityQueries";
import './Searchbar.css';
import { SiGooglemaps } from "react-icons/si";
import { MdDateRange } from "react-icons/md";

export async function getSearchResults(query, language = "sv") {
  try {
    // Hämta alla events från Sanity
    const allEvents = await sanityQueries.getAllEvents(language);

    // Filtrera events baserat på sökfrågan (case-insensitive)
    const filteredEvents = allEvents.filter((event) => {
      // Hoppa över events utan slug
      if (!event.slug || !event.slug.current) return false;

      const lowerCaseQuery = query.toLowerCase();
      return (
        event.name?.toLowerCase().includes(lowerCaseQuery) ||
        event.description?.toLowerCase().includes(lowerCaseQuery) ||
        event.location?.toLowerCase().includes(lowerCaseQuery) ||
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
            <p><strong><SiGooglemaps /> Plats:</strong> {event.location}</p>
            <p><MdDateRange /> Datum: {new Date(event.date).toLocaleDateString()}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}

// Huvudkomponent för sökfunktionen
 function Searchbar({ language = "sv", onSearchChange, isFiltering = false }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  // Rensa sökfältet när någon börjar filtrera
  useEffect(() => {
    if (isFiltering) {
      setQuery('');
      setResults([]);
      if (onSearchChange) onSearchChange(false);
    }
  }, [isFiltering, onSearchChange]);

  const handleSearch = async (searchQuery) => {
    if (!searchQuery.trim()) {
      setResults([]);
      if (onSearchChange) onSearchChange(false);
      return;
    }

    try {
      const searchResults = await getSearchResults(searchQuery, language);
      setResults(searchResults);
      // Sätt isSearching till true bara om vi faktiskt har resultat
      if (onSearchChange) onSearchChange(searchResults.length > 0);
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      if (onSearchChange) onSearchChange(false);
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
        {query && results.length > 0 && !isFiltering && <SearchResults filteredEvents={results} />}
      </div>
    </div>
  );
}

export default Searchbar;
