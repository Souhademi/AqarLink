// import React, { useEffect, useRef, useState } from "react";
// import io from "socket.io-client";
// import axios from "axios";
// import chatbot from "./images/chatbot.png"; // Unused, but kept

// const InvestorChatBot = ({ sender = "Investor" }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatRef = useRef(null);
//   const socketRef = useRef(null);

//   const ROLES = {
//     CLIENT: "Client",
//     INVESTOR: "Investor",
//     AGENCY_ADMIN: "AgencyAdmin",
//     ADMIN: "Admin",
//     CHATBOT: "Chatbot",
//   };

//   const senderId =
//     localStorage.getItem("investorId") || sessionStorage.getItem("investorId");

//   // Register socket
//   useEffect(() => {
//     if (!senderId) return;

//     const socket = io("http://localhost:5000");
//     socketRef.current = socket;

//     socket.emit("register_user", {
//       userId: senderId,
//       role: ROLES.INVESTOR,
//     });

//     socket.on("receive_message", (data) => {
//       setMessages((prev) => [...prev, data]);
//     });

//     return () => socket.disconnect();
//   }, [senderId]);

//   // Load message history
//   useEffect(() => {
//     if (!senderId) return;
//     axios.get(`http://localhost:5000/api/messages/${senderId}`).then((res) => {
//       const allMsgs = res.data.flatMap((m) => {
//         const arr = [];
//         if (m.question) {
//           arr.push({
//             sender:
//               m.senderRole.toLowerCase() === "chatbot"
//                 ? "chatbot"
//                 : m.senderRole.toLowerCase(),
//             text: m.question,
//             timestamp: m.createdAt,
//           });
//         }
//         if (m.reply) {
//           arr.push({
//             sender: "admin",
//             text: m.reply,
//             timestamp: m.repliedAt || new Date().toISOString(),
//           });
//         }
//         return arr;
//       });

//       const sorted = allMsgs.sort(
//         (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
//       );
//       setMessages(sorted);
//     });
//   }, [senderId]);

//   // Auto-scroll
//   useEffect(() => {
//     if (isOpen && chatRef.current) {
//       const timeout = setTimeout(() => {
//         chatRef.current.scrollTop = chatRef.current.scrollHeight;
//       }, 100);
//       return () => clearTimeout(timeout);
//     }
//   }, [messages, isOpen]);

//   const handleUserMessage = (userMessage) => {
//     if (!senderId || !userMessage.trim()) return;

//     const cleanedMsg = userMessage.trim();

//     setMessages((prev) => [
//       ...prev,
//       {
//         sender: ROLES.INVESTOR,
//         text: cleanedMsg,
//         timestamp: new Date().toISOString(),
//       },
//     ]);

//     socketRef.current.emit("send_message", {
//       senderId,
//       senderRole: ROLES.INVESTOR,
//       question: cleanedMsg,
//       adminId: "system", // Optional if unused
//       adminRole: ROLES.ADMIN,
//     });

//     setInput("");
//   };

//   return (
//     <div style={styles.chatbotContainer}>
//       {!isOpen ? (
//         <button style={styles.openBtn} onClick={() => setIsOpen(true)}>
          
//         </button>
//       ) : (
//         <div style={styles.chatWindow}>
//           <div style={styles.header}>
//             <span>Ask for help</span>
//             <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
//               ×
//             </button>
//           </div>
//           <div ref={chatRef} style={styles.body}>
//             {/* {messages.map((msg, idx) => (
//               <div
//                 key={idx}
//                 style={{
//                   display: "flex",
//                   justifyContent:
//                     msg.sender.toLowerCase() === sender.toLowerCase()
//                       ? "flex-end"
//                       : "flex-start",
//                   marginBottom: "10px",
//                 }}
//               >
//                 <div
//                   style={{
//                     maxWidth: "70%",
//                     padding: "8px 12px",
//                     borderRadius: "16px",
//                     backgroundColor:
//                       msg.sender.toLowerCase() === sender.toLowerCase()
//                         ? "#DCF8C6"
//                         : "#E2E2FF",
//                     color: "#333",
//                     textAlign: "left",
//                   }}
//                 >
//                   <div
//                     style={{
//                       fontSize: "12px",
//                       fontWeight: "bold",
//                       marginBottom: "4px",
//                     }}
//                   >
//                     {msg.sender.toLowerCase() === sender.toLowerCase()
//                       ? "You"
//                       : msg.sender}
//                   </div>
//                   <div>{msg.text}</div>
//                   <div
//                     style={{
//                       fontSize: "10px",
//                       color: "#666",
//                       marginTop: "4px",
//                       textAlign: "right",
//                     }}
//                   >
//                     {new Date(msg.timestamp).toLocaleTimeString([], {
//                       hour: "2-digit",
//                       minute: "2-digit",
//                     })}
//                   </div>
//                 </div>
//               </div>
//             ))} */}




//             {messages.map((msg, idx) => {
//   const currentDate = new Date(msg.timestamp).toLocaleDateString();
//   const previousDate =
//     idx > 0 ? new Date(messages[idx - 1].timestamp).toLocaleDateString() : null;
//   const showDate = idx === 0 || currentDate !== previousDate;

//   return (
//     <React.Fragment key={idx}>
//       {showDate && (
//         <div style={{ textAlign: "center", margin: "10px 0", color: "#888", fontSize: "12px" }}>
//           {new Date(msg.timestamp).toLocaleDateString("en-US", {
//             month: "short",
//             day: "numeric",
//           })}
//         </div>
//       )}
//       <div
//         style={{
//           display: "flex",
//           justifyContent:
//             msg.sender.toLowerCase() === sender.toLowerCase()
//               ? "flex-end"
//               : "flex-start",
//           marginBottom: "10px",
//         }}
//       >
//         <div
//           style={{
//             maxWidth: "70%",
//             padding: "8px 12px",
//             borderRadius: "16px",
//             backgroundColor:
//               msg.sender.toLowerCase() === sender.toLowerCase()
//                 ? "#DCF8C6"
//                 : "#E2E2FF",
//             color: "#333",
//             textAlign: "left",
//           }}
//         >
//           <div
//             style={{
//               fontSize: "12px",
//               fontWeight: "bold",
//               marginBottom: "4px",
//             }}
//           >
//             {msg.sender.toLowerCase() === sender.toLowerCase()
//               ? "You"
//               : msg.sender}
//           </div>
//           <div>{msg.text}</div>
//           <div
//             style={{
//               fontSize: "10px",
//               color: "#666",
//               marginTop: "4px",
//               textAlign: "right",
//             }}
//           >
//             {new Date(msg.timestamp).toLocaleTimeString([], {
//               hour: "2-digit",
//               minute: "2-digit",
//             })}
//           </div>
//         </div>
//       </div>
//     </React.Fragment>
//   );
// })}

//           </div>
//           <div style={styles.inputContainer}>
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask something..."
//               style={styles.input}
//             />
//             <button style={styles.sendBtn} onClick={() => handleUserMessage(input)}>
//               Ask
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// const styles = {
//   chatbotContainer: {
//     position: "fixed",
//     bottom: "20px",
//     right: "20px",
//     zIndex: 1000,
//   },
//   openBtn: {
//     backgroundImage: `url(${chatbot})`,
//     backgroundSize: "75%",
//     backgroundRepeat: "no-repeat",
//     backgroundPosition: "center",
//     backgroundColor: "#F0F8FF",
//     display: "flex",
//     alignItems: "center",
//     justifyContent: "center",
//     color: "#fff",
//     border: "none",
//     borderRadius: "50%",
//     width: "70px",
//     height: "70px",
//     padding: "5px",
//     fontSize: "24px",
//     cursor: "pointer",
//     boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
//     overflow: "hidden",
//   },
//   chatWindow: {
//     width: "320px",
//     height: "440px",
//     backgroundColor: "#fff",
//     border: "1px solid #ccc",
//     borderRadius: "10px",
//     overflow: "hidden",
//     display: "flex",
//     flexDirection: "column",
//     boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
//   },
//   header: {
//     backgroundColor: "#1E5470",
//     color: "white",
//     padding: "12px",
//     display: "flex",
//     justifyContent: "space-between",
//     alignItems: "center",
//   },
//   closeBtn: {
//     background: "none",
//     color: "white",
//     border: "none",
//     fontSize: "28px",
//     cursor: "pointer",
//   },
//   body: {
//     flex: 1,
//     padding: "10px",
//     overflowY: "auto",
//     fontSize: "14px",
//     backgroundColor: "#f9f9f9",
//   },
//   inputContainer: {
//     display: "flex",
//     borderTop: "1px solid #eee",
//     padding: "10px",
//   },
//   input: {
//     flex: 1,
//     border: "1px solid #ccc",
//     borderRadius: "20px",
//     padding: "8px 12px",
//     fontSize: "14px",
//     outline: "none",
//   },
//   sendBtn: {
//     height: "40px",
//     marginLeft: "8px",
//     backgroundColor: "#1E5470",
//     color: "white",
//     border: "none",
//     borderRadius: "20px",
//     padding: "0 16px",
//     cursor: "pointer",
//   },
// };


// export default InvestorChatBot;



import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import axios from "axios";
import chatbot from "../assets/chatbot.png"; // Unused, but kept

const InvestorChatBot = ({ sender = "Investor" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0); // Track unread messages
  const chatRef = useRef(null);
  const socketRef = useRef(null);

  const ROLES = {
    CLIENT: "Client",
    INVESTOR: "Investor",
    AGENCY_ADMIN: "AgencyAdmin",
    ADMIN: "Admin",
    CHATBOT: "Chatbot",
  };

  const senderId =
    localStorage.getItem("investorId") || sessionStorage.getItem("investorId");

  // Register socket
  useEffect(() => {
    if (!senderId) return;

    const socket = io("http://localhost:5000");
    socketRef.current = socket;

    socket.emit("register_user", {
      userId: senderId,
      role: ROLES.INVESTOR,
    });

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
      if (!isOpen && data.sender !== ROLES.INVESTOR) {
        setUnreadMessages((prev) => prev + 1); // Increment unread messages count if not from the investor
      }
    });

    return () => socket.disconnect();
  }, [senderId, isOpen]);

  // Load message history
  useEffect(() => {
    if (!senderId) return;
    axios.get(`http://localhost:5000/api/messages/${senderId}`).then((res) => {
      const allMsgs = res.data.flatMap((m) => {
        const arr = [];
        if (m.question) {
          arr.push({
            sender:
              m.senderRole.toLowerCase() === "chatbot"
                ? "chatbot"
                : m.senderRole.toLowerCase(),
            text: m.question,
            timestamp: m.createdAt,
          });
        }
        if (m.reply) {
          arr.push({
            sender: "admin",
            text: m.reply,
            timestamp: m.repliedAt || new Date().toISOString(),
          });
        }
        return arr;
      });

      const sorted = allMsgs.sort(
        (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
      );
      setMessages(sorted);
    });
  }, [senderId]);

  // Auto-scroll
  useEffect(() => {
    if (isOpen && chatRef.current) {
      const timeout = setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages, isOpen]);

  const handleUserMessage = (userMessage) => {
    if (!senderId || !userMessage.trim()) return;

    const cleanedMsg = userMessage.trim();

    setMessages((prev) => [
      ...prev,
      {
        sender: ROLES.INVESTOR,
        text: cleanedMsg,
        timestamp: new Date().toISOString(),
      },
    ]);

    socketRef.current.emit("send_message", {
      senderId,
      senderRole: ROLES.INVESTOR,
      question: cleanedMsg,
      adminId: "system", // Optional if unused
      adminRole: ROLES.ADMIN,
    });

    setInput("");
  };

  const handleChatOpen = () => {
    setIsOpen(true);
    setUnreadMessages(0); // Reset unread messages count when the chat is opened
  };

  return (
    <div style={styles.chatbotContainer}>
      {!isOpen ? (
        <button style={styles.openBtn} onClick={handleChatOpen}>
          {/* Show red dot if there are unread messages */}
          {unreadMessages > 0 && (
            <div style={styles.redDot}></div>
          )}
        </button>
      ) : (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>Ask for help</span>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              ×
            </button>
          </div>
          <div ref={chatRef} style={styles.body}>
            {messages.map((msg, idx) => {
              const currentDate = new Date(msg.timestamp).toLocaleDateString();
              const previousDate =
                idx > 0 ? new Date(messages[idx - 1].timestamp).toLocaleDateString() : null;
              const showDate = idx === 0 || currentDate !== previousDate;

              return (
                <React.Fragment key={idx}>
                  {showDate && (
                    <div style={{ textAlign: "center", margin: "10px 0", color: "#888", fontSize: "12px" }}>
                      {new Date(msg.timestamp).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </div>
                  )}
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        msg.sender.toLowerCase() === sender.toLowerCase()
                          ? "flex-end"
                          : "flex-start",
                      marginBottom: "10px",
                    }}
                  >
                    <div
                      style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: "16px",
                        backgroundColor:
                          msg.sender.toLowerCase() === sender.toLowerCase()
                            ? "#DCF8C6"
                            : "#E2E2FF",
                        color: "#333",
                        textAlign: "left",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: "bold",
                          marginBottom: "4px",
                        }}
                      >
                        {msg.sender.toLowerCase() === sender.toLowerCase()
                          ? "You"
                          : msg.sender}
                      </div>
                      <div>{msg.text}</div>
                      <div
                        style={{
                          fontSize: "10px",
                          color: "#666",
                          marginTop: "4px",
                          textAlign: "right",
                        }}
                      >
                        {new Date(msg.timestamp).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>
                  </div>
                </React.Fragment>
              );
            })}
          </div>
          <div style={styles.inputContainer}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something..."
              style={styles.input}
            />
            <button style={styles.sendBtn} onClick={() => handleUserMessage(input)}>
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const styles = {
  redDot: {
    position: "absolute",
    top: "5px",
    right: "5px",
    width: "12px",
    height: "12px",
    borderRadius: "50%",
    backgroundColor: "red",
  },
  chatbotContainer: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    zIndex: 1000,
  },
  openBtn: {
    backgroundImage: `url(${chatbot})`,
    backgroundSize: "75%",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundColor: "#F0F8FF",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    border: "none",
    borderRadius: "50%",
    width: "70px",
    height: "70px",
    padding: "5px",
    fontSize: "24px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    overflow: "hidden",
  },
  chatWindow: {
    width: "320px",
    height: "440px",
    backgroundColor: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
  },
  header: {
    backgroundColor: "#1E5470",
    color: "white",
    padding: "12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  closeBtn: {
    background: "none",
    color: "white",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
  },
  body: {
    flex: 1,
    padding: "10px",
    overflowY: "auto",
    fontSize: "14px",
    backgroundColor: "#f9f9f9",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #eee",
    padding: "10px",
  },
  input: {
    flex: 1,
    border: "1px solid #ccc",
    borderRadius: "20px",
    padding: "8px 12px",
    fontSize: "14px",
    outline: "none",
  },
  sendBtn: {
    height: "40px",
    marginLeft: "8px",
    backgroundColor: "#1E5470",
    color: "white",
    border: "none",
    borderRadius: "20px",
    padding: "0 16px",
    cursor: "pointer",
  },
};

export default InvestorChatBot;
