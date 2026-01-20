import { useState, useEffect } from "react";

function ImageUpload({ onImageSelect, initialImage }) {
  const [preview, setPreview] = useState(initialImage || null);

  useEffect(() => {
    setPreview(initialImage || null);
  }, [initialImage]);

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
  }

  return (
    <div className="image-upload">
      <p style={{ fontWeight: "bold" }}>
        Ladda upp en bild för ditt event (valfritt):
      </p>
      <input type="file" accept="image/*" onChange={handleImageChange} />

      {preview && (
        <div style={{ marginTop: "20px", textAlign: "center" }}>
          <img
            src={preview}
            alt="Förhandsvisning"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "8px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
            }}
          />
          <div>
            <button
              onClick={handleRemoveImage}
              style={{
                backgroundColor: "#007bffff",
                color: "white",
                border: "none",
                borderRadius: "6px",
                padding: "24px",
                width: "75%",
                marginTop: "20px",
                cursor: "pointer",
              }}
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
