import EventCard from "../components/Eventcard";
import React, { use } from "react";
import { useEffect, useState } from "react";
import { sanityClient } from "../sanityClient"; // <-- här importerar du klienten
import './StartPage.css';


function StartPage() {
    const [post, setPost] = useState(null);
    useEffect(() => {
      async function fetchPosts() {
        const query = `*[_type == "pageType" && slug.current == "startsida"][0] {
          _id,
          title,
          slug,
          body
        }`;

        const data = await sanityClient.fetch(query);

        setPost(data);
      }
      fetchPosts();
    }, []);
    
  return (
    <div className="start-page">
      <h2>
        {post?.title || "Inga title hittades"}
      </h2>
      {post?.body?.length > 0 ? (
        post.body.map((block, index) => {
          if (block._type === "block") {
            return (
              <p key={index}>
                {block.children.map((child) => child.text).join("")}
              </p>
            );
          }
          return null;
        })
      ) : (
        <p>Inget innehåll tillgängligt</p>
      )}
      <EventCard  />
    </div>
  );
}
export default StartPage;
