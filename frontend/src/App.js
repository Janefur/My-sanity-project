import {
   BrowserRouter as Router,
   Routes,
   Route,
   useLocation,
} from "react-router-dom";
import StartPage from "./pages/StartPage";
import SingleEvent from "./pages/SingleEvent";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CreateEvent from "./pages/CreateEvent";
import { useState } from "react";

function AppContent() {
   const location = useLocation();
   const [language, setLanguage] = useState("sv");
   const [events, setEvents] = useState([]);
   const [pages, setPages] = useState(null);

   const handleLanguageChange = (lang) => {
      setLanguage(lang);
   };

   const handleEventsUpdate = (fetchedEvents) => {
      setEvents(fetchedEvents);
   };

   const handlePagesUpdate = (fetchedPages) => {
      setPages(fetchedPages);
   };

   return (
      <>
         <Navbar
            onLanguageChange={handleLanguageChange}
            onEventsUpdate={handleEventsUpdate}
            onPagesUpdate={handlePagesUpdate}
         />
         <Routes>
            <Route
               path="/"
               element={
                  <StartPage
                     language={language}
                     events={events}
                     pages={pages}
                  />
               }
            />
            <Route path="/events/:slug" element={<SingleEvent />} />
            <Route path="/CreateEvent" element={<CreateEvent />}></Route>
         </Routes>
         {location.pathname === "/CreateEvent" ? null : (
            <Footer variant="default" />
         )}
      </>
   );
}

function App() {
   return (
      <Router>
         <AppContent />
      </Router>
   );
}

export default App;
