import { useState } from 'react';
import { sanityQueries } from '../sanityQueries';
import { useLocation } from 'react-router-dom';


export default function Language({ onLanguageChange }) {
  const [currentLanguage, setCurrentLanguage]= useState('sv');
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  // Hämta sidnamnet från URL
  const currentPage = location.pathname === '/' ? 'startsida' : location.pathname.replace('/', '');

  const handleLanguageChange = async (language) => {
    setLoading(true);
    try {
      // Fetcha events på nytt språk med default sortering (närmaste först)
      const events = await sanityQueries.getAllEvents(language, "date", "asc");
      const pages = await sanityQueries.getPageBySlug(currentPage, language);

      // Skicka språk och data till parent-komponenten
      setCurrentLanguage(language);
      onLanguageChange(language, events, pages);
      console.log('Språk ändrat till:', language);
      console.log('Events hämtade:', events);
    } catch (error) {
      console.error('Fel vid språkväxling:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="language-switcher">
      <button
        className={`language-btn ${currentLanguage === 'sv' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('sv')}
        title="Svenska"
        disabled={loading}
      >
        🇸🇪 SE
      </button>
      <button
        className={`language-btn ${currentLanguage === 'en' ? 'active' : ''}`}
        onClick={() => handleLanguageChange('en')}
        title="English"
        disabled={loading}
      >
        🇬🇧 GB
      </button>
    </div>
  );
}
