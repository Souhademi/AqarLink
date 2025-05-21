// import React, { useState, useEffect } from 'react';
// import axios from 'axios';

// const ClientPropertyList = () => {
//   const [property, setProperty] = useState(null);
//   const [editingProperty, setEditingProperty] = useState(null);
//   const [error, setError] = useState('');

//   const clientId = localStorage.getItem('clientId');
//   const token = localStorage.getItem('clientToken');
  
  



//   useEffect(() => {
//     fetchProperty();
//   }, []);

//   const fetchProperty = async () => {
//     try {
//       const response = await axios.get(`http://localhost:5000/api/auth/client/property/${clientId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setProperty(response.data.property || null);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to fetch property.');
//     }
//   };

//   const handleDelete = async () => {
//     if (!window.confirm('Are you sure you want to delete your property features?')) return;

//     try {
//       await axios.delete(`http://localhost:5000/api/auth/client/property`, {
//         headers: { Authorization: `Bearer ${token}` },
//         data: { clientId },
//       });
//       setProperty(null);
//     } catch (err) {
//       console.error(err);
//       setError('Failed to delete property features.');
//     }
//   };

//   const handleUpdate = async () => {
//     if (
//       !editingProperty?.type ||
//       !editingProperty?.location?.length ||
//       !editingProperty?.price?.min ||
//       !editingProperty?.price?.max ||
//       !editingProperty?.space?.min || !editingProperty?.space?.max

//     ) {
//       return setError('Please fill all required fields.');
//     }

//     try {
//       const response = await axios.put(
//         `http://localhost:5000/api/auth/client/property/${clientId}`,
//         editingProperty,
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );
//       if (response.data.success) {
//         setEditingProperty(null);
//         fetchProperty();
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Failed to update property features.');
//     }
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
  
//     if (name === 'location') {
//       setEditingProperty((prev) => ({
//         ...prev,
//         [name]: value.split(',').map((v) => v.trim()),
//       }));
//     } else if (name === 'priceMin' || name === 'priceMax') {
//       setEditingProperty((prev) => ({
//         ...prev,
//         price: {
//           ...prev.price,
//           [name === 'priceMin' ? 'min' : 'max']: Number(value),
//         },
//       }));
//     } else if (name === 'spaceMin' || name === 'spaceMax') {
//       setEditingProperty((prev) => ({
//         ...prev,
//         space: {
//           ...prev.space,
//           [name === 'spaceMin' ? 'min' : 'max']: Number(value),
//         },
//       }));
//     } else {
//       setEditingProperty((prev) => ({ ...prev, [name]: value }));
//     }
//   };
  
//   return (
//     <div style={{
//       display: 'flex',
//       justifyContent: 'center',
//       alignItems: 'center',
//       minHeight: '80vh',
//       padding: '1rem'
//     }}>
//       <div style={{ width: '100%', maxWidth: '600px' }}>
//         {!property && <AddClientProperty onPropertyAdded={fetchProperty} />}

//         {error && <div style={{ color: 'red' }}>{error}</div>}

//         {property ? (
//           <div style={styles.card}>
//             <h2>Your Property Features</h2>
//             {editingProperty ? (
//               <>
//                 <label>Type:</label>
//                 <input name="type" value={editingProperty.type} style={styles.card1} onChange={handleChange} />

//                 <label>Location(s):</label>
//                 <input
//                   name="location"
//                   value={editingProperty.location?.join(', ') || ''}
//                   onChange={handleChange}
//                 />

//                 <label>Space Min (m²):</label>
//                 <input
//                   name="spaceMin"
//                   type="number"
//                   value={editingProperty.space?.min || ''}
//                   onChange={handleChange}
//                 />

//                 <label>Space Max (m²):</label>
//                 <input
//                   name="spaceMax"
//                   type="number"
//                   value={editingProperty.space?.max || ''}
//                   onChange={handleChange}
//                 />

//                 <label>Rooms:</label>
//                 <input name="rooms" type="number" value={editingProperty.rooms || ''} onChange={handleChange} />

//                 <label>Price Min:</label>
//                 <input name="priceMin" type="number" value={editingProperty.price?.min || ''} onChange={handleChange} />

//                 <label>Price Max:</label>
//                 <input name="priceMax" type="number" value={editingProperty.price?.max || ''} onChange={handleChange} />

//                 <button onClick={handleUpdate} style={styles.saveButton}>Save</button>
//                 <button onClick={() => setEditingProperty(null)} style={styles.cancelButton}>Cancel</button>
//               </>
//             ) : (
//               <>
//                 <p><strong>Type:</strong> {property.type}</p>
//                 <p><strong>Location(s):</strong> {property.location?.join(', ')}</p>
//                 <p><strong>Space:</strong> {property.space.min} - {property.space.max} m²</p>

//                 <p><strong>Rooms:</strong> {property.rooms || 'N/A'}</p>
//                 <p><strong>Price:</strong> {property.price.min} - {property.price.max} DZD</p>

//                 <button onClick={() => setEditingProperty(property)} style={styles.editButton}>Edit</button>
//                 <button onClick={handleDelete} style={styles.deleteButton}>Delete</button>
//               </>
//             )}
//           </div>
//         ) : (
//           <p>No property features added yet.</p>
//         )}
//       </div>
//     </div>
//   );
// };
// const AddClientProperty = ({ onPropertyAdded }) => {
//   const [type, setType] = useState('');
//   const [locationInput, setLocationInput] = useState('');
//   const [location, setLocations] = useState([]);
//   const [priceMin, setPriceMin] = useState('');
//   const [priceMax, setPriceMax] = useState('');
//   const [rooms, setRooms] = useState('');
//   const [spaceMin, setSpaceMin] = useState('');
//   const [spaceMax, setSpaceMax] = useState('');
  
//   const [error, setError] = useState(null);

//   const clientId = localStorage.getItem('clientId');
//   const token = localStorage.getItem('clientToken');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null);

//     const property = {
//       type,
//       location,
//       price: {
//         min: Number(priceMin),
//         max: Number(priceMax),
//       },
//       rooms: type === 'Villa' || type === 'Apartment' ? Number(rooms) : undefined,
//       space: {
//         min: Number(spaceMin),
//         max: Number(spaceMax),
//       },
      
//       clientId,
//     };

//     try {
//       const response = await axios.post('http://localhost:5000/api/auth/client/property', property, {
//         headers: {
//           'Content-Type': 'application/json',
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       if (response.data.success) {
//         alert('Property features added successfully!');
//         setType('');
//         setLocationInput('');
//         setLocations([]);
//         setPriceMin('');
//         setPriceMax('');
//         setRooms('');
//         setSpace('');
//         onPropertyAdded();
//       } else {
//         setError('Failed to add property features.');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Failed to add property features.');
//     }
//   };

//   const addLocation = () => {
//     if (locationInput.trim()) {
//       setLocations([...location, locationInput.trim()]);
//       setLocationInput('');
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} style={styles.form}>
//       <h2>Add Property Features For Notifications</h2>

//       {error && <div style={{ color: 'red' }}>{error}</div>}

//       <label style={{ marginLeft: "5px"}}>Property Type</label>
//       <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input} required>
//         <option value="">Select</option>
//         <option value="Apartment">Apartment</option>
//         <option value="Villa">Villa</option>
//         <option value="Land">Land</option>
//         <option value="Garage">Garage</option>
//       </select>

//       <label style={{ marginLeft: "5px"}}>Location(s)</label>
//       <div style={styles.row}>

//       <input value={locationInput} onChange={(e) => setLocationInput(e.target.value)} style={styles.input3} />

//       <button type="button" onClick={addLocation}style={{  alignItems:"end",width:"auto",height:"auto",backgroundColor:"transparent",color:"#1C2529",fontSize:"30px"}}>+</button>
//       <p>{location.join(', ')}</p>
//       </div>

//       <label style={{ marginLeft: "5px"}}>Price Min</label>
//       <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} style={styles.input1} required />

//       <label style={{ marginLeft: "5px"}}>Price Max</label>
//       <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} style={styles.input1} required />

//       {(type === 'Villa' || type === 'Apartment') && (
//         <>
//           <label style={{ marginLeft: "5px"}}>Rooms</label>
//           <input type="number" value={rooms} onChange={(e) => setRooms(e.target.value)} style={styles.input1} />
//         </>
//       )}

//     <label style={{ marginLeft: "5px"}}>Space Min (m²)</label>
//     <input type="number" value={spaceMin} onChange={(e) => setSpaceMin(e.target.value)} style={styles.input1} required />

//     <label style={{marginLeft: "5px"}}>Space Max (m²)</label>
//     <input type="number" value={spaceMax} onChange={(e) => setSpaceMax(e.target.value)} style={styles.input1} required />


//       <button type="submit" style={styles.button} onMouseEnter={(e) => {
//             e.target.style.backgroundColor = "#6EC1D1"; // Change color on hover
//           }}
//           onMouseLeave={(e) => {
//             e.target.style.backgroundColor = "#1C2529"; // Revert color when mouse leaves
//           }}>Add features</button>
//     </form>
//   );
// };


// const styles = {
//   button:{backgroundColor:"#1C2529",width: "150px",height: "40px",marginLeft: "5px"},
// card1: {
//     display: 'flex',
//     flexDirection: 'column',
//     alignItems: 'center',     // horizontally center
//     justifyContent: 'center', // vertically center
//     margin: '10px 0',
//     padding: '10px',
//     width: '100%',
//   },
//   card: {  
//     backgroundColor: '#f9f9f9',
//     borderRadius: '10px',
//     padding: '20px',
//     boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//     width: '100%',
//   },
//   input: {
//     padding: '8px',
//     width: '99%',
//     marginBottom: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   input1: {
//     padding: '8px',
//     width: '95%',
//     marginBottom: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//   },
//   input3: {
//     padding: '8px',
//     marginBottom: '10px',
//     borderRadius: '5px',
//     border: '1px solid #ccc',
//     flex: 1,
//   },
//   row: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '10px',
//     marginBottom: '10px',
//   },
//   form: {
//     padding: '1rem',
//     border: '1px solid #ddd',
//     borderRadius: '8px',
//     backgroundColor: '#fff',
//   },
//   saveButton: {
//     backgroundColor: '#4CAF50',
//     color: 'white',
//     padding: '8px 16px',
//     border: 'none',
//     borderRadius: '5px',
//     marginRight: '10px',
//   },
//   cancelButton: {
//     backgroundColor: '#ccc',
//     padding: '8px 16px',
//     border: 'none',
//     borderRadius: '5px',
//   },
//    editButton: {
//     backgroundColor: '#6EC1D1',
//     color: '#1C2529',
//     padding: '0.5rem 1rem',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     marginRight: '10px',
//     height: "40px",width:"150px"
//   },
//   deleteButton: {
//     marginTop:"10px",
//     backgroundColor: '#e63946',
//     color: '#fff',
//     padding: '0.5rem 1rem',
//     border: 'none',
//     borderRadius: '5px',
//     cursor: 'pointer',
//     height: "40px",width:"150px"
//   },
// };

// export default ClientPropertyList;
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ChatBot from "../ChatBot.js"

const ClientPropertyList = () => {
  const [property, setProperty] = useState(null);
  const [editingProperty, setEditingProperty] = useState(null);
  const [error, setError] = useState('');

  const clientId = localStorage.getItem('clientId');
  const token = localStorage.getItem('clientToken');

  useEffect(() => {
    fetchProperty();
  }, []);

  const fetchProperty = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/auth/client/property/${clientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProperty(response.data.property || null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to fetch property.');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete your property features?')) return;

    try {
      await axios.delete(`http://localhost:5000/api/auth/client/property`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { clientId },
      });
      setProperty(null);
      setEditingProperty(null);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to delete property features.');
    }
  };

  const handleUpdate = async () => {
    if (
      !editingProperty?.type ||
      !editingProperty?.location?.length ||
      editingProperty.price?.min === undefined ||
      editingProperty.price?.max === undefined ||
      editingProperty.space?.min === undefined ||
      editingProperty.space?.max === undefined
    ) {
      return setError('Please fill all required fields.');
    }

    try {
      const response = await axios.put(
        `http://localhost:5000/api/auth/client/property/${clientId}`,
        editingProperty,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      if (response.data.success) {
        setEditingProperty(null);
        fetchProperty();
        setError('');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to update property features.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'location') {
      setEditingProperty((prev) => ({
        ...prev,
        [name]: value.split(',').map((v) => v.trim()),
      }));
    } else if (name === 'priceMin' || name === 'priceMax') {
      setEditingProperty((prev) => ({
        ...prev,
        price: {
          ...prev.price,
          [name === 'priceMin' ? 'min' : 'max']: Number(value),
        },
      }));
    } else if (name === 'spaceMin' || name === 'spaceMax') {
      setEditingProperty((prev) => ({
        ...prev,
        space: {
          ...prev.space,
          [name === 'spaceMin' ? 'min' : 'max']: Number(value),
        },
      }));
    } else if (name === 'rooms') {
      setEditingProperty((prev) => ({
        ...prev,
        rooms: value === '' ? undefined : Number(value),
      }));
    } else {
      setEditingProperty((prev) => ({ ...prev, [name]: value }));
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        padding: '1rem',
      }}
    >
      <div style={{ width: '100%', maxWidth: '600px' }}>
        {!property && <AddClientProperty onPropertyAdded={fetchProperty} />}

        {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

        {property ? (
          <div style={styles.card}>
            <h2>Your Property Features</h2>
            {editingProperty ? (
              <>
                <label>Type:</label>
                <select
                  name="type"
                  value={editingProperty.type}
                  style={styles.input}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="Apartment">Apartment</option>
                  <option value="Villa">Villa</option>
                  <option value="Land">Land</option>
                  <option value="Garage">Garage</option>
                </select>

                <label>Location(s):</label>
                <input
                  name="location"
                  value={editingProperty.location?.join(', ') || ''}
                  onChange={handleChange}
                  style={styles.input}
                />

                <label>Space Min (m²):</label>
                <input
                  name="spaceMin"
                  type="number"
                  value={editingProperty.space?.min || ''}
                  onChange={handleChange}
                  style={styles.input}
                />

                <label>Space Max (m²):</label>
                <input
                  name="spaceMax"
                  type="number"
                  value={editingProperty.space?.max || ''}
                  onChange={handleChange}
                  style={styles.input}
                />

                {(editingProperty.type === 'Villa' || editingProperty.type === 'Apartment') && (
                  <>
                    <label>Rooms:</label>
                    <input
                      name="rooms"
                      type="number"
                      value={editingProperty.rooms || ''}
                      onChange={handleChange}
                      style={styles.input}
                    />
                  </>
                )}

                <label>Price Min:</label>
                <input
                  name="priceMin"
                  type="number"
                  value={editingProperty.price?.min || ''}
                  onChange={handleChange}
                  style={styles.input}
                />

                <label>Price Max:</label>
                <input
                  name="priceMax"
                  type="number"
                  value={editingProperty.price?.max || ''}
                  onChange={handleChange}
                  style={styles.input}
                />

                <button onClick={handleUpdate} style={styles.saveButton}>
                  Save
                </button>
                <button onClick={() => setEditingProperty(null)} style={styles.cancelButton}>
                  Cancel
                </button>
              </>
            ) : (
              <>
                <p>
                  <strong>Type:</strong> {property.type}
                </p>
                <p>
                  <strong>Location(s):</strong> {property.location?.join(', ')}
                </p>
                <p>
                  <strong>Space:</strong> {property.space.min} - {property.space.max} m²
                </p>

                <p>
                  <strong>Rooms:</strong> {property.rooms ?? 'N/A'}
                </p>
                <p>
                  <strong>Price:</strong> {property.price.min} - {property.price.max} DZD
                </p>

                <button onClick={() => setEditingProperty(property)} style={styles.editButton}>
                  Edit
                </button>
                <button onClick={handleDelete} style={styles.deleteButton}>
                  Delete
                </button>
              </>
            )}
          </div>
        ) : (
          <p>No property features added yet.</p>
        )}
      </div>
      <ChatBot/>
    </div>
  );
};

const AddClientProperty = ({ onPropertyAdded }) => {
  const [type, setType] = useState('');
  const [locationInput, setLocationInput] = useState('');
  const [location, setLocations] = useState([]);
  const [priceMin, setPriceMin] = useState('');
  const [priceMax, setPriceMax] = useState('');
  const [rooms, setRooms] = useState('');
  const [spaceMin, setSpaceMin] = useState('');
  const [spaceMax, setSpaceMax] = useState('');
  const [error, setError] = useState(null);

  const clientId = localStorage.getItem('clientId');
  const token = localStorage.getItem('clientToken');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!type || location.length === 0 || !priceMin || !priceMax || !spaceMin || !spaceMax) {
      setError('Please fill all required fields.');
      return;
    }

    const property = {
      type,
      location,
      price: {
        min: Number(priceMin),
        max: Number(priceMax),
      },
      rooms: type === 'Villa' || type === 'Apartment' ? Number(rooms) : undefined,
      space: {
        min: Number(spaceMin),
        max: Number(spaceMax),
      },
      clientId,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/auth/client/property', property, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        alert('Property features added successfully!');
        setType('');
        setLocationInput('');
        setLocations([]);
        setPriceMin('');
        setPriceMax('');
        setRooms('');
        setSpaceMin('');
        setSpaceMax('');
        onPropertyAdded();
      } else {
        setError('Failed to add property features.');
      }
    } catch (err) {
      console.error(err);
      setError('Failed to add property features.');
    }
  };

  const addLocation = () => {
    if (locationInput.trim()) {
      setLocations







((prev) => [...prev, locationInput.trim()]);
setLocationInput('');
}
};

const removeLocation = (loc) => {
setLocations((prev) => prev.filter((l) => l !== loc));
};

return (
<form
onSubmit={handleSubmit}
style={{
marginTop: '20px',
padding: '1rem',
border: '1px solid #ccc',
borderRadius: '6px',
}}
>
<h2>Add Property Features</h2>


  {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

  <label>Type:</label>
  <select value={type} onChange={(e) => setType(e.target.value)} style={styles.input}>
    <option value="">Select</option>
    <option value="Apartment">Apartment</option>
    <option value="Villa">Villa</option>
    <option value="Land">Land</option>
    <option value="Garage">Garage</option>
  </select>

  <label>Locations:</label>
  <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
    <input
      type="text"
      value={locationInput}
      onChange={(e) => setLocationInput(e.target.value)}
      placeholder="Add a location"
      style={{ flex: 1, padding: '6px 8px' }}
    />
    <button type="button" onClick={addLocation} style={styles.addButton}>
      +
    </button>
  </div>
  <div style={{ marginBottom: '10px' }}>
    {location.map((loc) => (
      <span
        key={loc}
        style={{
          display: 'inline-block',
          backgroundColor: '#007bff',
          color: '#fff',
          padding: '4px 8px',
          borderRadius: '12px',
          marginRight: '6px',
          cursor: 'pointer',
        }}
        onClick={() => removeLocation(loc)}
        title="Click to remove"
      >
        {loc} &times;
      </span>
    ))}
  </div>

  <label>Space Min (m²):</label>
  <input
    type="number"
    value={spaceMin}
    onChange={(e) => setSpaceMin(e.target.value)}
    style={styles.input}
  />

  <label>Space Max (m²):</label>
  <input
    type="number"
    value={spaceMax}
    onChange={(e) => setSpaceMax(e.target.value)}
    style={styles.input}
  />

  {(type === 'Villa' || type === 'Apartment') && (
    <>
      <label>Rooms:</label>
      <input
        type="number"
        value={rooms}
        onChange={(e) => setRooms(e.target.value)}
        style={styles.input}
      />
    </>
  )}

  <label>Price Min (DZD):</label>
  <input
    type="number"
    value={priceMin}
    onChange={(e) => setPriceMin(e.target.value)}
    style={styles.input}
  />

  <label>Price Max (DZD):</label>
  <input
    type="number"
    value={priceMax}
    onChange={(e) => setPriceMax(e.target.value)}
    style={styles.input}
  />

  <button type="submit" style={styles.saveButton}>
    Add Property Features
  </button>
</form>

);
};

const styles = {
card: {
border: '1px solid #ddd',
borderRadius: '8px',
padding: '20px',
backgroundColor: '#fff',
},
input: {
width: '100%',
padding: '8px 12px',
margin: '6px 0 12px',
boxSizing: 'border-box',
},
saveButton: {
backgroundColor: '#6EC1D1',
color: 'white',
border: 'none',
padding: '10px 16px',
cursor: 'pointer',
borderRadius: '4px',
marginRight: '8px',height:"auto"
},
cancelButton: {
backgroundColor: '#e63946',
color: 'white',
border: 'none',
padding: '10px 16px',
cursor: 'pointer',
borderRadius: '4px',height:"auto"
},
editButton: {
backgroundColor: '#6EC1D1',
color: 'white',
border: 'none',
padding: '10px 16px',
cursor: 'pointer',
borderRadius: '4px',
marginRight: '8px',height:"auto"
},
deleteButton: {
backgroundColor: '#e63946',
color: 'white',
border: 'none',
padding: '10px 16px',
cursor: 'pointer',
borderRadius: '4px',height:"auto"
},
addButton: {
backgroundColor: 'white',
color: 'black',
border: '1.5px solid black',

padding: '8px 12px',
cursor: 'pointer',
borderRadius: '4px',
height:"auto"
},
};

export default ClientPropertyList;