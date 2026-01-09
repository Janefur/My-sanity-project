import { useEffect, useState } from "react";
import { sanityClient } from "../sanityClient";

export default function CreateEvent() {
  const [posts, setPosts] = useState([]);
  const [fields, setFields] = useState({ name: "", date: "", location: "", description: "" });
  const [isDuplicate, setIsDuplicate] = useState(false);
  useEffect(() => {
      async function fetchPosts() {
        // Expandera bildreferensen för att få URL:en
        const query = `*[_type == "event"] {
          _id,
          name,
          date,
          location,
          description,
          numberOfAttendees,
          tags,
          "imageUrl": photo.asset->url
        }`;

        const data = await sanityClient.fetch(query);

        setPosts(data || []);
      }

      fetchPosts();
    }, []);
  useEffect(() => {
    const name = fields.name && fields.name.trim().toLowerCase();
    if (!name) return setIsDuplicate(false);
    const found = posts.some((p) => (p.name || "").trim().toLowerCase() === name);
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
    const doc = {
      _type: "event",
      name: fields.name,
      date: fields.date,
      location: fields.location,
      description: fields.description,
    };

    // const created = await sanityClient.create(doc);
    // console.log("Skapat:", created);
    console.log(doc)
    // uppdatera UI / rensa fält
  } catch (err) {
    console.error("Sanity create error:", err);
    alert("Kunde inte skapa event. Kolla konsolen för fel.");
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
            <p style={{ color: "red" }}>Ett event med detta namn finns redan.</p>
          )}

          <label>Datum:</label>
          <input type="date" value={fields.date} name="date" onChange={handleChange} />

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

          <br />
          <button type="submit" disabled={isDuplicate || !fields.name.trim()}>
            Skapa event
          </button>
        </form>
      </div>
    </div>
  );
}
