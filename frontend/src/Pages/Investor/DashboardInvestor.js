
// export default DashboardAdmin;
import React, { useState,useEffect } from "react";
import InvestorChatBot from "../InvestorChatBot";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Footer from "../Footer.js"
import '../Home.css'; 
import axios from 'axios';

import { ClipLoader } from "react-spinners";
import Modal from "react-modal"; // if using React Modal


const AccountDropdown = ({ onLogout, openModal }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: "relative" }}>
      <button style={styles.accountButton} onClick={() => setIsOpen(!isOpen)}>
        <FaUserCircle size={20} />
      </button>
      {isOpen && (
        <div style={styles.dropdownMenu}>
          <Link style={styles.dropdownItem}>Payment</Link>
          <Link to="/investor/profileManagementInvestor" style={styles.dropdownItem}>Account management</Link>
          <Link onClick={openModal} style={styles.dropdownItem}>Logout</Link>
        </div>
      )}
    </div>
  );
};

const DashboardInvestor = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSection, setSelectedSection] = useState("agencies");
  const [properties, setProperties] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loadingProperties, setLoadingProperties] = useState(false);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);
  const navigate = useNavigate();
const [propertyError, setPropertyError] = useState(false);
const [businessError, setBusinessError] = useState(false);



  const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
  const investorId = user?._id || user?.id;




  useEffect(() => {
    if (!investorId) {
   
      navigate("/investor/login");
    }
  }, [investorId, navigate]);

  // Logout modal actions
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
        "${process.env.REACT_APP_BACKEND_URL}/api/auth/investor/logout",
        { investorId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    } catch (error) {
      console.error("Investor logout error:", error);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("investorId");
    localStorage.removeItem("user");
    navigate("/investor/login", { replace: true });
  };

  const handleShowAgencies = () => setSelectedSection("agencies");
  const handleShowInvestors = () => {setSelectedSection("clients");};
 

  const getButtonStyle = (section) => ({
    ...styles.button,
    backgroundColor: selectedSection === section ? "#6EC1D1" : "#1C2529",
  });

  // useEffect(() => {
  //   if (selectedSection === "agencies") {
  //     setLoadingProperties(true);
  //     axios
  //       .get("${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/properties")
  //       .then((res) => setProperties(res.data.properties))
  //       .catch((error) => console.error("❌ Error fetching properties:", error))
  //       .finally(() => setLoadingProperties(false));
  //   }
  // }, [selectedSection]);

useEffect(() => {
  if (selectedSection === "agencies") {
    setLoadingProperties(true);
    setPropertyError(false); // reset error state
    axios
      .get("${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/properties")
      .then((res) => setProperties(res.data.properties))
      .catch((error) => {
        console.error("❌ Error fetching properties:", error);
        setPropertyError(true); // show error message
      })
      .finally(() => setLoadingProperties(false));
  }
}, [selectedSection]);


useEffect(() => {
  if (selectedSection === "clients") {
    setLoadingBusinesses(true);
    setBusinessError(false); // reset error state
    axios
      .get("${process.env.REACT_APP_BACKEND_URL}/api/auth/client/businesses")
      .then((response) => {
        if (response.data.success) {
          setBusinesses(response.data.businesses);
        } else {
          setBusinessError(true);
          console.error("Error fetching businesses:", response.data.message);
        }
      })
      .catch((err) => {
        console.error("Error fetching businesses:", err);
        setBusinessError(true);
      })
      .finally(() => setLoadingBusinesses(false));
  }
}, [selectedSection]);

  // useEffect(() => {
  //   if (selectedSection === "clients") {
  //     setLoadingBusinesses(true);
  //     axios
  //       .get("${process.env.REACT_APP_BACKEND_URL}/api/auth/client/businesses")
  //       .then((response) => {
  //         if (response.data.success) {
  //           setBusinesses(response.data.businesses);
  //         } else {
  //           console.error("Error fetching businesses:", response.data.message);
  //         }
  //       })
  //       .catch((err) => console.error("Error fetching businesses:", err))
  //       .finally(() => setLoadingBusinesses(false));
  //   }
  // }, [selectedSection]);



    return (

        <div style={{ fontFamily: "Arial, sans-serif", margin: "0", backgroundColor: "#f5f5f5",width :"auto" }}>
   
            <div style={styles.container}>    


               
                <div style={styles.row}> 
                    <div style={styles.accountButtonWrapper}>
                    {/* <AccountDropdown onLogout={handleLogout} /> */}
                    <AccountDropdown onLogout={handleLogout} openModal={openModal} />

                </div>
                    <div style={styles.inputHalf}>



                            <button
                            onClick={handleShowInvestors}
                            style={getButtonStyle("clients")}
                        >
                            Clients Offers
                        </button>
                     
                    </div>
                    <div style={styles.spacebetween}></div>
                    <div style={styles.inputHalf}>
                     <button
                            onClick={handleShowAgencies}
                            style={getButtonStyle("agencies")}
                        >
                            Properties Added By Estate Agencies  
                        </button>
                    </div>
                </div>


                {selectedSection === "agencies" && (
  <>
    {loadingProperties ? (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
          height: "auto"
      }}>
        <ClipLoader color="#1E5470" size={60} />
      </div>
    ) : (


      <div className="properties-container">



      {propertyError ? (
  <p style={{ textAlign: "center", color: "black",marginBottom:"50px" ,marginTop:"50px"}}>
    Cannot retrieve properties at this time. Please try again later.
  </p>
) : (
  properties.map((property) => (
    <div className="property-card" key={property._id}>
      {/* Image carousel wrapped in Link */}
      <Link to={`/propertyInv/${property._id}`} style={styles.link}>
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
)}

    </div>
    )}
  </>
)}

{selectedSection === "clients" && (
  <>
    {loadingBusinesses ? (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: "auto"
      }}>
        <ClipLoader color="#1E5470" size={60} />
      </div>
    ) : (
      <div>
        {businesses.length > 0 ? (
          businesses.map((business, index) => (
            <div key={index} style={styles.displayBox}>

              <p><strong>Business Name:</strong> {business.businessName}</p>
              <p><strong>Industry:</strong> {business.industry}</p>
              <p><strong>Years in Operation:</strong> {business.years}</p>
              <p><strong>Employees:</strong> {business.employees}</p>
              <p><strong>Revenue:</strong> {business.revenue}</p>
              <p><strong>Property Type:</strong> {business.propertyType}</p>
              <p><strong>Property Location:</strong> {business.propertyLocation}</p>
              <p><strong>Size:</strong> {business.size}</p>
              <p><strong>Budget Range:</strong> {business.budgetMin} - {business.budgetMax}</p>
              <p><strong>Purpose:</strong> {business.purpose}</p>
              <p><strong>Investment Amount:</strong> {business.investmentAmount}</p>
              <p><strong>Return Model:</strong> {business.returnModel}</p>
              <p><strong>Return Details:</strong> {business.returnDetails}</p>
              <p><strong>Investment Duration:</strong> {business.investmentDuration}</p>
              <p><strong>Full Name:</strong> {business.fullName}</p>
              <p><strong>Email:</strong> {business.email}</p>
              <p><strong>Phone:</strong> {business.phone}</p>
                {business.businessPlan && (
                  <p>
                    <strong>Business Plan:</strong>{" "}
                    <a href={`${process.env.REACT_APP_BACKEND_URL}/${business.businessPlan}`} target="_blank" rel="noopener noreferrer">
                      View Document
                    </a>
                  </p>
                )}

            </div>
          ))
        ) : (
          // <p>No businesses found.</p>
          businessError ? (
  <p style={{ textAlign: "center", color: "black",marginBottom:"50px" ,marginTop:"50px" }}>
    Cannot retrieve offers at this time. Please try again later.
  </p>
) : (
  <p>No businesses found.</p>
)

        )}
      </div>
    )}
  </>
)}

            </div>   
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

         <InvestorChatBot/>

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
    accountButton: {
        height:"60px",
        display: "flex",
        alignItems: "center",
        backgroundColor: "#6EC1D1",
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
        left: "20px", // ⬅️ changed from right to left
        zIndex: 100,
      },
      imageStyle: {
        width: "500px",
        height: "300px",
        objectFit: "cover",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
    row: {
        marginBottom: "15px",
        display: "flex",
        justifyContent: "left",
        alignItems: "left",
    },
    spacebetween: {
        width: "30px",
    },

    container: {
        paddingTop: "20px",
        // paddingLeft: "10px",
        // paddingRight:"10px",
        textAlign: "center",
        backgroundColor: "#fff",
        width:"auto", 
        // height:"auto"
      },
    inputHalf: {
        flex: 1,
    },
    button: {
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "1px solid #ccc",
        color: "white",
        width:"200px",
        height:"70px"
    },
    displayBox: {
        height:"auto",
        marginTop: "20px",
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#e9ecef",
        borderRadius: "5px",
        textAlign: "left",
    },
};
export default DashboardInvestor;




