// export default DashboardAdmin;
import React, { useState, useEffect } from "react";
// import AdminChat from "./AdminChat";
import ChatBot from "./ChatBot";
import { FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import AdminConversations from "./AdminConversations";
import ClipLoader from "react-spinners/ClipLoader"; // <-- make sure you import this

const DashboardAdmin = () => {

const [messages, setMessages] = useState([]);
const [replyText, setReplyText] = useState({});
  const [loading, setLoading] = useState(true);


  const [agencies, setAgencies] = useState([]);
  const [investors, setInvestors] = useState([]);
  const [selectedSection, setSelectedSection] = useState("agencies");

  const navigate = useNavigate();

// 
const fetchMessages = async () => {
    try {
        const res = await axios.get("${process.env.REACT_APP_BACKEND_URL}api/messages/unanswered");
        setMessages(res.data);  // your backend just returns the array
    } catch (err) {
        console.error("Failed to fetch messages", err);
    }
};


const [clients, setClients] = useState([]);



  const handleLogout = async () => {
    try {
      await axios.post("${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/logout");
      localStorage.removeItem("adminLoggedIn");
      navigate("/adminLogin",{ replace: true });
      
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  
  const handleDownload = async (fileId, filenamePrefix) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/auth/file/download/${fileId}`, {
        responseType: 'blob',
      });
  
      const contentDisposition = response.headers['content-disposition'];
      let filename = `${filenamePrefix}_${fileId}`;
  
      if (contentDisposition) {
        const match = contentDisposition.match(/filename="(.+)"/);
        if (match && match[1]) {
          filename = match[1];
        }
      }
  
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Download failed', error);
    }
  };
  
  const AccountDropdown = ({ onLogout }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
      <div style={{ position: "relative" }}>
        <button style={styles.accountButton} onClick={() => setIsOpen(!isOpen)}>
          <FaUserCircle size={20} />
        </button>
        {isOpen && (
          <div style={styles.dropdownMenu}>
            {/* <Link style={styles.dropdownItem}>Payment</Link> */}
            <Link style={styles.dropdownItem}>Account management</Link>
            <Link onClick={onLogout} style={styles.dropdownItem}>Logout</Link>
          </div>
        )}
      </div>
    );
  };

  const handleShowAgencies = () => setSelectedSection("agencies");
  const handleShowInvestors = () => setSelectedSection("investors");
const handleShowClients = () => setSelectedSection("clients");


  const getButtonStyle = (section) => ({
    ...styles.button,
    backgroundColor: selectedSection === section ? "#f68300" : "#a3743e",
  });

 useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchAgencies();
      await fetchInvestors();
      await fetchMessages(); 
      await fetchClients();
    } catch (error) {
      console.error("Error fetching initial data:", error);
    } finally {
      setLoading(false); // <-- SET LOADING TO FALSE AFTER ALL FETCHING
    }
  };
  fetchData();
}, []);




const handleShowMessages = () => setSelectedSection("messages");

const handleReply = async (messageId) => {
  try {
    await axios.post("${process.env.REACT_APP_BACKEND_URL}api/messages/reply", {
      messageId,
      reply: replyText[messageId],
    });
    alert("Reply sent");
    setReplyText({ ...replyText, [messageId]: "" });
  } catch (err) {
    console.error("Reply failed", err);
    alert("Reply failed");
  }
};


const unansweredMessages = messages.filter(
  (msg) => !msg.reply && msg.senderRole.toLowerCase() !== "chatbot"
);



  const fetchAgencies = async () => {
    try {
      const res = await axios.get("${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/all-agencies");
      console.log("Fetched agencies:", res.data); // Check full structure
  
      if (res.data.success) {
        console.log("Agencies with verifiedProof:", res.data.agencies.map(a => ({
          name: a.agencyName,
          verifiedProof: a.verifiedProof
        })));
        setAgencies(res.data.agencies);
      }
    } catch (error) {
      console.error("Error fetching agencies", error);
    }
  };
  

  const fetchInvestors = async () => {
    try {
      const res = await axios.get("${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/all-investors");
      console.log("Fetched investors:", res.data); // Check full structure
  
      if (res.data.success) {
        console.log("Investors with verifiedProof:", res.data.investors.map(i => ({
          name: i.firstName,
          verifiedProof: i.verifiedProof
        })));
        setInvestors(res.data.investors);
      }
    } catch (error) {
      console.error("Error fetching investors", error);
    }
  };
  
const fetchClients = async () => {
  try {
    const res = await axios.get("${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/all-clients");
    if (res.data.success) {
      setClients(res.data.clients);
    }
  } catch (error) {
    console.error("Error fetching clients", error);
  }
};


  const handleRejectAgency = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/agency/reject/${id}`);
      alert("Agency rejected. Email sent.");
      fetchAgencies();
    } catch (err) {
      console.error("Rejection failed", err);
      alert("Rejection failed");
    }
  };


  const handleRejectInvestor = async (id) => {
    try {
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/api/auth/investor/reject/${id}`);
      alert("Investor rejected. Email sent.");
      fetchInvestors();
    } catch (err) {
      console.error("Rejection failed", err);
      alert("Rejection failed");
    }
  };

  const handleVerifyProof = async (userType, id) => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/verify-proof/${userType}/${id}`);
      alert("Proof verified. Email sent.");
      if (userType === 'agency') {
        fetchAgencies();
      } else if (userType === 'investor') {
        fetchInvestors();
      }
    } catch (err) {
      console.error("Proof verification failed", err);
      alert("Proof verification failed");
    }
  };
const handleDeleteAgency = async (id) => {
  if (window.confirm("Are you sure you want to delete this agency?")) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/delete-agency/${id}`);
      alert("Agency deleted");
      fetchAgencies();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete agency");
    }
  }
};

const handleDeleteInvestor = async (id) => {
  if (window.confirm("Are you sure you want to delete this investor?")) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/delete-investor/${id}`);
      alert("Investor deleted");
      fetchInvestors();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete investor");
    }
  }
};

const handleDeleteClient = async (id) => {
  if (window.confirm("Are you sure you want to delete this client?")) {
    try {
      await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/auth/admin/delete-client/${id}`);
      alert("Client deleted");
      fetchClients();
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete client");
    }
  }
};

  return (
    <div style={{ fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5" }}>
      <div style={styles.container}>
        <div style={styles.row}>
          <div style={styles.accountButtonWrapper}>
            <AccountDropdown onLogout={handleLogout} />
          </div>
          <div style={styles.inputHalf}>
            <button onClick={handleShowAgencies} style={getButtonStyle("agencies")}>
              Agencies Accounts
            </button>
          </div>
          <div style={styles.spacebetween}></div>
          <div style={styles.inputHalf}>
            <button onClick={handleShowInvestors} style={getButtonStyle("investors")}>
              Investors Accounts
            </button>
          </div>
          <div style={styles.spacebetween}></div>

                   <div style={styles.inputHalf}>

         <div style={styles.inputHalf}>
  <button onClick={handleShowClients} style={getButtonStyle("clients")}>
    Client Accounts
  </button>
</div>

          </div>
          <div style={styles.spacebetween}></div>

          <div style={styles.inputHalf}>

            <button onClick={handleShowMessages} style={getButtonStyle("messages")}>
            Conversation
          </button>
          </div>

 
        </div>


{/* 

        {selectedSection === "agencies" && (
          
          <div>
            {agencies.length > 0 ? (
              agencies.map((agency, index) => (
                console.log('Agency verifiedProof:', agency.verifiedProof), // ✅ Added here
                <div key={index} style={{ ...styles.displayBox, display: "flex", justifyContent: "space-between" }}>
                  <div style={{ flex: 1 }}>
                    <p><strong>Agency Name:</strong> {agency.agencyName}</p>
                    <p><strong>Email:</strong> {agency.email}</p>
                    <p><strong>Phone:</strong> {agency.phone}</p>
                    <p><strong>Verified:</strong> {agency.isVerified ? "Yes" : "No"}</p>
                    <p><strong>Verified Proof:</strong> {agency.verifiedProof ? "Yes" : "No"}</p>

                    <p><strong>Paid Subscription:</strong> {agency.isPaid ? "Yes" : "No"}</p>
                    <p><strong>Subscription End Date:</strong> {agency.subscriptionEndDate ? new Date(agency.subscriptionEndDate).toLocaleDateString() : "N/A"}</p>
                    <button style={styles.rejectButton} onClick={() => handleDeleteAgency(agency._id)}>Delete</button>
                  
                  </div>
                  <div style={{ marginLeft: "20px"}}>
                    {agency.proofFileId && (
                      <>
                      
                          <img
                          src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/file/view/${agency.proofFileId}`}
                          alt="Proof File"
                          style={{ width: "300px", maxHeight: "200px", cursor: "pointer", marginBottom: "10px" }}
                          onClick={() => handleDownload(agency.proofFileId, "agency_proof")}
                        />


                        {agency.verifiedProof ? (
            
                        <p style={{ color: "#1C2529"}}>Proof Already Verified</p>
                      ) : (
                        <>
                          <button style={styles.verifyButton} onClick={() => handleVerifyProof('agency', agency._id)}>Verify Proof</button>
                          <button style={styles.rejectButton} onClick={() => handleRejectAgency(agency._id)}>Reject</button>
                     

           

                        </>
                      )}

                      </>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p>No agencies found.</p>
            )}
          </div>
        )} */}
{selectedSection === "agencies" && (
  loading ? (
    <div style={{
        width: '100vw',       // full viewport width
    height: '100vh',      // full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    position: 'fixed',    // optional, to overlay everything
    left: 0,
    zIndex: 9999  
    }}>
      <ClipLoader size={50} color="#4b9cd3" />
    </div>
  ) : (
    <div>
      {agencies.length > 0 ? (
        agencies.map((agency, index) => (
          <div key={index} style={{ ...styles.displayBox, display: "flex", justifyContent: "space-between" }}>
            <div style={{ flex: 1 }}>
              <p><strong>Agency Name:</strong> {agency.agencyName}</p>
              <p><strong>Email:</strong> {agency.email}</p>
              <p><strong>Phone:</strong> {agency.phone}</p>
              <p><strong>Verified:</strong> {agency.isVerified ? "Yes" : "No"}</p>
              <p><strong>Verified Proof:</strong> {agency.verifiedProof ? "Yes" : "No"}</p>
              <p><strong>Paid Subscription:</strong> {agency.isPaid ? "Yes" : "No"}</p>
              <p><strong>Subscription End Date:</strong> {agency.subscriptionEndDate ? new Date(agency.subscriptionEndDate).toLocaleDateString() : "N/A"}</p>
              <button style={styles.rejectButton} onClick={() => handleDeleteAgency(agency._id)}>Delete</button>
            </div>
            <div style={{ marginLeft: "20px" }}>
              {agency.proofFileId && (
                <>
                  <img
                    src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/file/view/${agency.proofFileId}`}
                    alt="Proof File"
                    style={{ width: "300px", maxHeight: "200px", cursor: "pointer", marginBottom: "10px" }}
                    onClick={() => handleDownload(agency.proofFileId, "agency_proof")}
                  />
                  {agency.verifiedProof ? (
                    <p style={{ color: "#1C2529" }}>Proof Already Verified</p>
                  ) : (
                    <>
                      <button style={styles.verifyButton} onClick={() => handleVerifyProof('agency', agency._id)}>Verify Proof</button>
                      <button style={styles.rejectButton} onClick={() => handleRejectAgency(agency._id)}>Reject</button>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        ))
      ) : (
        <p>No agencies found.</p>
      )}
    </div>
  )
)}

   {selectedSection === "investors" && (
  <div>
{loading ? (
  <div style={{
    width: '100vw',       // full viewport width
    height: '100vh',      // full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    position: 'fixed',    // optional, to overlay everything
    left: 0,
    zIndex: 9999          // optional, to be on top
  }}>
    <ClipLoader size={50} color="#4b9cd3" />
  </div>
    ) : (
      <>
        {investors.length > 0 ? (
          investors.map((investor, index) => (
            <div key={index} style={{ ...styles.displayBox, display: "flex", justifyContent: "space-between" }}>
              <div style={{ flex: 1 }}>
                <p><strong>Investor Name:</strong> {investor.firstName} {investor.lastName}</p>
                <p><strong>Email:</strong> {investor.email}</p>
                <p><strong>Phone:</strong> {investor.phone}</p>
                <p><strong>Verified:</strong> {investor.isVerified ? "Yes" : "No"}</p>
                <p><strong>Paid Subscription:</strong> {investor.isPaid ? "Yes" : "No"}</p>
                <p><strong>Verified Proof:</strong> {investor.verifiedProof}</p>
                <p><strong>Subscription End Date:</strong> {investor.subscriptionEndDate ? new Date(investor.subscriptionEndDate).toLocaleDateString() : "N/A"}</p>
                <button style={styles.rejectButton} onClick={() => handleDeleteInvestor(investor._id)}>Delete</button>
              </div>
              <div style={{ marginLeft: "20px" }}>
                {investor.proofFileId && (
                  <>
                    <img
                      src={`${process.env.REACT_APP_BACKEND_URL}/api/auth/file/view/${investor.proofFileId}`}
                      alt="Proof File"
                      style={{ width: "300px", maxHeight: "200px", cursor: "pointer", marginBottom: "10px" }}
                      onClick={() => handleDownload(investor.proofFileId, "investor_proof")}
                    />
                    {investor.verifiedProof ? (
                      <p style={{ color: "#1C2529" }}>Proof Already Verified</p>
                    ) : (
                      <>
                        <button style={styles.verifyButton} onClick={() => handleVerifyProof('investor', investor._id)}>Verify Proof</button>
                        <button style={styles.rejectButton} onClick={() => handleRejectInvestor(investor._id)}>Reject</button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No investors found.</p>
        )}
      </>
    )}
  </div>
)}
{selectedSection === "clients" && (
  <div>
{loading ? (
  <div style={{
    width: '100vw',       // full viewport width
    height: '100vh',      // full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    position: 'fixed',    // optional, to overlay everything
    left: 0,
    zIndex: 9999          // optional, to be on top
  }}>
    <ClipLoader size={50} color="#4b9cd3" />
  </div>
    ) : (
      <>
        {clients.length > 0 ? (
          clients.map((client, index) => (
            <div key={index} style={styles.displayBox}>
              <p><strong>Name:</strong> {client.firstName} {client.lastName}</p>
              <p><strong>Email:</strong> {client.email}</p>
              <p><strong>Phone:</strong> {client.phone}</p>
              <p><strong>Verified:</strong> {client.isVerified ? "Yes" : "No"}</p>
              <button style={styles.rejectButton} onClick={() => handleDeleteClient(client._id)}>
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No clients found.</p>
        )}
      </>
    )}
  </div>
)}

{selectedSection === "messages" && (
  <div>
{loading ? (
  <div style={{
    width: '100vw',       // full viewport width
    height: '100vh',      // full viewport height
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    position: 'fixed',    // optional, to overlay everything
    left: 0,
    zIndex: 9999          // optional, to be on top
  }}>
    <ClipLoader size={50} color="#4b9cd3" />
  </div>
) : (
      <>
        {unansweredMessages.length > 0 ? (
          unansweredMessages.map((msg, idx) => (
            <div key={idx} style={styles.displayBox}>
              <p><strong>From:</strong> {msg.senderRole} ({msg.senderId})</p>
              <p><strong>Question:</strong> {msg.question}</p>
              <textarea
                style={{ width: '100%', height: '80px' }}
                placeholder="Type your reply..."
                value={replyText[msg._id] || ''}
                onChange={(e) =>
                  setReplyText({ ...replyText, [msg._id]: e.target.value })
                }
              />
              <button
                onClick={() => handleReply(msg._id)}
                style={styles.verifyButton}
              >
                Send Reply
              </button>
            </div>
          ))
        ) : (
          <p>No unanswered messages.</p>
        )}
      </>
    )}
  </div>
)}




   
      </div>
   
    </div>
  );
};




const styles = {  

  verifyButton: {
  backgroundColor: '#28a745',
  color: 'white',
  padding: '8px 12px',
  border: 'none',
  borderRadius: '4px',
  marginTop: '10px',
  cursor: 'pointer',
},


    accountButton: {
        height:"60px",
        display: "flex",
        alignItems: "center",
        // gap: "8px",
        backgroundColor: "#f68300",
        color: "#fff",
        padding: "10px 20px",
        borderRadius: "30px",
        border: "none",
        fontSize: "16px",
        fontWeight: "500",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      },
    accountButtonWrapper: {
        position: "absolute",
        top: "20px",
        left: "20px", // ⬅️ changed from right to left
        zIndex: 100,
      },
      dropdownItem: {
        display: "block",
        padding: "10px 20px",
        textAlign: "left",
        backgroundColor: "white",
        border: "none",
        fontSize: "14px",
        color: "#1C2529",
        cursor: "pointer",
        textDecoration: "none",
        marginBottom: "0px", // ✅ Reduced from "2px" to "0px"
      },
    row: {
        marginBottom: "15px",
        display: "flex",
        justifyContent: "left",
        alignItems: "left",
    },
    spacebetween: {
        width: "30px",
    },

    container: {
        paddingTop: "20px",
        paddingLeft: "10px",
        paddingRight:"10px",
        textAlign: "center",
        backgroundColor: "#fff",
        width:"auto", 
        height:"auto"
      },
    inputHalf: {
        flex: 1,
    },
    button: {
      marginTop:"5px",
      marginLeft:"50px",
        padding: "10px 20px",
        fontSize: "16px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "1px solid #ccc",
        color: "white",
        width:"auto",
        height:"50px"
    },
    displayBox: {
        height:"auto",
        marginTop: "20px",
        marginBottom: "20px",
        padding: "15px",
        backgroundColor: "#e9ecef",
        borderRadius: "10px",
        textAlign: "left",
    },



   verifyButton: {
    padding: "10px 15px",
    backgroundColor: "#a3743e",
    color: "#fff",
    border: "none",
    // borderRadius: "20px",
    cursor: "pointer",
    marginRight: "10px",height:"40px"
  },
  rejectButton: {
    padding: "10px 15px",
    backgroundColor: "#a3743e",
    color: "#fff",
    border: "none",
    // borderRadius: "20px",
    cursor: "pointer",height:"40px"
  },
};
export default DashboardAdmin;
