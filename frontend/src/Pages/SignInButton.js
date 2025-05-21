// import { useState } from "react";
// import { useNavigate } from "react-router-dom";

// const SignInButton = () => {
//   const [showDropdown, setShowDropdown] = useState(false);
//   const navigate = useNavigate();

//   const handleSelection = (e) => {
//     const value = e.target.value;
//     if (value === "Client") navigate("/client/login");
//     else if (value === "AgencyAdmin") navigate("/estateAgency/login");
//     else if (value === "Investor") navigate("/investor/login");
//   };

//   return (
//     <button
//     onMouseEnter={(e) => {
//         e.target.style.backgroundColor = "#6EC1D1";
//         setShowDropdown(true);
//       }}
//       onMouseLeave={(e) => {
//         e.target.style.backgroundColor = "#1C2529";
//         setShowDropdown(false);
//       }}
//       style={buttonStyleSignIn}
      
//     >
//       SIGN IN As
//       {showDropdown && (
//         <select
//           style={{
//             marginLeft: "10px",
//             padding: "5px",
//             borderRadius: "4px",
//             border: "none",
//             background: "#f4f4f4",
//             cursor: "pointer",
//           }}
          
//           onChange={handleSelection}
//           onMouseEnter={() => setShowDropdown(true)}
//           onMouseLeave={() => setShowDropdown(false)}
//         >
//           {/* <option value="">Choose...</option> */}
//           <option value="Client">Client</option>
//           <option value="AgencyAdmin">Agency Admin</option>
//           <option value="Investor">Investor</option>
//         </select>
//       )}
//     </button>
//   );
// };

// const buttonStyleSignIn = {
//   padding: "5px 10px",
//   background: "#1C2529",
//   color: "#f4f4f4",
//   fontSize: "14px",
//   borderRadius: "6px",
//   cursor: "pointer",
//   height: "70px",
//   transition: "background-color 0.3s ease",
// };

// export default SignInButton;

import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignInButton = () => {
  const [showOptions, setShowOptions] = useState(false);
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div 
      style={containerStyle}
      onMouseEnter={() => setShowOptions(true)}
      onMouseLeave={() => setShowOptions(false)}
    >
      <button style={showOptions ? buttonStyleHover : buttonStyle}>SIGN IN <br />As</button>
      {showOptions && (
        <div style={optionsContainerStyle}>
          <button style={optionButtonStyle} onClick={() => handleNavigation("/client/login")}>Client</button>
          <button style={optionButtonStyle} onClick={() => handleNavigation("/estateAgency/login")}>Agency Admin</button>
          <button style={optionButtonStyle} onClick={() => handleNavigation("/investor/login")}>Investor</button>
          <button style={optionButtonStyle} onClick={() => handleNavigation("/adminLogin")}>Admin</button>
        </div>
      )}
    </div>
  );
};

// Styles
const containerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  position: "relative",
};

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
  // alignItems:"left",
  // padding: "10px 20px",
  // background: "#1C2529",
  // color: "#f4f4f4",
  // fontSize: "16px",
  // borderRadius: "6px",
  // cursor: "pointer",
  // transition: "background-color 0.3s ease",
  // border: "none",
  width: "100px",
  // textAlign: "center",
};

const buttonStyleHover = {
  ...buttonStyle,
  background: "#6EC1D1",
};

const optionsContainerStyle = {
  height:"100px",
  position: "absolute",
  top: "100%",
  left: "50%",
  transform: "translateX(-50%)",
  display: "flex",
  flexDirection: "column",
  // background: "#F4F4F4",
  borderRadius: "6px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
  zIndex: 10,
};

const optionButtonStyle = {
  padding: "10px",
  color:"#1C2529",
  background: "#F4F4F4",
  border: "none",
  borderBottom: "1px solid #ddd",
  cursor: "pointer",
  fontSize: "14px",
  textAlign: "center",
  width: "100px",
  transition: "background-color 0.3s ease",
};

optionButtonStyle[":hover"] = {
  // background: "#6EC1D1",
  color: "#1C2529",
};

export default SignInButton;