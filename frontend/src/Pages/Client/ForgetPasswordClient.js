// // pages/client/ForgotPassword.js
// import React, { useState } from 'react';
// import axios from 'axios';

// const ForgotPasswordClient = () => {
//   const [email, setEmail] = useState('');
//   const [message, setMessage] = useState('');

//   const handleForgot = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await axios.post('http://localhost:5000/api/auth/client/forgot-password', {
//         email,
//       });
//       setMessage(res.data.message);
//     } catch (err) {
//       setMessage(err.response?.data?.message || 'Failed to send reset link.');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1C2529] text-white flex items-center justify-center p-4">
//       <form onSubmit={handleForgot} className="bg-[#1E5470] p-8 rounded-xl w-full max-w-md">
//         <h2 className="text-xl mb-4">Forgot Password</h2>
//         {message && <p className="mb-4 text-sm text-green-300">{message}</p>}
//         <input
//           type="email"
//           placeholder="Your email"
//           required
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full p-2 mb-4 bg-[#1C2529] text-white rounded"
//         />
//         <button className="w-full py-2 bg-[#6EC1D1] text-[#1C2529] font-bold rounded">
//           Send Reset Link
//         </button>
//       </form>
//     </div>
//   );
// };



import React, { useState } from 'react';
import axios from 'axios';

const ForgotPasswordClient = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleForgot = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/client/forgot-password', {
        email,
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage(err.response?.data?.message || '❌ Failed to send reset link.');
    }
  };

  const styles = {
    


      container: {
            // display: "flex",
            // justifyContent: "center",
            // alignItems: "center",
            // height: "100vh",
            backgroundColor: "#f4f7fa",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
            // backgroundImage: `url(${phHome})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
        },
        form: {
            backgroundColor: "#fff",
            padding: "40px",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
            width: "400px",
            textAlign: "center",
        },
    title: {
      fontSize: '1.5rem',
      fontWeight: '600',
      marginBottom: '1.5rem',
      color: '#1E5470',
      textAlign: 'center',
    },
    message: {
      marginBottom: '1rem',
      fontSize: '0.875rem',
      color: '#6EC1D1',
      backgroundColor: '#1C2529',
      padding: '0.5rem',
      borderRadius: '0.5rem',
      textAlign: 'center',
    },
    input: {
      alignItems:'start',
      width: '93%',
      padding: '0.75rem',
      marginBottom: '1.5rem',
      // backgroundColor: '#1C2529',
      backgroundColor: "#f4f7fa",
      

      color: '#1E5470',

      borderRadius: '0.5rem',
      border: '1px solid #6EC1D1',
      outline: 'none',
      transition: 'border-color 0.3s',
    },
    inputFocus: {
      borderColor: '#6EC1D1',
    },
    button: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: "#f4f7fa",
height:"50px",
      color: '#1C2529',
      fontWeight: '700',
      borderRadius: '0.5rem',
      transition: 'background-color 0.2s',
    },
    buttonHover: {
      backgroundColor: '#1E5470',
    },
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleForgot} style={styles.form}>
        <h2 style={styles.title}>Forgot Password</h2>

        {message && <div style={styles.message}>{message}</div>}

        <div>
       
        <label style={{ display: 'block', marginBottom: '0.5rem', textAlign: "start", }}>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = ''}
          />
        </div>

        <button
          type="submit"
          style={styles.button}
          onMouseEnter={(e) => e.target.style.backgroundColor = styles.buttonHover.backgroundColor}
          onMouseLeave={(e) => e.target.style.backgroundColor = styles.button.backgroundColor}
        
        >
          Send Reset Link
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordClient;
