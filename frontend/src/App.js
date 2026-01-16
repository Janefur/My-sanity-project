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
import { useState, useEffect } from "react";

function AppContent() {
   const location = useLocation();
   const [language, setLanguage] = useState("sv");
   const [events, setEvents] = useState([]);
   const [pages, setPages] = useState(null);
   const [currentUser, setCurrentUser] = useState(null);

   // Hämta användare från localStorage vid start
   useEffect(() => {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser) {
         try {
            setCurrentUser(JSON.parse(savedUser));
         } catch (error) {
            localStorage.removeItem('currentUser');
         }
      }
   }, []);

   const handleLanguageChange = (lang) => {
      setLanguage(lang);
   };

   const handleEventsUpdate = (fetchedEvents) => {
      setEvents(fetchedEvents);
   };

   const handlePagesUpdate = (fetchedPages) => {
      setPages(fetchedPages);
   };

   const handleLogin = (user) => {
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
   };

   const handleLogout = () => {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
   };

   return (
      <>
         <Navbar
            onLanguageChange={handleLanguageChange}
            onEventsUpdate={handleEventsUpdate}
            onPagesUpdate={handlePagesUpdate}
            onLogin={handleLogin}
            onLogout={handleLogout}
            currentUser={currentUser}
         />
         <Routes>
            <Route
               path="/"
               element={
                  <StartPage
                     language={language}
                     events={events}
                     pages={pages}
                     currentUser={currentUser}
                  />
               }
            />
            <Route path="/events/:slug" element={<SingleEvent language={language} currentUser={currentUser} />} />
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
