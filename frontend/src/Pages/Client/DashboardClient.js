import React, { useState,useEffect,useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ClipLoader } from "react-spinners";

import { FaSearch } from 'react-icons/fa';
import { FaUserCircle } from "react-icons/fa";
import Footer from "../Footer.js";
import ChatBot from "../ChatBot.js";


import '../Home.css'; 
import axios from 'axios';

import Modal from "react-modal"; // if using React Modal



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
         
          <Link to="/client/saved-properties" style={styles.dropdownItem}>Saved Property</Link>
          <Link to="/client/addPropertyFeatures" style={styles.dropdownItem}>Add property features</Link> 
          <Link to="/client/notifications" style={styles.dropdownItem}>Notifications</Link>
          <Link to="/client/profileManagementClient" style={styles.dropdownItem}>Account management</Link>
          <Link onClick={openModal} style={styles.dropdownItem}>Logout</Link>

         
        </div>
      )}
    </div>
  );
};

const SearchInput = ({ searchQuery, setSearchQuery }) => {
  return (
    <div style={searchStyles.inputContainer}>
      <input
        type="text"
        placeholder="SEARCH"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={searchStyles.input}
      />
      <FaSearch style={searchStyles.icon} />
    </div>
  );
};



const DashboardClient = () => {
  const [selectedTransactionType, setSelectedTransactionType] = useState("");
  const [selectedPropertyType, setSelectedPropertyType] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState(0); // Initial max price
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [error, setError] = useState(""); // Add this with other useState declarations

  const [tempTransactionType, setTempTransactionType] = useState("");
  const [tempPropertyType, setTempPropertyType] = useState("");

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const confirmLogout = () => {
    handleLogout();
    closeModal();
  };

  useEffect(() => {
    const clientToken = localStorage.getItem("clientToken");

    if (!clientToken) {
      navigate("/client/login", { replace: true });
    }

    const fetchProperties = async () => {
 
      try {
  const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/properties`);
  // setProperties(res.data.properties);
  console.log("📦 Properties fetch response:", res.data); // Debug
// setProperties(res.data?.properties || []);
if (Array.isArray(res.data)) {
  setProperties(res.data);
} else if (Array.isArray(res.data.properties)) {
  setProperties(res.data.properties);
} else {
  setProperties([]);
  setError("Unexpected properties data format");
}


  setError(""); // clear any previous error
} catch (error) {
  console.error("❌ Error fetching properties:", error);
  setError("Cannot retrieve properties at this time. Please try again later.");
} finally {
  setLoading(false);
}

    };

    fetchProperties();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const clientId = localStorage.getItem("clientId");
      const clientToken = localStorage.getItem("clientToken");

      if (!clientId || !clientToken) {
        localStorage.removeItem("clientId");
        localStorage.removeItem("clientToken");
        navigate("/client/login", { replace: true });
        return;
      }

      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/client/logout`,
        { clientId },
        {
          headers: {
            Authorization: `Bearer ${clientToken}`,
          },
        }
      );

      if (response.data.success) {
        localStorage.removeItem("clientToken");
        localStorage.removeItem("clientId");
        navigate("/client/login", { replace: true });
      } else {
        alert("Logout failed. Please try again.");
      }
    } catch (error) {
      alert("Logout failed. Please try again.");
      console.error(error);
    }
  };


const filteredProperties = Array.isArray(properties)
  ? properties.filter((property) => {
      const matchesTransaction = selectedTransactionType
        ? property.transactionType === selectedTransactionType
        : true;
      const matchesPropertyType = selectedPropertyType
        ? property.propertyType === selectedPropertyType
        : true;
      const matchesMaxPrice = maxPrice ? property.price <= maxPrice : true;
      return matchesTransaction && matchesPropertyType && matchesMaxPrice;
    })
  : [];

const transactionTypes = ["Buy", "Rent", "Exchange",];
const propertyTypes = ["Apartment", "Villa", "Land", "Garage"];

  const [notifications, setNotifications] = useState([]);
  const [newNotification, setNewNotification] = useState(null); // for popup
  const alertedNotificationIds = useRef(new Set());
 



  const fetchNotifications = async () => {
  const clientId = localStorage.getItem("clientId");
  const token = localStorage.getItem("clientToken");
  const dismissedId = localStorage.getItem("dismissedNotificationId");

  if (!clientId || !token) {
    console.warn("Client ID or token not found in localStorage.");
    return;
  }

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_BACKEND_URL}/api/auth/client/notifications/${clientId}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    const unseen = response.data.notifications.filter(n => !n.seen);
    const newUnseen = unseen.filter(n =>
      !alertedNotificationIds.current.has(n._id) &&
      n._id !== dismissedId
    );

    if (newUnseen.length > 0) {
      const latest = newUnseen[0];
      setNewNotification(latest); // show it in a popup
      alertedNotificationIds.current.add(latest._id);

      // Optionally mark it seen in backend
      await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/client/notifications/${clientId}/mark-seen`,
        { ids: [latest._id] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
    }

    setNotifications(unseen);
  } catch (err) {
    console.error("Failed to fetch notifications", err);
  }
};

const dismissNotification = (notificationId) => {
  if (notificationId) {
    localStorage.setItem('dismissedNotificationId', notificationId);
  }
  setNewNotification(null);
};

const handleViewProperty = () => {
  if (newNotification?.propertyId) {
    navigate(`/property/${newNotification.propertyId}`);
    dismissNotification(newNotification._id);
  }
};

const handleClosePopup = () => {
  dismissNotification(newNotification?._id);
};

const handleRedirectToNotifications = () => {
  navigate('/client/notifications');
  dismissNotification(newNotification?._id);
};




  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 0, backgroundColor: "#f5f5f5", width: "auto" }}>
      <div style={styles.container}>
        <div style={{ display: "flex", width: "100%", flexDirection: "column", alignItems: "center" }}>
          <div style={styles.accountButtonWrapper}>
            <AccountDropdown onLogout={handleLogout} openModal={openModal} />
          </div>
            <div style={styles.topRight}>
    <button
      style={styles.seekInvestorButton}
      onClick={(e) => {
        e.preventDefault();
        const type = "Seek Investor";
        setSelectedTransactionType(type);
        navigate("/client/business");
      }}
    >
      Seek Investor
    </button>
  </div>

          <div style={styles.sliderContainer}>
          <label style={styles.label}>
  {maxPrice === 0 ? "You can set your maximum price" : `Max Price: ${maxPrice} DZD`}
</label>

            <input
              type="range"
              min="15000"
              max="50000000"
              step="15000"
              value={maxPrice}
              // onChange={(e) => setMaxPrice(e.target.value)}
              onChange={(e) => setMaxPrice(Number(e.target.value))}

              style={styles.slider}
            />
          </div>
<div style={styles.wrapper}>
  <div style={styles.container1}>

    {/* Transaction Type Dropdown */}
    <div style={styles.dropdownWrapper}>
      <select
        value={tempTransactionType}
        onChange={(e) => setTempTransactionType(e.target.value)}
        style={styles.select}
      >
        <option value="">All Transactions</option> {/* Unselect option */}
        {transactionTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Property Type Dropdown */}
    <div style={styles.dropdownWrapper}>
      <select
        value={tempPropertyType}
        onChange={(e) => setTempPropertyType(e.target.value)}
        style={styles.select}
      >
        <option value="">All Properties</option> {/* Unselect option */}
        {propertyTypes.map((type) => (
          <option key={type} value={type}>{type}</option>
        ))}
      </select>
    </div>

    {/* Search Button */}
    <div style={styles.buttonWrapper}>
      <button
        style={styles.searchButton}
        onClick={(e) => {
          e.preventDefault();
          setSelectedTransactionType(tempTransactionType);
          setSelectedPropertyType(tempPropertyType);
          console.log("Filtering by:", {
            transaction: tempTransactionType,
            property: tempPropertyType,
            keyword: searchQuery,
          });
        }}
      >
        <FaSearch style={{ marginRight: "8px" }} />
        Search
      </button>
    </div>

  </div>
</div>

      


        </div>
      </div>

  
          {loading ? (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
    <ClipLoader color="#1E5470" size={60} />
  </div>
) : error ? (
  <div style={{ textAlign: "center", color: "black",marginBottom:"155px", marginTop: "155px", fontSize: "18px" }}>
    {error}
  </div>
) : (
  <div className="properties-container">
    {/* {filteredProperties.map((property) => (
            <div className="property-card" key={property._id} style={{ width: "372px", backgroundColor: "#fff", padding: "10px", borderRadius: "8px" }}>
              <Link to={`/property/${property._id}`} style={styles.link}>
                <div style={imageCarouselStyle}>
                  {property.images.map((img, i) => (
                    <img
                      key={img.fileId || i}
                      src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${img.fileId}`}
                      alt={`Property ${i + 1}`}
                      style={imageStyle}
                    />
                  ))}
                </div>
              </Link>
              <div style={{ marginTop: "10px", textAlign: "start", fontSize: "16px" }}>
                <p>{property.agencyName} agency</p>
                <p>Posted on: {new Date(property.updatedAt).toLocaleDateString()}</p>
              </div>
            </div>



          ))
          
          } */}
{filteredProperties.map((property) => (
  <div
    className="property-card"
    key={property._id}
    style={{
      width: "372px",
      backgroundColor: "#fff",
      padding: "10px",
      borderRadius: "8px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: "10px",
    }}
  >
    <div style={{ flex: 1 }}>
      <Link to={`/property/${property._id}`} style={styles.link}>
        <div style={imageCarouselStyle}>
          {property.images.map((img, i) => (
            <img
              key={img.fileId || i}
              src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${img.fileId}`}
              alt={`Property ${i + 1}`}
              style={imageStyle}
            />
          ))}
        </div>
      </Link>
      <div style={{ marginTop: "10px", textAlign: "start", fontSize: "16px" }}>
        <p>{property.agencyName} agency</p>
        <p>Posted on: {new Date(property.updatedAt).toLocaleDateString()}</p>
      </div>
    </div>

    {/* 🎯 Virtual Reality Button */}
    <div style={{ marginTop: "10px" }}>
      <button
        style={{
          backgroundColor: "#007bff",
          color: "#fff",
          padding: "8px 12px",
          borderRadius: "4px",
          border: "none",
          cursor: "pointer",
          fontSize: "14px",
        }}
        onClick={() => window.location.href = `/property/${property._id}/vr`}
      >
        Virtual Reality
      </button>
    </div>
  </div>
))}

      {filteredProperties.length === 0 && (
  <div
    style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100%',
      marginTop: '50px',
      marginBottom: '50px',
    }}
  >
    <p
      style={{
        color: 'black',
        fontSize: '18px',
        textAlign: 'center',
      }}
    >
      No properties available for the selected filters.
    </p>
  </div>
)}


        </div>
      )}

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
            textAlign: "center",
          },
        }}
      >
        <p>Are you sure you want to logout?</p>
        <div style={{ marginTop: "20px" }}>
          <button
            onClick={confirmLogout}
            style={{
              marginRight: "10px",
              padding: "10px 20px",
              backgroundColor: "#6EC1D1",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              height: "auto",
            }}
          >
            Yes, Logout
          </button>
          <button
            onClick={closeModal}
            style={{
              padding: "10px 20px",
              backgroundColor: "#ccc",
              border: "none",
              borderRadius: "5px",
              height: "auto",

            }}
          >
            Cancel
          </button>
        </div>
      </Modal>
{newNotification && (
  <>
    {/* Optional: Background overlay */}
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100vw',
      height: '100vh',
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      zIndex: 999,
    }} />

    {/* Notification Popup */}
    <div style={{
      position: 'fixed',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: '#f9f9f9',
      padding: '20px 24px',
      borderRadius: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      zIndex: 1000,
      width: '320px',
      textAlign: 'center',
      fontFamily: 'Arial, sans-serif',
      color: '#333',
      boxSizing: 'border-box',
    }}>
      {/* Close X Button */}
      <button
        onClick={handleClosePopup}
        style={{
          position: 'absolute',
          top: '8px',
          right: '8px',
          background: 'transparent',
          border: 'none',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer',
          color: '#999',
          lineHeight: 1,
        }}
        aria-label="Close notification"
      >
        ×
      </button>

      <p style={{ marginBottom: '16px', fontWeight: '500', fontSize: '16px' }}>
        🔔 New property match: {newNotification.message}
      </p>
      {/* Button Row */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        <button
          onClick={handleViewProperty}
          style={{
            padding: '8px 16px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#1E5470',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            width: '150px',
            height: 'auto',
          }}
        >
          View Property
        </button>

        <button
          onClick={handleRedirectToNotifications}
          style={{
            padding: '8px 16px',
            border: '1px solid #ccc',
            borderRadius: '4px',
            backgroundColor: '#1E5470',
            color: '#fff',
            cursor: 'pointer',
            fontWeight: '600',
            width: '150px',
            height: 'auto',
          }}
        >
          Go to Notifications
        </button>
      </div>
    </div>
  </>
)}


<ChatBot/>
      <Footer />
    </div>
  );
};

const imageCarouselStyle = {
  display: "flex",
  gap: "10px",
  overflowX: "auto",
  scrollSnapType: "x mandatory",
};




const imageStyle = {
  flex: "0 0 auto",
  width: "372px",
  height: "250px",
  objectFit: "cover",
  borderRadius: "10px",
  scrollSnapAlign: "start",
  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
};

const styles = {
  accountButtonWrapper: {
    position: "absolute",
    top: "20px",
    left: "20px", // ⬅️ changed from right to left
    zIndex: 100,
  },
  


  topBar: {
    display: "flex",
    justifyContent: "flex-end", // keep the search bar on the right
    alignItems: "center",
    width: "80%",
    marginTop: "10px",
    marginBottom: "20px",
    marginLeft: "60px",
    padding: "0 20px",
    gap: "20px",
  },
  
  
  accountButton: {
    height:"60px",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    backgroundColor: "#1E5470",
    color: "#fff",
    padding: "10px 20px",
    borderRadius: "30px",
    border: "none",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
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
  

  settingsContainer: {
    position: "absolute",
    top: "10px",
    left: "10px",
    display: "flex",
    gap: "10px",
    alignItems: "center",
    zIndex: 1000,
  },
   wrapper: {
    display: "flex",
    flexDirection: "column",
    position: "relative",
  },
  topRight: {
    alignSelf: "flex-end",
    marginBottom: "1rem",
  },
seekInvestorButton: {
  marginTop: "20px",
  marginRight: "20px", // ✅ Corrected from "marginWright"
  backgroundColor: "white",
  color: "black",
  padding: "0.5rem 1rem",
  border: "2px solid #6EC1D1", // ✅ Correct border color
  borderRadius: "1px",
  fontWeight: "600",
  fontSize: "1rem",
  cursor: "pointer",
  height:"45px"
},


  container1: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    gap: "1.5rem",
    flexWrap: "wrap",
  },
  dropdownWrapper: {
    display: "flex",
    flexDirection: "column",
  },
  label: {
    fontWeight: "500",
    marginBottom: "0.5rem",
    color: "#1C2529",
  },
  select: {
    padding: "0.5rem",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    width: "auto",
    backgroundColor: "#fff",
    cursor: "pointer",
  },
  buttonWrapper: {
  borderRadius: "6px",
    marginTop: "1.5rem",hight:"50px",
  },
  searchButton: {
    backgroundColor: "#6EC1D1",
    height :"auto",
    color: "#fff",
    padding: "0.6rem 1.2rem",
    border: "none",
    // borderRadius: "6px",
  borderRadius: "6px",

    fontWeight: "600",
    fontSize: "1rem",
    cursor: "pointer",
  },
  container: {
    // padding: "20px",
    textAlign: "center",
    backgroundColor: "#fff",
    width:"100%"
  },

  imageStyle: {
    width: "500px",
    height: "300px",
    objectFit: "cover",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
  },

  buttonGroup: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "15px",
  },

  button: {
    color: "#1C2529",
    fontWeight: "bold",
    backgroundColor: "white",
    cursor: "pointer",
    marginRight: "15px",
    border: "1px solid #1E5470",
    height: "50px",
    width: "100px",
    borderRadius: "5px",
  },

  text: {
    fontSize: "14px",
    textAlign: "center",
  },

    sliderContainer: {

    width: "70%",
    margin: "20px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  label: {
    marginBottom: "15px",
    fontSize: "18px",
    fontWeight: "400",
    color: "#1E5470",textAlign:"start"
  },

  slider: {
    width: "70%",
    WebkitAppearance: "none",
    height: "8px",
    borderRadius: "5px",
    background: "#e0e0e0",
    outline: "none",
    opacity: "0.9",
    cursor: "pointer",
  },

  // img1: { backgroundImage: `url(${apartment})` },
  // img2: { backgroundImage: `url(${villa})` },
  // img3: { backgroundImage: `url(${land})` },
  // img4: { backgroundImage: `url(${garage})` },
  // img5: { backgroundImage: `url(${buy})` },
};

const searchStyles = {
  inputContainer: {
    position: "relative",
    width: "250px",
    height:"40px"
  },
  input: {
    width: "100%",
    height: "40px",
    padding: "10px 40px 10px 15px",
    fontSize: "16px",
    borderRadius: "30px",
    border: "2px solid #1E5470",
    backgroundColor: "#fff",
    color: "#1C2529",
  },
  icon: {
    position: "absolute",
    right: "1px",
    top: "75%",
    transform: "translateY(-50%)",
    color: "#1E5470",
    pointerEvents: "none",
  },
};

export default DashboardClient;






