import React from "react";
import { Link } from "react-router-dom";
import  bgImage from "../assets/background_img.jpg";
import  bgImage2 from "../assets/bgImg.jpg";
import  phHome from "../assets/phHome.jpg";
import  homeBack from "../assets/background_img.jpg";
import Row2 from "./Row2"; // Import Row2 component

const SignIn = () => {
  return (
    <>

    <div  className="column" style={styles.container} >
      <Row2 /> {/* Keep Row2 fixed */}
      <div style={styles.buttonContainer}>
        <Link to="/client/login">
          <button
            style={styles.buttonCl}
            // onMouseEnter={(e) => (e.target.style.backgroundColor = "#D8C4B6")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#6EC1D1")}

            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1C2529")}
          >
            SIGN IN AS CLIENT
          </button>
        </Link>

        <Link to="/estateAgency/login">
          <button
            style={styles.buttonAg}
            // onMouseEnter={(e) => (e.target.style.backgroundColor = "#D8C4B6")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#6EC1D1")}

            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1C2529")}
          >
            SIGN IN AS ESTATE AGENCY ADMIN
          </button>
        </Link>

        <Link to="/investor/login">
          <button
            style={styles.buttonIn}
            // onMouseEnter={(e) => (e.target.style.backgroundColor = "#D8C4B6")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#6EC1D1")}

            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1C2529")}
          >
            SIGN IN AS INVESTOR
          </button>
        </Link>

        
        {/* <Link to="/adminLogin">
          <button
            style={styles.buttonAg}
            // onMouseEnter={(e) => (e.target.style.backgroundColor = "#D8C4B6")}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#6EC1D1")}

            onMouseLeave={(e) => (e.target.style.backgroundColor = "#1C2529")}
          >
            SIGN IN AS ESTATE AGENCY ADMIN
          </button>
        </Link> */}
      </div>
    </div>

    </>

  );
};

const styles = {
  container: {
    padding:"0",display: "flex",width:"100%",flexDirection: "column",alignItems: "start",
    display: "flex",
    // backgroundColor: "#fff",
    
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${phHome})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
   
    // backgroundColor: "#f4f4f4",
  },
  buttonContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    alignItems: "center",
    backgroundColor: "#2222",
    padding: "40px",
    // paddingTop:"75px",
    backgroundPosition: "center",
    justifyContent: "center",
    borderRadius: "8px",
    boxShadow: "0 4px 4px #fff",
    // backgroundColor: "#fff",

    width:"350px",
    height:"250px",marginTop:"50px"
  },
  buttonCl: {
   
    borderRadius: "15px",

    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "none",
    width: "250px",
    backgroundColor:"#1C2529"

  },
  buttonAg: {
    borderRadius: "15px",

    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "none",
    width: "250px",
    backgroundColor:"#1C2529"

  },
  buttonIn: {
    borderRadius: "15px",

    color: "#fff",
    fontSize: "16px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
    border: "none",
    width: "250px",
    backgroundColor:"#1C2529"

  },
};

export default SignIn;
