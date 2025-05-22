import { Link } from "react-router-dom";
import Footer from "./Footer";  
import  homeBack from "../assets/background_img.jpg";
import Row2 from "./Row2"; // Import Row2 component
import SignInButton from "./SignInButton"; // Import Row2 component
import  phHome from "../assets/phHome.jpg";
import { FaSearch } from 'react-icons/fa';
import AutoChatBot from "./AutoChatBot"; // Adjust path if needed
import React, { useEffect, useState,useRef } from 'react';
import axios from 'axios';
import './Home.css'; // 👈 make sure the path matches the file location

import { ClipLoader } from 'react-spinners';




const HomePage = () => {
  const footerRef = useRef(null); // <-- create footer ref

  const handleScrollToFooter = () => {
    footerRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

const [searchQuery, setSearchQuery] = useState('');
const [properties, setProperties] = useState([]);


const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);




useEffect(() => {
  const fetchProperties = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/properties`);
      console.log("✅ Response from backend:", res.data); // Check structure

      // If res.data itself is the array of properties
      if (Array.isArray(res.data)) {
        setProperties(res.data);
      } 
      // If backend returns { properties: [...] }
      else if (Array.isArray(res.data.properties)) {
        setProperties(res.data.properties);
      } 
      else {
        throw new Error("Invalid data format from backend");
      }
    } catch (error) {
      console.error("❌ Error fetching properties:", error);
      setError("Cannot retrieve properties at this time. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  fetchProperties();
}, []);


  console.log("📦 Properties state:", properties);


  return (

    <div style={{ fontFamily: "Arial, sans-serif", margin: "0", backgroundColor: "#fff" }}>

       
 <div style={container}>
 <div className="column" style={{padding:"0",display: "flex",width:"100%",flexDirection: "column",alignItems: "center"}}>

          <Row2 onContactClick={handleScrollToFooter} /> {/* ✅ pass handler to Row2 */}

  
  <text style={{fontSize:"60px", fontWeight:"bold",color: "#1E5470",marginTop:"80px", textAlign:"center",alignItems:"center"}}>Homes. Lands. <br/>Properties. Offers. </text>

      </div>

      </div>


{loading ? (
  <div
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
    }}
  >
    <ClipLoader color="#1E5470" size={50} />
  </div>
) : error ? (
  <div
    style={{
      textAlign: 'center',
      color: 'black',
      marginTop: '50px',
      marginBottom: '50px',
      fontSize: '18px',
    }}
  >
    {error}
  </div>
) : (
  <div className="properties-container">
  {(Array.isArray(properties) ? properties : [])
    .filter((property) =>
      property.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.agencyName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.transactionType?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .map((property) => (
      <div className="property-card" key={property._id}>
        <div style={imageCarouselStyle}>
          {property.images?.map((img, i) => (
            <img
              key={img.fileId || i}
              src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${img.fileId}`}
              alt={`Property ${i + 1}`}
              style={imageStyle}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: "10px",
            textAlign: "start",
            fontSize: "16px",
            alignItems: "end",
          }}
        >
          <p>{property.agencyName} agency</p>
          <p>Posted on: {new Date(property.updatedAt).toLocaleDateString()}</p>

          <button
            style={{
              backgroundColor: "grey",
              height: "auto",
              color: "#fff",
              padding: "0.6rem 1.2rem",
              border: "none",
              fontWeight: "600",
              fontSize: "1rem",
              cursor: "pointer",
            }}
            onClick={() =>
              alert("You have to create an account to see more details.")
            }
          >
            More Details
          </button>
        </div>
      </div>
    ))}
</div>

  // <div className="properties-container">
  //   {properties
  //     .filter((property) =>
  //       property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       property.agencyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
  //       property.transactionType.toLowerCase().includes(searchQuery.toLowerCase())
  //     )
  //     .map((property) => (
  //       <div className="property-card" key={property._id}>
  //         <div style={imageCarouselStyle}>
  //           {property.images.map((img, i) => (
  //             <img
  //               key={img.fileId || i}
  //               src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/imageProperty/${img.fileId}`}
  //               alt={`Property ${i + 1}`}
  //               style={imageStyle}
  //             />
  //           ))}
  //         </div>
  //         <div
  //           style={{
  //             marginTop: "10px",
  //             textAlign: "start",
  //             fontSize: "16px",
  //             alignItems: "end",
  //           }}
  //         >
  //           <p>{property.agencyName} agency</p>
  //           <p>Posted on: {new Date(property.updatedAt).toLocaleDateString()}</p>

   
  //           <button
  //             style={{
         
  //                 backgroundColor: "grey",

  //               height :"auto",
  //                   color: "#fff",
  //                   padding: "0.6rem 1.2rem",
  //                   border: "none",
                 
  //                   fontWeight: "600",
  //                   fontSize: "1rem",
  //                   cursor: "pointer",
  //             }}

  //             onClick={() =>
  //               // alert("You have to create an account to see more properties.")
  //               alert("You have to create an account to see more details.")

  //             }
  //           >
  //             More Details
  //           </button>
  //         </div>
  //       </div>
  //     ))}
  // </div>
)}

  <div ref={footerRef}> {/* ✅ attach ref to Footer container */}
     <Footer/>
        </div>
     <AutoChatBot />
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

const container = {
  position: "relative",
  display: "flex",
  width:"auto",
  height: "100vh",
  backgroundImage: `url(${phHome})`,
  backgroundSize: "cover",
  backgroundPosition: "center",

  backgroundColor: "#1C2529",
};






export default HomePage;
