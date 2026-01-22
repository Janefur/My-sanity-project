
import { useState, useEffect, useRef } from "react";
import"../pages/CreateEvent.css";


function ImageUpload({ onImageSelect, initialImage, resetTrigger }) {
  const [preview, setPreview] = useState(initialImage || null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

  // Nollställ bild och file input när resetTrigger ändras
  useEffect(() => {
    if (resetTrigger) {
      setPreview(null);
      if (onImageSelect) onImageSelect(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }, [resetTrigger, onImageSelect]);

  // Hantera när användaren väljer en bild
  function handleImageChange(event) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result;
        setPreview(base64);
        if (onImageSelect) onImageSelect(base64);
      };
      reader.readAsDataURL(file);
    }
  }

  // Rensa vald bild
 function handleRemoveImage() {
    setPreview(null);
    if (onImageSelect) onImageSelect(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  return (
    <div className="image-upload">
      <p style={{ fontWeight: "bold" }}>
        Ladda upp en bild för ditt event (valfritt):
      </p>
      <input type="file" accept="image/*" onChange={handleImageChange} ref={fileInputRef} />

      {preview && (
        <div className="image-preview-container">
          <img className="image-preview"
            src={preview}
            alt="Förhandsvisning"
          
          />
          <div>
            <button
              onClick={handleRemoveImage}
              className="remove-image-button"
          
            >
              Ta bort bild
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ImageUpload;
