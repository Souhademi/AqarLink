

// export default SavedPropertiesPage;
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { ClipLoader } from 'react-spinners';
import ChatBot from "../ChatBot.js";

const SavedPropertiesPage = () => {
  const [savedProperties, setSavedProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSavedProperties = async () => {
      try {
        const clientId = localStorage.getItem('clientId');
        if (!clientId) {
          console.error('No client logged in.');
          setLoading(false);
          return;
        }

        const res = await axios.get(`http://localhost:5000/api/auth/client/saved-properties/${clientId}`);
        setSavedProperties(res.data.savedProperties);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching saved properties:', error);
        setLoading(false);
      }
    };

    fetchSavedProperties();
  }, []);

  if (loading) {
    return (
      <div style={{
        width: '100vw',
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f3f4f6'
      }}>
        <ClipLoader size={50} color="#4b9cd3" />
      </div>
    );
  }

  if (savedProperties.length === 0) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f9fafb',
        padding: '1rem',
      }}>
        <h2 style={{ fontSize: '1.875rem', color: '#1f2937', marginBottom: '1rem' }}>
        Cannot retrieve saved properties at this time. Please try again later.
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '1.5rem' }}>
          You haven’t saved any properties yet. Explore and save your favorite listings.
        </p>
        <Link to="/" style={{
          backgroundColor: '#1E5470',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '0.5rem',
          textDecoration: 'none',
          fontWeight: '600',
          fontSize: '1rem',
        }}>
          Browse Properties
        </Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f9fafb', padding: '2.5rem 1rem' }}>
      <div style={{ maxWidth: '80rem', margin: '0 auto 2.5rem' }}>
        <h2 style={{ fontSize: '1.875rem', color: '#1f2937', marginBottom: '2rem', textAlign: 'start' }}>
          My Saved Properties
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {savedProperties.map((property) => (
            <div
              key={property._id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '1rem',
                boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
                transition: 'box-shadow 0.3s',
                display: 'grid',
                gridTemplateColumns: '300px 1fr',
                height: '300px',
                cursor: 'pointer'
              }}
            >
              <Link to={`/property/${property._id}`} style={{ textDecoration: 'none', color: 'inherit', display: 'contents' }}>
                <div style={{ height: '300px', width: '300px' }}>
                  <img
                    src={`http://localhost:5000/api/auth/imageProperty/${property.images[0]?.fileId}`}
                    alt={property.location}
                    style={{
                      height: '300px',
                      width: '300px',
                      objectFit: 'cover',
                      borderTopLeftRadius: '1rem',
                      borderBottomLeftRadius: '1rem',
                    }}
                  />
                </div>

                <div style={{
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}>
                  <div>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      <strong>Posted on:</strong> {new Date(property.updatedAt).toLocaleDateString()}
                    </p>
                    <h3 style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>
                      {property.transactionType} - {property.propertyType}
                    </h3>
                    <p style={{ fontSize: '1rem', color: '#374151' }}>{property.location}</p>
                  </div>
                  <p style={{ fontWeight: 'bold', fontSize: '1.25rem', color: '#1E5470' }}>
                    {property.price.toLocaleString()} DZD
                  </p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '3rem' }}>
        <ChatBot />
      </div>
    </div>
  );
};

export default SavedPropertiesPage;
