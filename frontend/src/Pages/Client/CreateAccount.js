import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import AutoChatBot from"../AutoChatBot";
const CreateClientAccount = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
 
    email: "",

    phone: "",
    password: "",
    repeatPassword: "",
  });



  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset messages
    setError(null);
    setSuccessMessage(null);

    const {
      firstName,
      lastName,
    //   username,
      email,
  
      phone,
      password,
      repeatPassword,
    } = formData;

    // Basic validation
    if (
      !firstName || !lastName  || !email  || !phone || !password || !repeatPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }



    // if (password !== repeatPassword) {
    //   setError("Passwords do not match.");
    //   return;
    // }

    if (password !== repeatPassword) {
  setError("Passwords do not match.");
  return;
}

const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/;
if (!strongPasswordRegex.test(password)) {
  setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
  return;
}


    if (!/^\+?[0-9]{10,15}$/.test(phone)) {
      setError("Invalid phone number.");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/client/create-account`,
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
        //   username: username.trim(),
          email: email.trim(),
          phone: phone.trim(),
          password, // don't trim password
        }
      );

      const { data } = response;

      if (data.success) {
        setSuccessMessage(data.message);
        setTimeout(() => {
          navigate("/client/login");
        }, 3000);
      } else {
        setError(data.message || "Account creation failed.");
      }

    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Account creation failed.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };
        return (
             <>
            <h2 style = { styles.title } > Create Client account </h2> 
            <div style = { styles.container } >
                <div style = { styles.formContainer } >
           

                    <form onSubmit = { handleSubmit } >
                        <div style = { styles.row } >
                            <div style = { styles.inputHalf } >
                                    <label> First Name <span style={{ color: "red" }}>*</span> </label> 
                                    <input 
                                        type = "text"
                                        name = "firstName"
                                        value = { formData.firstName }
                                        onChange = { handleChange }
                                        required style = { styles.input }/> 
                                </div> 
                                <div style = { styles.spacebetween }>
                                </div> 
                                <div style = { styles.inputHalf }>
                                <label > Last Name <span style={{ color: "red" }}>*</span></label> 
                                <input 
                                    type = "text"
                                    name = "lastName"
                                    value = { formData.lastName }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                /> 
                                    
                            </div> 
                        </div> 
           

                        { /* Email and Repeat Email in the same row */ } 
                        <div style = { styles.row }>
                            <div style = { styles.inputHalf } >
                                <label htmlFor = "email" > Email <span style={{ color: "red" }}>*</span></label> 
                                <input 
                                    type = "email"
                                    name = "email"
                                    value = { formData.email }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                /> 
                            </div> 
                           
                        </div>

                        <div style = { styles.row } >

                            <div style = { styles.inputHalf } >
                                <label > Phone Number <span style={{ color: "red" }}>*</span></label> 
                                <input 
                                    type = "tel"
                                    name = "phone"
                                    value = { formData.phone }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                /> 
                            </div> 
                    
                            <div></div> 
                        </div>

                    { /* Password and Repeat Password in the same row */ } 
                        <div style = { styles.row } >
                            <div style = { styles.inputHalf } >
                                <label htmlFor = "password" > Password <span style={{ color: "red" }}>*</span></label> 
                                <input 
                                    type = "password"
                                    name = "password"
                                    value = { formData.password }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                /> 
                            </div> 
                            <div style = { styles.spacebetween }> </div> 

                            <div style = { styles.inputHalf } >
                                <label htmlFor = "repeatPassword" > Repeat Password <span style={{ color: "red" }}>*</span></label> 
                                    <input 
                                    type = "password"
                                    name = "repeatPassword"
                                    value = { formData.repeatPassword }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                /> 
                            </div> 
                        </div>
                        {error && <p style={styles.error}>{error}</p>}
                        {successMessage && <p style={styles.success}>{successMessage}</p>}

                    <div style={styles.buttonContainer}>
                        <button
                            type="submit"
                            style={styles.button}
                            disabled={loading} // Disable button while loading
                            onMouseEnter={(e) => {
                                e.target.style.backgroundColor = "#6EC1D1"; // Change color on hover
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.backgroundColor = "#1C2529"; // Revert color when mouse leaves
                            }}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </button>
                    </div>

                    </form>

                    <div style = { styles.signInLink } >
                        <p>
                        Already have an account ?
                        <Link to = "/client/login"
                    style = {
                            {...styles.link, color: "#1E5470" } } >
                        Sign In 
                        </Link> 
                        </p> 
                    </div>
         
                </div> 
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
                paddingLeft: "15px"
            },

            container: {

                paddingLeft: "20px",
                paddingRight: "20px",
                paddingBottom: "20px",
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
                marginTop: "15px",
                fontSize: "13px",
            },
            inputContainer: {
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
            },
            row: {
                marginBottom: "15px",

                display: "flex",
            },

            spacebetween: {
                width: "40px"
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




        export default CreateClientAccount;