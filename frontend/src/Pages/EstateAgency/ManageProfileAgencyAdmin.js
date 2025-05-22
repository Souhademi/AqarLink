


import React, { useState, useEffect } from "react";
import axios from "axios";
import AgencyChatBot from "../AgencyChatBot";

const ManageProfileAgencyAdmin = () => {
  const [adminData, setAdminData] = useState({});
  const [editMode, setEditMode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [message, setMessage] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const agencyAdminId = user?._id || user?.id;

  useEffect(() => {
    if (!agencyAdminId) {
      setMessage("Admin ID not found.");
      return;
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgencyManage/${agencyAdminId}`)
      .then((res) => {
        setAdminData(res.data);
      })
      .catch((err) => {
        console.error("Failed to load profile:", err.response?.data || err.message);
        setMessage("Failed to load profile.");
      });
  }, [agencyAdminId]);

  const handleUpdate = async (field) => {
    if (!inputValue.trim()) {
      setMessage(`Please enter a valid ${field}.`);
      return;
    }

    try {
      const res = await axios.put(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/estateAgency/update/${agencyAdminId}`,
        { [field]: inputValue }
      );

      if (res.data.success) {
        setMessage(`${field} updated successfully!`);
        setAdminData((prev) => ({ ...prev, [field]: inputValue }));
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
      <h2 style={styles.title}>Manage Your Account</h2>
      {/* {message && <div>{message}</div>} */}
      {message && <div style={styles.message}>{message}</div>}

      <div><strong>Admin Full Name:</strong> {adminData.adminFirstName} {adminData.adminLastName}</div>
      <div><strong>Agency Address:</strong> {adminData.agencyAddress}</div>
      <div><strong>Email:</strong> {adminData.email}</div>
      <div><strong>Phone:</strong> {adminData.phone}</div>
   

      <hr />

      <div style={{ marginTop: "20px" }}>
        {editMode === "email" ? (
          renderEditField("email", "Email", "email")
        ) : (
          <button style={styles.button} onClick={() => setEditMode("email")}>Change Email</button>
        )}
      </div>

      <div>
  {editMode === "adminFirstName" ? (
    renderEditField("adminFirstName", "Admin FirstName")
  ) : (
    <button style={styles.button} onClick={() => setEditMode("adminFirstName")}>
      Change Admin First Name
    </button>

)}</div>
      <div>

  {editMode === "adminLastName" ? (
    renderEditField("adminLastName", "Admin LastName")
  ) : (
    <button style={styles.button} onClick={() => setEditMode("adminLastName")}>
  Change Admin Last Name
    </button>

)}</div>
      <div>
  {editMode === "agencyAddress" ? (
    renderEditField("agencyAddress", "Agency Address")
  ) : (
    <button style={styles.button} onClick={() => setEditMode("agencyAddress")}>
      Change Agency Address
    </button>
  )}
</div>
      <div>
        {editMode === "phone" ? (
          renderEditField("phone", "Phone")
        ) : (
          <button style={styles.button} onClick={() => setEditMode("phone")}>Change Phone Number</button>
        )}
      </div>

      {/* <div>
        {editMode === "password" ? (
          renderEditField("password", "Password", "password")
        ) : (
          <button style={styles.button} onClick={() => setEditMode("password")}>Change Password</button>
        )}
      </div> */}

      <AgencyChatBot />
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


export default ManageProfileAgencyAdmin;
