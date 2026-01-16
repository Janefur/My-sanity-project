import Language from "./Language";
import { useState, useEffect } from "react";
import Login from "../components/Login";
import { sanityQueries } from "../sanityQueries";

// import { useLocation } from "react-router-dom";


function Navbar( {onLanguageChange, onEventsUpdate, onPagesUpdate, onLogin, onLogout, currentUser} ) {
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
   const [post, setPost] = useState(null);

    useEffect(() => {
      // Om pages prop finns, använd den istället för att hämta
      if (pages) {
        setPost(pages);
      } else {
        async function fetchPageData() {
          const pageData = await sanityQueries.getPageBySlug("startsida", language || "sv");
          setPost(pageData);
        }
        fetchPageData();
      }
    }, [pages, language]);

    

  return (
    <div>
      <h1>Navbar</h1>
          <h2>
        {post?.title && (
          currentUser 
            ? post.title.replace("användare", currentUser.username)
            : post.title
        )}
      </h2>
      <Language onLanguageChange={handleLanguageChange} />
      <Login onLogin={onLogin} onLogout={onLogout} loggedInUser={currentUser} />
    </div>
  );
}
export default Navbar;
