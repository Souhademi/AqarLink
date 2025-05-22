// export default PropertyDetailsPage;
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Footer from '../Footer.js';
import ChatBot from '../ChatBot';
import { Bookmark, BookmarkBorder } from '@mui/icons-material'; // 👉 Import Save Icons (not Favorite)
import { ClipLoader } from 'react-spinners';



const PropertyDetailsPage = () => {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
      const fetchPropertyDetails = async () => {
        try {
          
          const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/propertyDetails/${id}`);
          setProperty(res.data.property);
        } catch (error) {
          console.error("Error fetching property details:", error);
        }
      };
    
      const checkIfPropertyIsSaved = async () => {
        try {
          const clientId = localStorage.getItem('clientId');
          if (!clientId) return; // No client logged in
    
          const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/client/check-saved-property`, {
            params: { clientId, propertyId: id }
          });
    
          if (res.data.isSaved) {
            setIsSaved(true);
          }
        } catch (error) {
          console.error('Error checking saved property:', error);
        }
      };
    
      fetchPropertyDetails();
      checkIfPropertyIsSaved();
    }, [id]);
    

  // if (!property) {
  //   return <div>Loading...</div>;
  // }
  if (!property) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <ClipLoader size={40} color="#4b9cd3" />
      </div>
    );
  }

  const handleSaveProperty = async () => {
    const clientId = localStorage.getItem('clientId');
    if (!clientId) {
      console.error('Client ID not found in localStorage.');
      return;
    }
  
    try {
      if (isSaved) {
        // Unsave
        await axios.post('${process.env.REACT_APP_BACKEND_URL}/api/auth/client/unsave-property', { clientId, propertyId: id });
        setIsSaved(false);
        console.log('Property unsaved!');
      } else {
        // Save
        await axios.post('${process.env.REACT_APP_BACKEND_URL}/api/auth/client/save-property', { clientId, propertyId: id });
        setIsSaved(true);
        console.log('Property saved!');
      }
    } catch (error) {
      console.error('Error saving/unsaving property:', error);
    }
  };
  
  const handlePreviousImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? property.images.length - 1 : prevIndex - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === property.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', margin: '0', backgroundColor: '#f5f5f5' }}>
      
      <div style={{ display: 'flex', flexDirection: 'row', gap: '30px', marginTop: '20px', margin: '20px' }}>
        
        {/* LEFT SIDE */}
        <div style={{ flex: 1, textAlign: 'start', position: 'relative' }}>


        {property?.images?.length > 0 && (
  <div style={{ position: 'relative', width: '500px', height: '400px' }}>
    <img
      src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${property.images[currentImageIndex].fileId}`}
      alt="Property"
      style={{ width: '500px', height: '400px', borderRadius: '8px', objectFit: 'cover' }}
    />

    {/* Show buttons only if more than 1 image */}
    {property.images.length > 1 && (
      <>
        {/* Previous Button */}
        <button
          onClick={handlePreviousImage}
          style={{
            position: 'absolute',
            top: '50%',
            left: '10px',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ‹
        </button>

        {/* Next Button */}
        <button
          onClick={handleNextImage}
          style={{
            position: 'absolute',
            top: '50%',
            right: '10px',
            transform: 'translateY(-50%)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '40px',
            height: '40px',
            fontSize: '20px',
            cursor: 'pointer',
          }}
        >
          ›
        </button>
      </>
    )}
  </div>
)}



          <div style={{ marginTop: '20px', marginBottom: '40px' }}>
            <h3>Property Description</h3>
            <p>{property.description}</p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div style={{ flex: 1, textAlign: 'start' }}>
          <p><strong>Agency:</strong> {property?.agencyName}</p>
          <p><strong>Agency Phone:</strong> {property?.phone}</p>
          <p><strong>Posted on:</strong> {new Date(property.updatedAt).toLocaleDateString()}</p>
          <p><strong>Transaction Type:</strong> {property.transactionType}</p>
          <p><strong>Property Type:</strong> {property.propertyType}</p>
          <p><strong>Location:</strong> {property.location}</p>
          <p><strong>Property Space:</strong> {property.space} m²</p>
          <p><strong>Price:</strong> {property.price} DZD</p>

          {/* Save Icon */}
          <div
            onClick={handleSaveProperty}
            style={{
              marginTop: '30px',
              cursor: 'pointer',
              color: isSaved ? '#1E5470' : '#1C2529', // Blue color when saved
            }}
          >
            {isSaved ? <Bookmark sx={{ fontSize: 40 }} /> : <BookmarkBorder sx={{ fontSize: 40 }} />}
          </div>
        </div>

      </div>

      <ChatBot />
      {/* <Footer /> */}
    </div>
  );
};

export default PropertyDetailsPage;
