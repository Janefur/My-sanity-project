import EventCard from "../components/Eventcard";
import React, { use } from "react";
import { useEffect, useState } from "react";
import { sanityClient } from "../sanityClient"; // <-- här importerar du klienten
import './SingleEvent.css';

function SingleEvent() {   
  const [post, setPost] = useState(null);
    useEffect(() => {
      async function fetchPosts() {
        const query = `*[_type == "pageType" && slug.current == "event"][0] {
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
    <div className="single-event">
      <h2>
        {post?.title || "Ingen sida hittades"}
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
    </div>
  );
}
export default SingleEvent;
