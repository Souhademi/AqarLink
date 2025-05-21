import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";

const EmailVerification = () => {
  const { token } = useParams();
  const navigate = useNavigate();

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");

  // // 1) Try verifying as client → if fails, try admin
  // useEffect(() => {
  //   const verify = async () => {
  //     try {
  //       const { data } = await axios.get(
  //         `http://localhost:5000/api/auth/client/verify/${token}`
  //       );
  //       setMessage(data.message);
  //       setTimeout(() => navigate("/client/login"), 3000);
  //     } catch (clientErr) {
  //       try {
  //         const { data } = await axios.get(
  //           `http://localhost:5000/api/auth/estateAgency/verify/${token}`
  //         );
  //         setMessage(data.message);
  //         setTimeout(() => navigate("/estateAgency/login"), 3000);
  //       } catch (adminErr) {
  //         setError(
  //           clientErr.response?.data?.error || adminErr.response?.data?.error || 
  //           "Verification failed."
  //         );
  //       }
  //     }
  //   };

  //   if (token) verify();
  // }, [token, navigate]);


  

// // 1) Try verifying as client → if fails, try admin
// useEffect(() => {
//     const verify = async() => {
//         try {
//             const { data } = await axios.get(
//                 `http://localhost:5000/api/auth/client/verify/${token}`
//             );
//             setMessage(data.message);
//             setTimeout(() => navigate("/client/login"), 3000);
//         } catch (clientErr) {
//             try {
//                 const { data } = await axios.get(
//                     `http://localhost:5000/api/auth/estateAgency/verify/${token}`
//                 );
//                 setMessage(data.message);
//                 setTimeout(() => navigate("/estateAgency/login"), 3000);
//             } catch (adminErr) {
//                 try {
//                     const { data } = await axios.get(
//                         `http://localhost:5000/api/auth/investor/verify/${token}`
//                     );
//                     setMessage(data.message);
//                     setTimeout(() => navigate("/investor/login"), 3000);
//                 } catch (investorErr) {
//                     setError(
//                         clientErr.response ?.data ?.error adminErr.response ?.data ?.error || investorErr.response ?.data ?.error ||
//                         "Verification failed."
//                     );
//                 }
//             }
//         };
//     }
//     if (token) verify();
// }, [token, navigate]);

  // // 2) Resend verification depending on user type (guessed from email domain or user selection)
  // const handleResend = async () => {
  //   try {
  //     // You could determine the user type dynamically (e.g., from a dropdown), but here we try both:
  //     await axios.post("http://localhost:5000/api/auth/client/resend-verification", { email });
  //     setResendMessage("Client verification email resent successfully.");
  //   } catch (clientErr) {
  //     try {
  //       await axios.post("http://localhost:5000/api/auth/estateAgency/resend-verification", { email });
  //       setResendMessage("Admin verification email resent successfully.");
  //     } catch (adminErr) {
  //       const errMsg = clientErr.response?.data?.error || adminErr.response?.data?.error;
  //       if (errMsg === "User already verified.") {
  //         setResendMessage("Your account is already verified! Redirecting to login...");
  //         setTimeout(() => navigate("/"), 3000);
  //       } else {
  //         setResendMessage(errMsg || "Failed to resend email.");
  //       }
  //     }
  //   }
  // };


  

// 1) Try verifying as client → if fails, try admin
useEffect(() => {
    const verify = async() => {
        try {
            const { data } = await axios.get(
                `http://localhost:5000/api/auth/client/verify/${token}`
            );
            setMessage(data.message);
            setTimeout(() => navigate("/client/login"), 3000);
        } catch (clientErr) {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/api/auth/estateAgency/verify/${token}`
                );
                setMessage(data.message);
                setTimeout(() => navigate("/estateAgency/login"), 3000);
            } catch (adminErr) {
                try {
                    const { data } = await axios.get(
                        `http://localhost:5000/api/auth/investor/verify/${token}`
                    );
                    setMessage(data.message);
                    setTimeout(() => navigate("/investor/login"), 3000);
                } catch (investorErr) {
                    setError(
                        clientErr.response ?.data ?.error || adminErr.response ?.data ?.error || investorErr.response ?.data ?.error ||
                        "Verification failed."
                    );
                }
            }
        };
    }
    if (token) verify();
}, [token, navigate]);









// 2) Resend verification depending on user type (guessed from email domain or user selection)
const handleResend = async() => {
    try {
        // You could determine the user type dynamically (e.g., from a dropdown), but here we try both:
        await axios.post("http://localhost:5000/api/auth/client/resend-verification", { email });
        setResendMessage("Client verification email resent successfully.");
    } catch (clientErr) {
        try {
            await axios.post("http://localhost:5000/api/auth/estateAgency/resend-verification", { email });
            setResendMessage("Admin verification email resent successfully.");
        } catch (adminErr) {


            try {
                // You could determine the user type dynamically (e.g., from a dropdown), but here we try both:
                await axios.post("http://localhost:5000/api/auth/investor/resend-verification", { email });
                setResendMessage("Investor verification email resent successfully.");
            } catch (investorErr) {
                const errMsg = clientErr.response ?.data ?.error || investorErr.response ?.data ?.error|| adminErr.response ?.data ?.error;
                if (errMsg === "User already verified.") {
                    setResendMessage("Your account is already verified! Redirecting to login...");
                    setTimeout(() => navigate("/"), 3000);
                } else {
                    setResendMessage(errMsg || "Failed to resend email.");
                }
            }
        }
    }
};

  return (
    <div style={{ padding: "2rem", textAlign: "center" }}>
      <h2>Email Verification</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

      {error && (
        <>
          <p style={{ color: "red" }}>{error}</p>

          {/* Resend form */}
          <div style={{ marginTop: "1rem" }}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ padding: "0.5rem", width: "250px" }}
            />
            <button
              onClick={handleResend}
              style={{
                marginLeft: "0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: "#1E5470",
                color: "#fff",
                border: "none",
                cursor: "pointer",
              }}
            >
              Resend Verification Email
            </button>
            {resendMessage && (
              <p style={{ marginTop: "1rem", color: "blue" }}>{resendMessage}</p>
            )}
          </div>
        </>
      )}

      {message && (
        <p style={{ marginTop: "1rem" }}>
          <Link to="/">Go to Home</Link>
        </p>
      )}
    </div>
  );
};

export default EmailVerification;
