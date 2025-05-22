// React Frontend: PropertyManagement.js
import AgencyChatBot from "../AgencyChatBot";

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import Footer from "../Footer.js"
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Modal from "react-modal";



const AccountDropdown = ({ onLogout, openModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>

      <button
        style={styles.accountButton}
        onClick={() => setIsOpen(!isOpen)}
        
      >
      <FaUserCircle size={20} />
        
      </button>
      {isOpen && (
        <div style={styles.dropdownMenu}>
          <Link style={styles.dropdownItem}>Payment</Link>
          <Link to="/estateAgency/ProfileManagementAgencyAdmin" style={styles.dropdownItem}>Account management</Link>
          <Link onClick={openModal} style={styles.dropdownItem}>Logout</Link>
        </div>
      )}
    </div>
  );
};




const DashboardAgency = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [properties, setProperties] = useState([]);
  const [formData, setFormData] = useState({
    description: "",
    price: "",
    transactionType: "Buy",
    propertyType: "Apartment",
    location: "",
    space: "",
    images: [],
  });
  const fileInputRef = useRef();
  const formRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);


  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
  const agencyAdminId = user?._id || user?.id;

  useEffect(() => {
    if (!agencyAdminId) {
      alert("Please log in to manage properties.");
      navigate("/estateAgency/login");
    } else {
      fetchProperties(agencyAdminId);
    }

    console.log("Loaded agencyAdminId:", agencyAdminId);
    console.log("User object:", user);

  }, [agencyAdminId]);

  const fetchProperties = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/properties/${id}`);
      const json = await res.json();
      if (json.success) {
        setProperties(json.properties);
      } else {
        console.warn("Property fetch failed:", json.message);
      }
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      images: Array.from(e.target.files),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const data = new FormData();
    data.append("agencyAdminId", agencyAdminId);
    Object.entries(formData).forEach(([key, value]) => {
      if (key !== "images") data.append(key, value);
    });
    formData.images.forEach((file) => data.append("images", file));

    try {
      const url = editing
        ? `${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/property/${editing}`
        : "${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/property";
      const method = editing ? "PUT" : "POST";

      const res = await axios({
        method,
        url,
        data,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        alert(editing ? "Property updated!" : "Property added!");
        setFormData({
          description: "",
          price: "",
          transactionType: "Buy",
          propertyType: "Apartment",
          location: "",
          space:"",
          images: [],
        });
        setEditing(null);
        fileInputRef.current.value = null;
        fetchProperties(agencyAdminId);
      } else {
        alert(editing ? "Update failed." : "Add failed.");
      }
    } catch (err) {
      console.error("Submit error:", err);
      alert("Error submitting property.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/property/${id}`, {
        method: "DELETE",
      });
      const json = await res.json();
      if (json.success) {
        setProperties(properties.filter((p) => p._id !== id));
      } else {
        alert("Delete failed.");
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleEdit = (property) => {
    setEditing(property._id);
    formRef.current?.scrollIntoView({ behavior: "smooth" });
    setFormData({
      description: property.description || "",
      price: property.price || "",
      transactionType: property.transactionType || "Buy",
      propertyType: property.propertyType || "Apartment",
      location: property.location || "",
      space: property.space || "",
      images: [],
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");

    try {
      await axios.post(
        "${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/logout",
        { agencyAdminId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.error("Estate Agency logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("agencyAdminId");
    localStorage.removeItem("user");
    navigate("/estateAgency/login", { replace: true });
  };


  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageIndices, setImageIndices] = useState({});
  const handleNextImage = (propertyId, imagesLength) => {
    setImageIndices((prev) => ({
      ...prev,
      [propertyId]: (prev[propertyId] + 1) % imagesLength,
    }));
  };

  const handlePreviousImage = (propertyId, imagesLength) => {
    setImageIndices((prev) => ({
      ...prev,
      [propertyId]: (prev[propertyId] - 1 + imagesLength) % imagesLength,
    }));
  };


    return (
    <>
   
    <div style={styles.accountButtonWrapper}>

           <AccountDropdown onLogout={handleLogout} openModal={openModal} />
    </div>
 
    <div style={styles.container1}>
    <ul style={styles.card}>
  {properties.map((property) => {
    const currentIndex = imageIndices[property._id] || 0;

    return (
      <li key={property._id} style={styles.propertyCard}>

        {property?.images?.length > 0 && (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      position: 'relative',
      width: '100%',
      height: 'auto',
      marginBottom: '10px',
    }}
  >
    <div style={{ width: '300px', height: '200px' }}>
      <img
        src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${property.images[currentIndex].fileId}`}
        alt={`property-${currentIndex}`}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: '8px',
          objectFit: 'cover',
        }}
      />
    </div>

    <div
      style={{
        marginTop: '8px',
        display: 'flex',
        justifyContent: 'center',
        gap: '8px',
        flexWrap: 'wrap',
        maxWidth: '420px',
      }}
    >
      {property.images.map((img, idx) => (
        <img
          key={img.fileId}
          src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${img.fileId}`}
          alt={`thumbnail-${idx}`}
          onClick={() => setImageIndices(prev => ({ ...prev, [property._id]: idx }))}
          style={{
            width: '60px',
            height: '45px',
            objectFit: 'cover',
            borderRadius: '4px',
            cursor: 'pointer',
            border: idx === currentIndex ? '2px solid #1E5470' : '1px solid #ccc',
            opacity: idx === currentIndex ? 1 : 0.6,
            transition: 'all 0.3s ease',
          }}
        />
      ))}
    </div>
  </div>
)}




          <div style={{ ...styles.displayBox }}>
          <h3>{property.name}</h3>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: '20px' }}>
            {/* Column 1 */}
            <div style={{ flex: 1 }}>
              <p><strong>Transaction Type:</strong> {property.transactionType}</p>
              <p><strong>Property Type:</strong> {property.propertyType}</p>
              <p><strong>Space:</strong> {property.space} m²</p>
            </div>

            {/* Column 2 */}
            <div style={{ flex: 1 }}>
              <p><strong>Location:</strong> {property.location}</p>
              <p><strong>Price:</strong> {property.price} DA</p>
              <p><strong>Description:</strong> {property.description}</p>
            </div>
          </div>
        </div>


        <div className="button-container" style={{ display: "flex", alignItems: "center", backgroundColor: "white" }}>
          <button
            onClick={() => handleEdit(property)}
            style={styles.editButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#6EC1D1")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1E5470")}
          >
            Edit
          </button>

         <button

            onClick={() => {
              if (window.confirm("Are you sure you want to delete this property?")) {
                handleDelete(property._id);
              }
            }}
            style={styles.deleteButton}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#1C2529")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1E5470")}
          >
            Delete
        </button>

        </div>
      </li>
    );
  })}
</ul>

 

    </div>


<h2 style={styles.title}>Property Management</h2>
<div ref={formRef} style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <div style={styles.row}>
          <select name="transactionType" value={formData.transactionType} onChange={handleChange} style={styles.input}>
            <option value="Buy">Buy</option>
            <option value="Rent">Rent</option>
            <option value="Exchange">Exchange</option>
            <option value="Other">Other</option>
          </select>

          <div style={styles.spaceBetween} />

          <select name="propertyType" value={formData.propertyType} onChange={handleChange} style={styles.input}>
            <option value="Garage">Garage</option>
            <option value="Apartment">Apartment</option>
            <option value="Land">Land</option>
            <option value="Villa">Villa</option>
          </select>
        </div>

        <div style={styles.row}>
          <input
            type="number"
            name="price"
            placeholder="Price (DA)"
            value={formData.price}
            onChange={handleChange}
            required
            style={styles.input}
          />

          <div style={styles.spaceBetween} />
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            onChange={handleImageChange}
            style={styles.input}
          />
        </div>

        <div style={styles.row}>
        {formData.images && formData.images.length > 0 && (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '10px' }}>
            {formData.images.map((img, index) => (
              <img
                key={index}
                src={URL.createObjectURL(img)}
                alt={`preview-${index}`}
                style={{ width: '120px', height: '100px', objectFit: 'cover', borderRadius: '8px' }}
              />
            ))}
          </div>
        )}

        <textarea
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
          style={styles.textareaLocation}
        />
          <div style={styles.spaceBetween} />


        <input
          type="number"
          name="space"
          value={formData.space || ""}
          onChange={handleChange}
          placeholder="Property space (m²)"
          required
          style={styles.textareaLocation}

        />
        </div>


        <textarea
          name="description"
          placeholder="Property Description"
          value={formData.description}
          onChange={handleChange}
          required
          style={styles.textarea}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            ...styles.button,
            cursor: loading ? "not-allowed" : "pointer",
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => {
            if (!loading) e.target.style.backgroundColor = "#6EC1D1";
          }}
          onMouseLeave={(e) => {
            if (!loading) e.target.style.backgroundColor = "#1C2529";
          }}
        >
        {loading
          ? editing
            ? "Updating..."
            : "Adding..."
          : editing
          ? "Update Property"
          : "Add Property"}
            </button>

            </form>
          <AgencyChatBot/>


          <button
            style={styles.addButton}
            onClick={() => {
              formRef.current?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            +
          </button>
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Confirm Logout"
            style={{
              content: {
                top: "50%",
                left: "50%",
                right: "auto",
                bottom: "auto",
                marginRight: "-50%",
                transform: "translate(-50%, -50%)",
                padding: "30px",
                borderRadius: "10px",
                textAlign: "center"
              }
            }}
          >
      <p>Are you sure you want to logout?</p>
      <div style={{ marginTop: "20px" }}>
        <button onClick={confirmLogout} style={{ marginRight: "10px", padding: "10px 20px", backgroundColor: "#6EC1D1", color: "#fff", border: "none", borderRadius: "5px", height:"auto" }}>
          Yes, Logout
        </button>
        <button onClick={closeModal} style={{ padding: "10px 20px", backgroundColor: "#ccc", border: "none", borderRadius: "5px", height:"auto" }}>
          Cancel
        </button>
      </div>
    </Modal>


     
      </div>
  <Footer/>
    </>
  );
  };


// Styles
const styles = {
  addButton: {
    position: "fixed",
    top: "5px",
    right: "5px",
    fontSize: "6rem",
    padding: "10px 20px",
    color: "#1E5470",
    // color:"#f683000",
    border: "none",
    borderRadius: "50%",
    cursor: "pointer",
    backgroundColor:"transparent",
    textDecoration: "none", // ✅ removes underline
  },
  accountButton: {
    height:"60px",
    display: "flex",
    alignItems: "center",
    backgroundColor: "#1E5470",//A8A0C6

    color: "#fff",
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  },
accountButtonWrapper: {
    position: "absolute",
    top: "20px",
    left: "10px", // ⬅️ changed from right to left
    zIndex: 100,
  },
      
  dropdownItem: {
    display: "block",
    padding: "10px 20px",
    textAlign: "left",
    backgroundColor: "white",
    border: "none",
    fontSize: "14px",
    color: "#1C2529",
    cursor: "pointer",
    textDecoration: "none",
    marginBottom: "0px", // ✅ Reduced from "2px" to "0px"
  },

 spaceBetween:{
  width:"40px"
},
  row: {
    marginBottom: "5px",

    display: "flex",
},
  title: {
    textAlign: "left",
    marginTop:"40px",
    fontSize: "24px",
    fontWeight: "500",
    color: "#333",
    paddingLeft: "15px"
  },
 
  container: {
    marginLeft:"5px",
    marginRight:"5px",
    // padding: "20px",
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
    // // height: "100vh",
    // backgroundColor: "#f5f5f5",
    // alignItems: "center",
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    // width: "95%",
    marginTop: "15px",
    fontSize: "13px",
  },
  form: {
    marginBottom: "20px"
  },
  input: {
    width: "98.3%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  input1: {

    textAlign: "leftTop",
  
    width: "98.3%",
    height:"200px",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
  },
  textarea: {
    width: "98.3%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    height: "200px",
    resize: "none"
},

  textareaLocation:{   
    width: "98.3%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    height:"20px",
    resize: "none"

  },

  button: {
    marginTop: "20px",
    width: "20%",
    height: "50px",
    borderRadius: "15px",
    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "none",
    backgroundColor: "#1C2529",
    },
  container1: {
    padding: "10px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  card: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "20px",
    listStyle: "none",
    padding: "0",
    width: "100%",
  },
  propertyCard: {
    width: "95%",
    backgroundColor: "#fff",
    padding: "15px",
    borderRadius: "8px",
    boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
    textAlign: "left",
  },
  imageContainer: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "10px",
  },
  image: {
    width: "200px",
    height: "200px",
    objectFit: "cover",
    borderRadius: "5px",
  },
   editButton: {
    backgroundColor: "#1E5470",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    margin: "5px",
    cursor: "pointer",
    borderRadius: "5px",
    width:"150PX",
    height:"40px"
  },

  deleteButton: {
    backgroundColor: "#1E5470",
    color: "#fff",
    border: "none",
    padding: "10px 15px",
    margin: "5px",
    cursor: "pointer",
    borderRadius: "5px",
    width:"150PX",
    height:"40px"


  }
};

export default DashboardAgency;


