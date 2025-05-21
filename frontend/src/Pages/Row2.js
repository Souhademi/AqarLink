import React from "react";
import { Link, useLocation,useNavigate } from "react-router-dom";
import SignInButton from "./SignInButton"; // Import Row2 component
import whiteLogo from "../assets/WhiteLogo.png";
import blackLogo from "../assets/BlackLogo.png";
//nKGRnYPwC2cDXY49
const Row2 = ({ onContactClick }) => {
  // const location = useLocation();
  const navigate = useNavigate();
  return (
    


 <div style={row2}>



   <button style={logoStyle}onClick={()=> navigate("/")}></button>

  
    <div className="button-container" style={{margin: "0",padding:"0",display: "flex",flexDirection: "column",alignItems: "end",height:"100px", width:"100%", backgroundColor:"#1C2529" }}>


    <div style={row1}>

      <Link to="/aboutUs">
          <button style={{margin:"0",height:"40px",backgroundColor:"#1C2529",color:"#f4f4f4"}}
        
          >
            About us
          </button>
        </Link> 

        <Link to="">
          <button style={{margin:"0",height:"40px",backgroundColor:"#1C2529",color:"#f4f4f4"}}  onClick={onContactClick}>
            Contact
          </button>
        </Link>
      

    </div>

    <div style={row}>

        <Link to="/estateAgency/create-account">
          <button
              style={buttonStyle}
              onMouseEnter={(e) => {
          
                e.target.style.backgroundColor = "#6EC1D1"; 

              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1C2529";
              }}
          >
            CREATE ESTATE AGENCY <br /> ACCOUNT
          </button>
        </Link>

        <Link to="/investor/create-account">
          <button
              style={buttonStyle}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#6EC1D1"; 
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1C2529";
              }}
          >
            CREATE INVESTOR <br /> ACCOUNT
          </button>
        </Link>

     

          <SignInButton />
  </div>  
  </div>  
  </div>  


  );
};


const logoStyle = {
  backgroundColor:"white",
  position: "relative",
  display: "flex",
  backgroundImage:`url(${whiteLogo})`,
  textDecoration: "none",
   backgroundSize: "cover",
   backgroundPosition: "center",
   width:"200px",
   height:"auto"

};


const row={
backgroundColor:"#1C2529",
width:"100%",
display: "flex",
// height:"50px"
}

const row2={
color:"#f4f4f4",
backgroundColor:"#1C2529",
  display: "flex",
  width:"100%",
  height:"120px"

}
const row1={
  
  // marginBottom: "15px",
  alignItems:"end",
  backgroundColor:"#1C2529",
  display: "flex",
  width:"auto",
  color:"#f4f4f4"
}
const buttonStyle = {
  padding: "5px 10px",
  background: "#1C2529",
  // color: "#fff",
  fontSize: "14px",color:"#f4f4f4",
  // fontWeight:"bold",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  height: "70px",
  transition: "background-color 0.3s ease",
};

export default Row2;