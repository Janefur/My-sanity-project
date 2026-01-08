import React, { useEffect, useState } from "react";

import { sanityClient } from "./sanityClient"; // <-- här importerar du klienten

function App() {
  const [posts, setPosts] = useState([]);

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

      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <h1>Events från Sanity</h1>

      {posts.map((post) => (
        <div key={post._id}>
          <h2>{post.name}</h2>
          <p>📍 {post.location}</p>
          <p>📅 {new Date(post.date).toLocaleDateString()}</p>
          {post.description && <p>{post.description}</p>}
          {post.tags && post.tags.length > 0 && (
            <div style={{ marginBottom: '10px' }}>
              {post.tags.map((tag, index) => (
                <span
                  key={index}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
          {post.imageUrl && (
            <img
              src={post.imageUrl}
              alt={post.name}
              style={{ maxWidth: '400px', height: 'auto' }}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
