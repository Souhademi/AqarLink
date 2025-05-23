import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Row2 from "../Row2"; // Import Row2 component
import AutoChatBot from "../AutoChatBot";
const CreateEstateAgencyAdminAccount2 = () => {
    const fixedFee = 1500; // Fixed agency fee

    const planDetails = {
    monthly: { amount: 4000, posts: 10 },
    trimesterly: { amount: 10000, posts: 40 },
    yearly: { amount: 40000, posts: 100 },
    };

    const [formData, setFormData] = useState({
        subscriptionPlan: "monthly",
        cardNumber: "",
        expiryDate: "",
        cvv: "",
    });

    const navigate = useNavigate();

    useEffect(() => {
        // ✅ Use functional update to prevent stale state issues
        const step1Data = JSON.parse(localStorage.getItem("step1Data"));
        if (step1Data) {
            setFormData((prevData) => ({...prevData, ...step1Data }));
        } else {
            navigate("/estateAgency/create-account");
        }
    }, [navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({...formData, [name]: value });
    };



const handleSubmit = async (e) => {
  e.preventDefault();
  const { amount: planAmount, posts } = planDetails[formData.subscriptionPlan];
  const totalAmount = planAmount + fixedFee;

  try {
    const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/payment/agency-invoice`, {
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      subscriptionPlan: formData.subscriptionPlan,
      postLimit: posts,
      amount: totalAmount, // ✅ include total amount in invoice request
      fixedFee: fixedFee,   // optional: send fixed fee info separately
    });

    const { redirectUrl } = response.data;
    window.location.href = redirectUrl;
  } catch (err) {
    alert("Erreur lors de la création de la facture.");
  }
};

    return ( 
        <>
        <Row2/> { /* Keep Row2 fixed */ }

        <h2 style = { styles.title } > Create Agency Admin Account </h2>

        <div style = { styles.container } >
                   <div style = { styles.formContainer }>
                       <form onSubmit = { handleSubmit }>
                                       <h2 style = { styles.title2 } > Payment Subscription 
                                       </h2>
                            <div style = { styles.row }>
                                <div style = { styles.inputHalf }>
                                    <label > Subscription Plan </label>
                                 <select
                                        name="subscriptionPlan"
                                        value={formData.subscriptionPlan}
                                        onChange={handleChange}
                                        style={styles.input2}
                                        >
                                        <option value="monthly">Monthly - 4000 DA / 10 posts</option>
                                        <option value="trimesterly">Trimesterly - 10000 DA / 40 posts</option>
                                        <option value="yearly">Yearly - 40000 DA / 100 posts</option>
                                        </select>

                                </div> 
                                <div></div> 
                           </div> 

                            <div style = { styles.row } >
                                <div style = { styles.inputHalf } >
                                    <label > <span style={{ color: "red" }}>*</span> Card Number </label>
                                    <input 
                                    // type = ""
                                            name = "cardNumber"
                                            value = {formData.cradNumber}
                                            onChange = {handleChange}
                                            required style = {styles.input}
                                    /> 
                                </div> 
                                <div></div> 
                            </div> 

                            <div style = { styles.row }>
                                <div style = { styles.inputHalf }>
                                    <label ><span style={{ color: "red" }}>*</span> First Name </label> 
                                    <input type = "text"
                                    name = "First Name"
                                    value = { formData.firstNameCard }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                    /> 
                                </div>
                               
                                <div style={styles.spacebetween}> </div>

                                <div style = { styles.inputHalf }>
                                    <label > <span style={{ color: "red" }}>*</span> Last Name </label> 
                                    <input type = "text"
                                    name = "Last Name"
                                    value = { formData.lastNameCard }
                                    onChange = { handleChange }
                                    required style = { styles.input }
                                    /> 
                                </div> 
                            </div> 
                         

                            <div style = {styles.row}>
                                <div style = {styles.inputHalf}>
                                    <label> <span style={{ color: "red" }}>*</span> Phone Number </label> 
                                            <input type = "tel"
                                            name = "phoneNumber"
                                            value = {formData.phoneNumber}
                                            onChange = {handleChange}
                                            required style = {styles.input}
                                    /> 
                                    <div></div> 
                                </div> 
                            </div> 

                            <div style = { styles.row }>
                                    <div style = { styles.inputHalf }>
                                        <label> <span style={{ color: "red" }}>*</span> Expiration Date </label> 
                                            <input type = "date"
                                            name = "expirationDate"
                                            value = { formData.expirationDate }
                                            onChange = { handleChange }
                                            required style = { styles.input }
                                            /> 
                                    </div> 
                               
                                <div style={styles.spacebetween}> </div>
                                 
                                <div style = { styles.inputHalf }>
                                <div style = {{width:"70px"}}>
                                        <label><span style={{ color: "red" }}>*</span>  CVV </label> 
                                                <input type = "number"
                                                name = "cvv"
                                                value = { formData.cvv }
                                                onChange = { handleChange }
                                                required style = { styles.input }
                                                /> 
                                    </div> 
                                    </div> 
                                    
                            </div> 
                           <p style={{ marginTop: "10px", fontWeight: "bold" }}>
                            Total Amount to Pay:{" "}
                            {planDetails[formData.subscriptionPlan].amount + fixedFee} DA
                            {" "}({planDetails[formData.subscriptionPlan].amount} DA + {fixedFee} DA fees)
                            </p>

                            <div style = { styles.buttonContainer }>
                                    <button type = "submit"
                                        style = { styles.button }

                                        onMouseEnter = {
                                            (e) => {
                                                e.target.style.backgroundColor = "#6EC1D1"; // Change color on hover
                                            }
                                        }
                                        onMouseLeave = {
                                            (e) => {
                                                e.target.style.backgroundColor = "#1C2529"; // Revert color when mouse leaves
                                            }
                                        } >
                                        Pay and Create Account 
                                    </button> 
                            </div> 
                           
                     </form> 
                 </div> 
       <AutoChatBot/>
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
    title2: {
        textAlign: "left",
        paddingBottom: "10px",

        fontSize: "20px",
        fontWeight: "500",
        color: "#333",
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
        input2: {
        padding: "10px",
        width: "106.5%",
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
        width: "auto",
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
export default CreateEstateAgencyAdminAccount2;