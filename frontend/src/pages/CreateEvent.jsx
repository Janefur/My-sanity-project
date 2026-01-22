import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import ImageUpload from "../components/Imageuploader.jsx";
import { IoIosArrowRoundBack } from "react-icons/io";
import "../pages/CreateEvent.css";
import {FaRegCircleCheck} from 'react-icons/fa6';

export default function CreateEvent() {
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
    capacity: 0,
  });
  const [isDuplicate, setIsDuplicate] = useState(false);
  const [hasCreated, setHasCreated] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
  if (isModalOpen && hasCreated) {
    const timer = setTimeout(() => {
      setIsModalOpen(false);
    }, 2000);
    return () => clearTimeout(timer);
  }
}, [isModalOpen, hasCreated]);

  useEffect(() => {
    async function fetchPosts() {
      const data = await sanityQueries.getAllEvents();
      setPosts(data || []);
    }

    fetchPosts();
  }, []);

  useEffect(() => {
    const name = fields.name && fields.name.trim().toLowerCase();
    if (!name) return setIsDuplicate(false);
    const found = posts.some(
      (p) => (p.name || "").trim().toLowerCase() === name,
    );
    setIsDuplicate(found);
  }, [fields.name, posts]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isDuplicate) return alert("Ett event med det namnet finns redan.");

    try {
      // Skicka till vårt säkra backend API
      const response = await fetch("http://localhost:3001/api/create-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: { sv: fields.name, en: fields.name },
          date: fields.date,
          location: fields.location,
          attendees: [],
          description: { sv: fields.description, en: fields.description },
          image: image,
          capacity: fields.capacity,
        }),
      });

      const text = await response.text();
      console.log("RAW BACKEND RESPONSE:", text);

      if (!response.ok) {
        throw new Error(text || "Något gick fel");
      }

      setFields({ name: "", date: "", location: "", description: "" , capacity: 0, image: null });

    } catch (err) {
      console.error("Backend API error:", err);
      alert(`Kunde inte skapa event: ${err.message}`);
    }
    setHasCreated(true);
  };

  return (
    <div className="create-event-container">
     {isModalOpen && hasCreated && (
         <div className="modal-confirmation-overlay">
           <div className="modal-confirmation-content">
             <div className="modal-confirmation-header">
             </div>
             <div className="modal-confirmation-body">
                <h2>Event Skapat</h2>
                <FaRegCircleCheck size={50} style={{ color: "green" }} />
             </div>
           </div>
         </div>
       )}
      <h1>Skapa ett event</h1>
      <div>
        <form className="create-form" onSubmit={handleSubmit}>
          <label>Namn på event:</label>
          <input
            type="text"
            placeholder="Skriv namn på event"
            value={fields.name}
            name="name"
            onChange={handleChange}
          />
          {isDuplicate && (
            <p style={{ color: "red" }}>
              Ett event med detta namn finns redan.
            </p>
          )}

          <label>Datum:</label>
          <input
            type="date"
            value={fields.date}
            name="date"
            onChange={handleChange}
          />

          <label>Plats:</label>
          <input
            type="text"
            placeholder="Skriv plats för event"
            name="location"
            value={fields.location}
            onChange={handleChange}
          />

          <label>Beskrivning:</label>
          <textarea
            placeholder="Skriv beskrivning för event"
            rows={5}
            name="description"
            value={fields.description}
            onChange={handleChange}
          ></textarea>
          <label>Platser:</label>
          <input
            type="number"
            placeholder="Ange antal platser"
            name="capacity"
            value={fields.capacity}
            onChange={handleChange}
          />

          <ImageUpload
            className="image-upload"
            style={{ width: "200px" }}
            onImageSelect={setImage}
          />

          <br />
          <button type="submit" className="create-event-button" onClick={() => setIsModalOpen(true)}>Lägg till</button>
        </form>
      </div>
     
      <footer className="event-footer">
        <div onClick={() => navigate(-1)}>
          <IoIosArrowRoundBack size={40} />
          <p>Tillbaka</p>
        </div>
      </footer>
    </div>
  );
}
