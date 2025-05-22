import React, { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import phHome from '../../assets/phHome.jpg';

import AutoChatBot from "../AutoChatBot";

const AgencyLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    showPassword: false,
    rememberMe: false,
  });
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user"));
    if (user) {
      navigate("/estateAgency/dashboard", { replace: true });
    }
  }, []);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleShowPassword = () => {
    setFormData((prev) => ({
      ...prev,
      showPassword: !prev.showPassword,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
  
    const { email, password } = formData;
  
    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }
  
    setLoading(true);
  
    try {
      const response = await axios.post(
        "${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/login",
        {
          email: email.trim(),
          password,
        }
      );
  
      const { token, user } = response.data;
  
      if (token && user?.id) {
      
    if (rememberMe) {
        localStorage.setItem("token", token);
     
        localStorage.setItem("agencyAdminId", user.id); // Ensure agencyAdminId is stored here
      } else {
      localStorage.setItem("token", token);
     
        localStorage.setItem("agencyAdminId", user.id); // Ensure agencyAdminId is stored here
      }


          // localStorage.setItem("token", token);
          // localStorage.setItem("agencyAdminId", user.id);
 
  
        localStorage.setItem("user", JSON.stringify(user));

        navigate("/estateAgency/dashboard", { replace: true });

      } else {
        setError("Login failed: Missing user data.");
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Login failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
  
    return ( 
        <div style = { styles.container } >
        <div style = { styles.formContainer } >
        <h2 style = { styles.title } > Welcome back, Estate Agency Admin </h2> 
        <h2 style = { styles.t1 } > Please enter your details to login </h2>
        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit = { handleSubmit }
        style = { styles.form } >
        <div style = { styles.inputContainer } >
        <label htmlFor = "email" > Email</label>

        <input type = "text"
        name = "email"
        value = { formData.email }
        onChange = { handleChange }
        placeholder = "Enter your email"


        required style = { styles.input }
        /> 
        </div>

        <div style = { styles.inputContainer } >
            <label htmlFor = "password" > Password </label> 
            <input type = "password"
            name = "password"
            placeholder="********"

            value = { formData.password }
            onChange = { handleChange }

            required style = { styles.input }/> 
 
        </div>

        { /* Forgot password link aligned to the right */ }
        <div style = { styles.forgotPasswordContainer } >
        <a href = "/estateAgency/forgetPassword"
        style = {
            {...styles.link, color: "#1E5470" } } >
        Forgot password ?
        </a> </div>
 {/* Remember Me Checkbox */}
 <div style={styles.rememberMeContainer}>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={handleChange}
                        />
                        <label htmlFor="rememberMe" style={styles.rememberMeLabel}>
                            Remember Me
                        </label>
                    </div>
                    <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.submitButton,
              backgroundColor: loading ? "#aaa" : "#1C2529",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = "#6EC1D1";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = "#1C2529";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
         </form>

        <div style = { styles.footer } >
        <p>
        Don't have an account?{" "} 
        <a href = "/estateAgency/create-account"
        style = {
            {...styles.link, color: "#1E5470" } } >
        Register </a> </p> </div> </div> 
        <AutoChatBot/>
        </div>
    );
};

const styles = {
    rememberMeContainer: {
        display: "flex",
        alignItems: "center",
        marginBottom: "10px",
        // fontWeight: "bold",
        fontSize: "14px",

    },
    rememberMeLabel: {
        // marginLeft: "5px",::
        color: "#1E5470",
    },
    container: {
      
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundImage: `url(${phHome})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
    },
    formContainer: {
        backgroundColor: "#fff",
        padding: "40px",
        borderRadius: "8px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        width: "400px",
        textAlign: "center",
    },
    title: {
        marginBottom: "10px",
        fontSize: "24px",
        fontWeight: "400",
        color: "#333",
    },
    t1: {
        marginBottom: "20px",
        fontSize: "14px",
        fontWeight: "400",
        color: "#333",
    },
    form: {
        display: "flex",
        flexDirection: "column",
    },
    inputContainer: {
        textAlign: "left",
        fontSize: "13px",
        // fontWeight: "bold",
        marginTop: "20px",
        marginBottom: "7px",
        position: "relative",
    },
    input: {
        padding: "12px",
        width: "100%",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
        marginTop: "5px",
        outline: "none",
        transition: "border 0.3s ease",
    },
    toggleButton: {
        position: "absolute",
        top: "65%",
        right: "10px",
        transform: "translateY(-50%)",
        background: "transparent",
        border: "none",
        color: "#1E5470",
        fontSize: "14px",
        cursor: "pointer",
    },
    forgotPasswordContainer: {
        display: "flex",
        justifyContent: "flex-end",
        marginBottom: "10px",
        fontSize: "12px",
        fontWeight: "bold",
    },
    submitButton: {

        marginLeft: "10px",
        border: "none",
        borderRadius: "8px",
        fontSize: "14px",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
        height: "40px",
        width: "100%",
        backgroundColor: "#1C2529",

    },
    footer: {
        fontSize: "13px",
        fontWeight: "200",
    },
    link: {
        color: "#1E5470",
        textDecoration: "none",
        fontWeight: "600",
    },
};

export default AgencyLogin;