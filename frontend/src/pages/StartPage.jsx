
import Carousel from "../components/Carousel";
import Searchbar from "../components/Searchbar";
import Filter from "../components/Filter";
import { useEffect, useState } from "react";
import { sanityQueries } from "../sanityQueries";
import './StartPage.css';

function StartPage({ language, events, pages, currentUser }) {
    const [post, setPost] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [isFiltering, setIsFiltering] = useState(false);




    useEffect(() => {
      // Om pages prop finns, använd den istället för att hämta
      if (pages) {
        setPost(pages);
      } else {
        async function fetchPageData() {
          const pageData = await sanityQueries.getPageBySlug("startsida", language || "sv");
          setPost(pageData);
        }
        fetchPageData();
      }
    }, [pages, language]);

    

  return (
    <div className="start-page">
    <h2 className="start-page-greeting">
      {currentUser
        ? `Hej ${currentUser.username}`
        : (Array.isArray(post) ? post[0]?.title : post?.title)
      }
    </h2>
      {post?.ingress?.length > 0 ? (
        post.ingress.map((block, index) => {
          if (block._type === "block") {
            return (
              <p key={index} className="start-page-ingress">
                {block.children.map((child) => child.text).join("")}
              </p>
            );
          }
          return null;
        })
      ) : (
        <p>Inget innehåll tillgängligt</p>
      )}
      <Searchbar language={language} onSearchChange={setIsSearching} isFiltering={isFiltering} />
      <Filter showAllTags={true} language={language} events={events} isSearching={isSearching} onFilterChange={setIsFiltering} />
    
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
