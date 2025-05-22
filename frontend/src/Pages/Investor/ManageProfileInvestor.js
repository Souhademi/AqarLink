import React, { useEffect, useState } from "react";
import axios from "axios";
import InvestorChatBot from "../ChatBot";

const ProfileManagementInvestor = () => {
  const [investorData, setInvestorData] = useState({});
  const [editMode, setEditMode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const investorId = user?._id || user?.id;


  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user) {
        setMessage("Investor not logged in.");
        return;
    }

    const investorId = user._id || user.id;  // Ensure that the investor ID is retrieved correctly
    if (!investorId) {
        setMessage("Investor ID not found.");
        return;
    }

    axios
        .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/investorManage/${investorId}`)
        .then((res) => {
            setInvestorData(res.data.investor);
        })
        .catch((err) => {
            console.error("Failed to load profile:", err.response?.data || err.message);
            setMessage("Failed to load profile.");
        });
}, []);

  const handleUpdate = async (field) => {
    if (!inputValue.trim()) {
      setMessage(`Please enter a valid ${field}.`);
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/investor/update/${investorId}`,
        { [field]: inputValue }
      );

      if (res.data.success) {
        setMessage(`${field} updated successfully!`);
        setInvestorData((prev) => ({ ...prev, [field]: inputValue }));
        setEditMode("");
        setInputValue("");
      } else {
        setMessage(`Failed to update ${field}.`);
      }
    } catch (err) {
      console.error(`Update failed:`, err.response?.data || err.message);
      setMessage(`Update failed. Try again.`);
    }
  };

  const renderEditField = (field, label, type = "text") => (
    <div>
      <input
        type={type}
        placeholder={`Enter new ${label}`}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        style={styles.input}
      />
      <button style={styles.confirmButton} onClick={() => handleUpdate(field)}>
        Confirm {label} Update
      </button>
      <button
        style={styles.cancelButton}
        onClick={() => {
          setEditMode("");
          setInputValue("");
        }}
      >
        Cancel
      </button>
    </div>
  );

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Manage Your Investor Profile</h2>
      {message && <div style={styles.message}>{message}</div>}

      <div><strong>Full Name:</strong> {investorData.name}</div>
      <div><strong>Username:</strong> {investorData.username}</div>
      <div><strong>Email:</strong> {investorData.email}</div>
      <div><strong>Phone:</strong> {investorData.phone}</div>
      <div><strong>Address:</strong> {investorData.address}</div>

      <hr />

      <div style={{ marginTop: "20px" }}>
        {editMode === "email" ? (
          renderEditField("email", "Email", "email")
        ) : (
          <button style={styles.button} onClick={() => setEditMode("email")}>Change Email</button>
        )}
      </div>
      <div>
        {editMode === "address" ? (
          renderEditField("address", "Address")
        ) : (
          <button style={styles.button} onClick={() => setEditMode("address")}>Change Address</button>
        )}
      </div>
      <div>
        {editMode === "phone" ? (
          renderEditField("phone", "Phone")
        ) : (
          <button style={styles.button} onClick={() => setEditMode("phone")}>Change Phone</button>
        )}
      </div>

      <InvestorChatBot />
    </div>
  );
};

const styles = {
  container: {
    padding: "30px",
    maxWidth: "700px",
    margin: "40px auto",
    backgroundColor: "#f9f9f9",
    borderRadius: "12px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
    color: "#1C2529"
  },
  title: {
    textAlign: "start",
    marginBottom: "30px",
    color: "#1E5470",
    fontSize: "28px",
    fontWeight: "bold"
  },
  label: {
    fontWeight: "600",
    marginRight: "5px",
    color: "#1C2529"
  },
  infoBlock: {
    marginBottom: "15px",
    fontSize: "16px"
  },
  button: {
    padding: "10px 16px",
    margin: "10px 0",
    backgroundColor: "#1E5470",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontSize: "15px",
    transition: "background-color 0.3s ease",height:"auto"
  },
  input: {
    padding: "10px",
    margin: "10px 10px 10px 0",
    width: "60%",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "14px"
  },
  confirmButton: {
    backgroundColor: "#6EC1D1",
    color: "#fff",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    marginRight: "10px",
    cursor: "pointer",height:"auto"
  },
  cancelButton: {
    backgroundColor: "#ccc",
    color: "#333",
    border: "none",
    padding: "10px 14px",
    borderRadius: "6px",
    cursor: "pointer",height:"auto"
  },
  message: {
    padding: "10px",
    backgroundColor: "#e0f7fa",
    border: "1px solid #6EC1D1",
    borderRadius: "6px",
    marginBottom: "20px",
    color: "#1C2529"
  }
};


export default ProfileManagementInvestor;
