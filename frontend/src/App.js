import React, { useEffect, useState } from "react";

import { sanityClient } from "./sanityClient"; // <-- här importerar du klienten

function App() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    async function fetchPosts() {
      const query = '*[_type == "post"]'; // hämtar alla "post" dokument

      const data = await sanityClient.fetch(query);

      setPosts(data);
    }

    fetchPosts();
  }, []);

  return (
    <div>
      <h1> Inlägg från Sanity</h1>

      {posts.map((post) => (
        <div key={post._id}>
          <h2>{post.title}</h2>
          <p>{post.body[0].children[0].text}</p>{" "}
          {/* enklaste sättet att visa Portable Text */}
        </div>
      ))}
    </div>
  );
}

export default App;
