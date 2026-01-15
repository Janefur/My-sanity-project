import Language from "./Language";
import { useState } from "react";
// import { useLocation } from "react-router-dom";


function Navbar( {onLanguageChange, onEventsUpdate, onPagesUpdate} ) {
 const [language, setLanguage] = useState('sv');
  const [events, setEvents] = useState([]);
  const [pages, setPages] = useState([]);

  const handleLanguageChange = (lang, fetchedEvents, fetchedPages) => {
    setLanguage(lang);
    setEvents(fetchedEvents);
    setPages(fetchedPages)
    // Skicka vidare till parent-komponenten
    if (onLanguageChange) onLanguageChange(lang);
    if (onEventsUpdate) onEventsUpdate(fetchedEvents);
    if (onPagesUpdate) onPagesUpdate(fetchedPages);
  };

  return (
    <div>
      <h1>Navbar</h1>
      <Language onLanguageChange={handleLanguageChange} />
    </div>
  );
}
export default Navbar;
