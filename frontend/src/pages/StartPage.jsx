
import Carousel from "../components/Carousel";
import Searchbar from "../components/Searchbar";
import Filter from "../components/Filter";
import { useEffect, useState } from "react";
import { sanityQueries } from "../sanityQueries";
import './StartPage.css';

function StartPage() {
    const [post, setPost] = useState(null);

    useEffect(() => {
      async function fetchPageData() {
        const pageData = await sanityQueries.getPageBySlug("startsida");
        setPost(pageData);
      }
      fetchPageData();
    }, []);

  return (
    <div className="start-page">
      <h2>
        {post?.title || "Inga title hittades"}
      </h2>
      <Searchbar />
      <Filter showAllTags={true} />
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
      {post?.carousel && post.carousel.length > 0 && (
        <Carousel carousel={post.carousel[0]} />
      )}
      {post?.carousel && post.carousel.length > 1 && (
        <Carousel carousel={post.carousel[1]} />
      )}
    </div>
  );
}
export default StartPage;
