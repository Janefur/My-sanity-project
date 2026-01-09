import React, { useState } from 'react';
import './Carousel.css';

function Carousel({ carousel }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Fallback för olika data-strukturer
  let photo = [];
  let title = "";

  if (carousel?.images && carousel.images.length > 0) {
    // Struktur med images array
    photo = carousel.images;
    title = carousel.title;
  } else if (carousel?.events && carousel.events.length > 0) {
    // Struktur med events array - konvertera till image format
    photo = carousel.events.map(event => ({
      imageUrl: event.imageUrl,
      alt: event.name,
      caption: event.name,
      location: event.location,
      date: event.date
    }));
    title = carousel.title;
  } else if (carousel?.photo) {
    // Struktur med photo array
    photo = carousel.photo;
    title = carousel.title;
  } else if (Array.isArray(carousel)) {
    // Gammal struktur: [{ imageUrl: "", ... }]
    photo = carousel;
  }


  if (!photo || photo.length === 0) {
    return <div>Inga carousel-bilder att visa. Data: {JSON.stringify(carousel)}</div>;
  }

  const nextPhoto = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === photo.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevPhoto = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? photo.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="carousel">
      {title && (
        <h3 className="carousel-title">{title}</h3>
      )}
    
      
      <div className="carousel-container">
        <button className="carousel-btn prev" onClick={prevPhoto}>
          ‹
        </button>
        
        <div className="carousel-slide">
          <img 
            src={photo[currentIndex].imageUrl} 
            alt={photo[currentIndex].alt || `Slide ${currentIndex + 1}`}
          />
          {photo[currentIndex].caption && (
            <div className="">
              <p>{photo[currentIndex].caption}</p>
              <p>{photo[currentIndex].location}</p>
              <p>{photo[currentIndex].date}</p>
            </div>
          )}
        </div>

        <button className="carousel-btn next" onClick={nextPhoto}>
          ›
        </button>
      </div>

      {photo.length > 1 && (
        <div className="carousel-dots">
          {photo.map((_, index) => (
            <button
              key={index}
              className={`dot ${index === currentIndex ? 'active' : ''}`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Carousel;
