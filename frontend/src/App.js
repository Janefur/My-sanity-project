import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import StartPage from "./pages/StartPage";
import SingleEvent from "./pages/SingleEvent";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<StartPage />} />
        <Route path="/events/:slug" element={<SingleEvent />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
