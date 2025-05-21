import React, { useState } from 'react';

const PropertyImages = ({ property }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = property.images || [];

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div style={styles.container}>
      {images.length > 0 && (
        <div style={styles.carousel}>
          <button onClick={handlePrev} style={styles.button}>
            &lt;
          </button>

          <img
            src={`http://localhost:5000/api/auth/imageProperty/${images[currentImageIndex].fileId}`}
            alt={`property-${currentImageIndex}`}
            style={styles.image}
          />

          <button onClick={handleNext} style={styles.button}>
            &gt;
          </button>
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  carousel: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  button: {
    fontSize: '24px',
    padding: '8px 16px',
    cursor: 'pointer',
    // backgroundColor: '#eee',
    border: '1px solid #ccc',
    borderRadius: '4px',
  },

    image: {
      width: "200px",
      height: "200px",
      objectFit: "cover",
      borderRadius: "5px",
    },

};

export default PropertyImages;
