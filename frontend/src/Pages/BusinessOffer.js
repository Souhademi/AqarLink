import { Link } from "react-router-dom";
import Footer from "./Footer";  
import  homeBack from "../assets/background_img.jpg";
import Row2 from "./Row2"; // Import Row2 component
import SignInButton from "./SignInButton"; // Import Row2 component
import  phHome from "../assets/phHome.jpg";
import { FaSearch } from 'react-icons/fa';
import ChatBot from "./ChatBot"; // Adjust path if needed
import React, { useEffect, useState } from 'react';
import axios from 'axios';


// Reusable SearchInput component



const BusinessOffer = () => {


  return (
  
    // <div style={{ fontFamily: "Arial, sans-serif", margin: "0", backgroundColor: "#1C2529" }}>
    <div style={{ fontFamily: "Arial, sans-serif", margin: "0", backgroundColor: "#fff" }}>

            <div style={styles.row}>
            <div>
            <textarea
            name="name"
            placeholder="Business Description"
            value={formData.name}
            onChange={handleChange}
            style={styles.textarea}
            required
          />
            </div>
            <div style={styles.spaceBetween}></div>
                <div>
                <p>
                <strong>Industry:</strong> {business.industry}
              </p>
              <p>
                <strong>Revenue:</strong> {business.revenue} DA
              </p>
              <p>
                <strong>Years:</strong> {business.years}
              </p>
              <p>
                <strong>Contact:</strong>{" "}
                <span style={styles.contactType}>{business.contactType}</span> -{" "}
                <a
                  href={business.contact}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {business.contact}
                </a>
              </p>

                </div>
            </div>
 
   
 


     {/* Footer (Under Container) */}
     <Footer/>
     <ChatBot />
    </div>
  );
};



const styles = {
 spaceBetween: {
    width: "40px",
  },
  textarea: {
    width: "48%",
    padding: "10px",
    marginBottom: "10px",
    border: "1px solid #ccc",
    borderRadius: "5px",
    fontSize: "16px",
    height: "300px",
    resize: "none",
  },
};

export default BusinessOffer;
