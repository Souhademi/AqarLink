// import React, { useState } from 'react';
// import { useParams } from 'react-router-dom'; // ✅ Import useParams

// const ForgotPasswordInvestor = () => {
//   const { token } = useParams(); // ✅ Get token from URL
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [message, setMessage] = useState('');

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (password !== confirmPassword) {
//       return setMessage('Passwords do not match');
//     }

//     const payload = {
//       password,
//       token, // ✅ Use token from URL params
//     };

//     try {
//       const response = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/auth//client/reset-password', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const data = await response.json();
//       if (response.ok) {
//         setMessage('Password reset successfully');
//       } else {
//         setMessage(data.message || 'Error resetting password');
//       }
//     } catch (error) {
//       setMessage('Server error');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-[#1C2529] text-white flex items-center justify-center p-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-[#1E5470] rounded-2xl shadow-xl p-8 w-full max-w-md"
//       >
//         <h2 className="text-2xl font-bold mb-6 text-[#6EC1D1]">Reset Your Password</h2>

//         {message && (
//           <div className="mb-4 text-sm text-[#6EC1D1] bg-[#1C2529] p-2 rounded">
//             {message}
//           </div>
//         )}

//         <label className="block mb-2">New Password</label>
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full p-2 mb-4 rounded bg-[#1C2529] text-white"
//           required
//         />

//         <label className="block mb-2">Confirm Password</label>
//         <input
//           type="password"
//           value={confirmPassword}
//           onChange={(e) => setConfirmPassword(e.target.value)}
//           className="w-full p-2 mb-6 rounded bg-[#1C2529] text-white"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full py-2 bg-[#6EC1D1] text-[#1C2529] font-bold rounded hover:bg-[#5AB5C4]"
//         >
//           Reset Password
//         </button>
//       </form>
//     </div>
//   );
// };

// export default ResetPasswordClient;






import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

const RessetPasswordAgency = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return setMessage('Passwords do not match');
    }

    try {
      const res = await fetch('${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, token }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage('✅ Password reset successfully');
      } else {
        setMessage(data.message || '❌ Error resetting password');
      }
    } catch (error) {
      setMessage('❌ Server error');
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
    input: {alignItems:'start',
      width: '93%',
      padding: '0.75rem',
      marginBottom: '1.5rem',
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
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Reset Password</h2>

        {message && <div style={styles.message}>{message}</div>}

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem' , textAlign: "start", }}>New Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={styles.input}
            onFocus={(e) => e.target.style.borderColor = styles.inputFocus.borderColor}
            onBlur={(e) => e.target.style.borderColor = ''}
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem',  textAlign: "start",}}>Confirm Password</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
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
          Update Password
        </button>
      </form>
    </div>
  );
};

export default RessetPasswordAgency;
