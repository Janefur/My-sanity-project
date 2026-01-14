import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { sanityQueries } from "../sanityQueries";
import ImageUpload from "../components/Imageuploader.jsx";

export default function CreateEvent() {
  const [image, setImage] = useState(null);

  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [fields, setFields] = useState({
    name: "",
    date: "",
    location: "",
    description: "",
  });
  const [isDuplicate, setIsDuplicate] = useState(false);

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
      (p) => (p.name || "").trim().toLowerCase() === name
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
          name: fields.name,
          date: fields.date,
          location: fields.location,
          description: fields.description,
          imageUrl: image,
        }),
      });

      const text = await response.text();
      console.log("RAW BACKEND RESPONSE:", text);

      if (!response.ok) {
        throw new Error(text || "Något gick fel");
      }

      setFields({ name: "", date: "", location: "", description: "" });
      alert("Event skapat!");
    } catch (err) {
      console.error("Backend API error:", err);
      alert(`Kunde inte skapa event: ${err.message}`);
    }
  };

  return (
    <div>
      <h1>Skapa ett event</h1>
      <div>
        <form onSubmit={handleSubmit}>
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
            name="description"
            value={fields.description}
            onChange={handleChange}
          ></textarea>
          <ImageUpload
            initialImage={image}
            onImageSelect={(img) => setImage(img)}
          />

          <br />
          <button type="submit">Lägg till</button>
        </form>
      </div>
      <footer>
        <button onClick={() => navigate(-1)}>
          Gå tillbaka till startsidan
        </button>
      </footer>
    </div>
  );
}
