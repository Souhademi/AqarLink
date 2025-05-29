import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Row2 from "../Row2"; // Import Row2 component
import AutoChatBot from "../AutoChatBot";
import axios from "axios";
import Footer from "../Footer";  

const CreateEstateAgencyAdminAccount = () => {
  const [formData, setFormData] = useState({
    agencyName: "",
    firstName: "",
    lastName: "",
    agencyAddress: "", // 🔥 Add this line
    phone: "",
    email: "",
    password: "",
    repeatPassword: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const navigate = useNavigate();

  const handlePdfChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage(null);
  
    const {
      agencyName,
      agencyAddress, // 🔥 Include this field
      firstName,
      lastName,
      phone,
      email,
      password,
      repeatPassword,
      image,
    } = formData;
    
  
    if (
      !agencyName ||
      !firstName ||
      !lastName ||
      !agencyAddress||
      !phone ||
      !email ||
      !password ||
      !repeatPassword ||
      !image
    ) {
      setError("Please fill in all fields.");
      return;
    }
  
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
  
    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      setError("Invalid phone number.");
      return;
    }

    const passwordStrengthRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

if (!passwordStrengthRegex.test(password)) {
  setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
  return;
}

  
    setLoading(true);
  
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("agencyName", agencyName);
      formDataToSend.append("adminFirstName", firstName);
      formDataToSend.append("adminLastName", lastName);
      formDataToSend.append("agencyAddress", agencyAddress); // 🔥 Add this
      formDataToSend.append("email", email);
      formDataToSend.append("phone", phone);
      formDataToSend.append("password", password);
      formDataToSend.append("image", image);
    
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/create-account`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
    
      if (response.data.success) {
        setSuccessMessage(response.data.message);
        setTimeout(() => {
          navigate("/estateAgency/login");
        }, 3000);
      } else {
        setError(response.data.message || "Account creation failed.");
      }
    
    } catch (error) {
      console.error("🚨 Axios error:", error.response?.data || error.message);
      setError(error.response?.data?.message || error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }; 
  

return (
  <>
    <Row2 />

    <h2 style={styles.title}>Create Agency Account</h2>

    <div style={styles.container}>
      <div style={styles.formContainer}>
        <form onSubmit={handleSubmit}>
          <h2 style={styles.title2}>Contact Information</h2>

          <div style={styles.row}>
            <div style={styles.inputHalf}>
              <label>
                Agency Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="agencyName"
                value={formData.agencyName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.spacebetween}></div>
            <div style={styles.inputHalf}>
              <label>
                Agency Address <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="agencyAddress"
                value={formData.agencyAddress}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputHalf}>
              <label>
                Admin First Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.spacebetween}></div>
            <div style={styles.inputHalf}>
              <label>
                Admin Last Name <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>


          <div style={styles.row}>
            <div style={styles.inputHalf}>
              <label>
                Phone Number <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          
          </div>

          <div style={styles.row}>
            <div style={styles.inputHalf}>
              <label>
                Email <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.row}>
            <div style={styles.inputHalf}>
              <label>
                Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
            <div style={styles.spacebetween}></div>
            <div style={styles.inputHalf}>
              <label>
                Repeat Password <span style={{ color: "red" }}>*</span>
              </label>
              <input
                type="password"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleChange}
                required
                style={styles.input}
              />
            </div>
          </div>

          <div style={styles.inputHalf}>
            <label>
              Agency Legal Proof <span style={{ color: "red" }}>*</span>
            </label>
            <input type="file" name="image" accept=".pdf,.jpg,.jpeg,.png"  onChange={handlePdfChange} />
          </div>

          {error && <p style={styles.error}>{error}</p>}
          {successMessage && <p style={styles.success}>{successMessage}</p>}

          <div style={styles.buttonContainer}>
            <button
              type="submit"
              style={styles.button}
              disabled={loading}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#6EC1D1";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#1C2529";
              }}
            >
              {loading ? "Creating account..." : "Create Account"}
            </button>
          </div>
        </form>

        <div style={styles.signInLink}>
          <p>
            Already have an account?{" "}
            <Link to="/estateAgency/login" style={{ ...styles.link, color: "#1E5470" }}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
     <Footer/>

      <AutoChatBot />
    </div>
  </>
);
};

const styles = {
  title: {
    textAlign: "left",

    fontSize: "24px",
    fontWeight: "500",
    color: "#333",
   paddingLeft:"15px"
  },
  title2:{
    textAlign: "left",
    paddingBottom:"10px",

    fontSize: "20px",
    fontWeight: "500",
    color: "#333",
  },
  
  container: {  
  
  paddingLeft:"20px",
  paddingRight:"20px",
  paddingBottom:"20px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  
    backgroundColor: "#f5f5f5",
  },
  formContainer: {
    backgroundColor: "#fff",
    padding: "30px",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
    width: "97%",
    marginTop: "15px",fontSize: "13px",
  },
  inputContainer: {
    marginBottom: "15px",
    display: "flex",
    flexDirection: "column",
  },
  row: {
    marginBottom: "15px",

    display: "flex",
    // justifyContent: "space-between",
  },
  spacebetween:{
    width:"40px"
  },
  inputHalf: {
   
    width: "30%",
    display: "flex",
    flexDirection: "column",
  },
  input: {
    padding: "10px",
    width: "100%",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "14px",
    marginTop: "5px",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-start", // Align button to the left
    marginTop: "20px",
  },
  button: {
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
  signInLink: {
    display: "flex",
    justifyContent: "flex-start", // Align button to the left
    marginTop: "20px",
    marginLeft: "10px",
    fontSize: "14px",
    textAlign: "center",
  },
  link: {
    color: "#1E5470",
    textDecoration: "none",
    fontWeight: "600",
  },
  error: {
    color: "red",
    fontSize: "14px",
    marginTop: "10px",
  },
};

export default CreateEstateAgencyAdminAccount; 