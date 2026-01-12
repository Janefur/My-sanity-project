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

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<StartPage />} />
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
