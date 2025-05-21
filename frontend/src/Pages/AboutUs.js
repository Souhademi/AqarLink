import { Link } from "react-router-dom";
import Footer from "./Footer";  
import AutoChatBot from "./AutoChatBot"; // Adjust path if needed
import React, { useEffect, useState } from 'react';
import aboutUs from "../assets/AboutUs.jpg";


// Reusable SearchInput component



const AboutUs = () => {

  return (

    
    <div style={{     
            backgroundImage: `url(${aboutUs})`,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",}}>
         <div style={container}>
            
            <h1 style={{color:"#1C2529",textAlign: "center",fontWeight:"lighter"}}>About AqarLink</h1>
          <p style={{paddingLeft:"20px"}}>    We are a team of young professionals driven by innovation, combining skills in technology,real estate, and business, with the mission of transforming the real estate market in Algeria exactly in Batna. <br />  Our web platform facilitates mediation between investors, clients, and real estate agencies by creating a simple, secure, and collaborative ecosystem.Investors gain access to profitable opportunities offered by verified agencies,agencies can publish their listings and secure funding through a premium subscription,  while clients can search for buy,rent,exchange properties or seeking investors and communicate with agencies. <br /> We value innovation, trust, and inclusivity to provide a transparent and modern experience for all stakeholders. Our vision is to become the digital reference for real estate intermediation in Algeria exactly in Batna, placing both technology and people at the heart of the process.</p> 
       
        </div>

      <AutoChatBot/>
    </div>
  );    
};




const container = {
 
    backgroundColor: "#fff",
    padding: "40px",
    borderRadius: "8px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    width: "500px",
    height: "400px",
    textAlign: "start",

};




export default AboutUs;
