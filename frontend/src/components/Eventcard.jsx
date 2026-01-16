import { sanityClient } from "../sanityClient";
import React, { useEffect, useState } from "react";

function EventCard() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const query = `*[_type == "event"] | order(date asc) {
        _id,
        "name": coalesce(name.sv, name),
        date,
        slug,
        location,
        "description": coalesce(description.sv, description),
        capacity,
        tags,
        "imageUrl": photo.asset->url
      }`;

      const data = await sanityClient.fetch(query);
      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map((post) => {
        const isFull = post.capacity <= 0;

        return (
          <div key={post._id}>
            <h2>{post.name}</h2>
            <p>📍 {post.location}</p>
            <p>📅 {new Date(post.date).toLocaleDateString()}</p>
            <p>🎫 Platser kvar: {isFull ? 'Fullbokad' : post.capacity}</p>
            {post.description && <p>{post.description}</p>}
            {post.tags && post.tags.length > 0 && (
              <div style={{ marginBottom: "10px" }}>
                {post.tags.map((tag, index) => (
                  <span key={index}>{tag} </span>
                ))}
              </div>
            )}
            {post.imageUrl && (
              <img
                src={post.imageUrl}
                alt={post.name}
                style={{ maxWidth: "400px", height: "auto" }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
export default EventCard;
