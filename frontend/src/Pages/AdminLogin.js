

import bgImg from "../assets/bgImg.jpg"; // Optional: use your image path
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AutoChatBot from "./AutoChatBot";

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const ADMIN_EMAIL = "aqarlink6@gmail.com";
  const ADMIN_PASSWORD = "AqarLink25";

  // 🔒 Redirect if already logged in
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("adminLoggedIn") === "true";
    if (isLoggedIn) {
      navigate("/admin/dashboard", { replace: true });
    }
  }, [navigate]); // Include navigate in dependencies

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      if (
        formData.email.trim().toLowerCase() === ADMIN_EMAIL &&
        formData.password === ADMIN_PASSWORD
      ) {
        localStorage.setItem("adminLoggedIn", "true");
        navigate("/admin/dashboard", { replace: true }); // ✅ prevents login page in back history
      } else {
        setError("Invalid email or password.");
      }
      setLoading(false);
    }, 1000);
  };



  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h2 style={styles.title}>Welcome Admin</h2>
        <h2 style={styles.t1}>Please use your credentials to login</h2>

        {error && <p style={styles.error}>{error}</p>}

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputContainer}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="admin email"
              autoComplete="off"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.inputContainer}>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="off"
              style={styles.input}
            />
          </div>

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
              backgroundColor: loading ? "#aaa" : "#a3743e",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.target.style.backgroundColor = "#f68300";
            }}
            onMouseLeave={(e) => {
              if (!loading) e.target.style.backgroundColor = "#a3743e";
            }}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundImage: `url(${bgImg})`,
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
    marginTop: "20px",
    marginBottom: "7px",
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
  rememberMeContainer: {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    fontSize: "14px",
  },
  rememberMeLabel: {
    color: "#a3743e",
    marginLeft: "5px",
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
    backgroundColor: "#a3743e",
  },
  error: {
    color: "red",
    marginBottom: "10px",
    fontSize: "14px",
  },
};

export default AdminLogin;
