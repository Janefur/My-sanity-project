import Language from "./Language";
import { useState, useEffect } from "react";
import Login from "../components/Login";
import { sanityQueries } from "../sanityQueries";
import "../components/Navbar.css";
// import { useLocation } from "react-router-dom";

function Navbar({
  onLanguageChange,
  onEventsUpdate,
  onPagesUpdate,
  onLogin,
  onLogout,
  currentUser,
}) {
  const [language, setLanguage] = useState("sv");
  const [pages, setPages] = useState([]);

  const handleLanguageChange = (lang, fetchedPages) => {
    setLanguage(lang);
    setPages(fetchedPages);
    // Skicka vidare till parent-komponenten
    if (onLanguageChange) onLanguageChange(lang);
    if (onPagesUpdate) onPagesUpdate(fetchedPages);
  };

  return (
    <div className="NavBar">
      <div className="options-container">
      <Login onLogin={onLogin} onLogout={onLogout} loggedInUser={currentUser} />
      <Language onLanguageChange={handleLanguageChange} />
      </div>
      <div className="logo-container">
      <h1 className="logo">Event Booking</h1>
      </div>

    </div>

  );
}
export default Navbar;
