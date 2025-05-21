
import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import chatbot from "../assets/chatbot.png";




const ChatBot = ({ sender = "client" }) => {
  const [hasNewReply, setHasNewReply] = useState(false);

  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const socketRef = useRef(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    const senderId = localStorage.getItem("clientId");
    if (!senderId) return;

    socketRef.current = io("http://localhost:5000");
 socketRef.current.emit("register_user", {
  userId: senderId,
  role: "Client"
});


    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  useEffect(() => {
    const senderId = localStorage.getItem("clientId");
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
  }, []);




  useEffect(() => {
  if (isOpen && chatRef.current) {
    const timeout = setTimeout(() => {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }, 100); // Small delay to ensure DOM is rendered
    return () => clearTimeout(timeout);
  }
}, [messages, isOpen]);




  useEffect(() => {
    fetch("http://localhost:5000/api/faq")
      .then((res) => res.json())
      .then((data) => setFaqData(data));
  }, []);
const handleUserMessage = (userMessage) => {
  const senderId = localStorage.getItem("clientId");
  const adminId = "system"; // Or assigned admin ID
  const adminRole = "Client";

  if (!senderId) return;

  setMessages((prev) => [
    ...prev,
    { sender: "client", text: userMessage, timestamp: new Date().toISOString() },
  ]);

  socketRef.current.emit("send_message", {
    senderId,
    senderRole: "Client",
    question: userMessage,
    adminId,
    adminRole,
  });
};

  return (
    <div style={styles.chatbotContainer}>
      {!isOpen ? (
        <button style={styles.openBtn} onClick={() => setIsOpen(true)} />
      ) : (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>Ask for help</span>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>
          <div ref={chatRef} style={styles.body}>
        

            {messages.map((msg, idx) => {
  const currentDate = new Date(msg.timestamp);
  const prevDate =
    idx > 0 ? new Date(messages[idx - 1].timestamp) : null;

  const isNewDay =
    !prevDate ||
    currentDate.toDateString() !== prevDate.toDateString();

  return (
    <div key={idx}>
      {isNewDay && (
        <div style={{ textAlign: "center", margin: "10px 0", fontSize: "12px", color: "#666" }}>
          {currentDate.toLocaleDateString(undefined, {
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
            {currentDate.toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      </div>
    </div>
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
            <button
              style={styles.sendBtn}
              onClick={() => {
                if (input.trim()) {
                  handleUserMessage(input.trim());
                  setInput("");
                }
              }}
            >
              Ask
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default ChatBot;

const styles = {
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

// import React, { useState, useEffect, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import chatbot from "./images/chatbot.png";

// const ChatBot = ({ sender = "client" }) => {
//   const [isOpen, setIsOpen] = useState(false);
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatRef = useRef(null);
//   const socketRef = useRef(null);
//   const [faqData, setFaqData] = useState([]);
//   const [hasUnreadAdminMessage, setHasUnreadAdminMessage] = useState(false);


//   // Setup socket connection and message receiving
//   useEffect(() => {
//     const senderId = localStorage.getItem("clientId");
//     if (!senderId) return;

//     // socketRef.current = io("http://localhost:5000");

//     // socketRef.current.emit("register_user", {
//     //   userId: senderId,
//     //   role: "Client",
//     // });
// socketRef.current = io("http://localhost:5000");

// socketRef.current.on("connect", () => {
//   const senderId = localStorage.getItem("clientId");
//   socketRef.current.emit("register_user", {
//     userId: senderId,
//     role: "Client",
//   });
// });

// socketRef.current.on("receive_message", (data) => {
//   setMessages((prev) => [...prev, data]);

//   if (data.sender.toLowerCase() === "admin" && !isOpen) {
//     setHasUnreadAdminMessage(true);
//   }
// });


//     return () => {
//       socketRef.current.disconnect();
//     };
//   }, []);
// useEffect(() => {
//   if (isOpen) setHasUnreadAdminMessage(false);
// }, [isOpen]);

//   // Fetch message history
//   useEffect(() => {
//     const senderId = localStorage.getItem("clientId");
//     if (!senderId) return;

//     axios.get(`http://localhost:5000/api/messages/${senderId}`).then((res) => {
//       const allMsgs = res.data.flatMap((m) => {
//         const arr = [];
//         if (m.question) {
//           arr.push({
//             sender: m.senderRole.toLowerCase() === "chatbot" ? "chatbot" : m.senderRole.toLowerCase(),
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

//       const sorted = allMsgs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
//       setMessages(sorted);
//     });
//   }, []);

//   // Scroll to bottom when messages change
//   useEffect(() => {
//     if (isOpen && chatRef.current) {
//       const timeout = setTimeout(() => {
//         chatRef.current.scrollTop = chatRef.current.scrollHeight;
//       }, 100);
//       return () => clearTimeout(timeout);
//     }
//   }, [messages, isOpen]);

//   // Fetch FAQ data
//   useEffect(() => {
//     fetch("http://localhost:5000/api/faq")
//       .then((res) => res.json())
//       .then((data) => setFaqData(data));
//   }, []);

//   // Send message
//   const handleUserMessage = (userMessage) => {
//     const senderId = localStorage.getItem("clientId");
//     const adminId = "system";
//     const adminRole = "Client";

//     if (!senderId) return;

//     const timestamp = new Date().toISOString();

//     setMessages((prev) => [
//       ...prev,
//       { sender: "client", text: userMessage, timestamp },
//     ]);

//     socketRef.current.emit("send_message", {
//       senderId,
//       senderRole: "Client",
//       question: userMessage,
//       adminId,
//       adminRole,
//     });
//   };

//   return (
//     <div style={styles.chatbotContainer}>
//       {!isOpen ? (
//         // <button style={styles.openBtn} onClick={() => setIsOpen(true)} />
//        <button style={styles.openBtn} onClick={() => setIsOpen(true)}>

//   {hasUnreadAdminMessage && <span style={styles.redDot} />}
// </button>

//       ) : (
//         <div style={styles.chatWindow}>
//           <div style={styles.header}>
//             <span>Ask for help</span>
//             <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
//               &times;
//             </button>
//           </div>
//           <div ref={chatRef} style={styles.body}>
//             {messages.map((msg, idx) => {
//               const currentDate = new Date(msg.timestamp);
//               const prevDate = idx > 0 ? new Date(messages[idx - 1].timestamp) : null;
//               const isNewDay =
//                 !prevDate || currentDate.toDateString() !== prevDate.toDateString();

//               return (
//                 <div key={idx}>
//                   {isNewDay && (
//                     <div style={{ textAlign: "center", margin: "10px 0", fontSize: "12px", color: "#666" }}>
//                       {currentDate.toLocaleDateString(undefined, { month: "short", day: "numeric" })}
//                     </div>
//                   )}
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent:
//                         msg.sender.toLowerCase() === sender.toLowerCase()
//                           ? "flex-end"
//                           : "flex-start",
//                       marginBottom: "10px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         maxWidth: "70%",
//                         padding: "8px 12px",
//                         borderRadius: "16px",
//                         backgroundColor:
//                           msg.sender.toLowerCase() === sender.toLowerCase()
//                             ? "#DCF8C6"
//                             : "#E2E2FF",
//                         color: "#333",
//                         textAlign: "left",
//                       }}
//                     >
//                       <div
//                         style={{
//                           fontSize: "12px",
//                           fontWeight: "bold",
//                           marginBottom: "4px",
//                         }}
//                       >
//                         {msg.sender.toLowerCase() === sender.toLowerCase() ? "You" : msg.sender}
//                       </div>
//                       <div>{msg.text}</div>
//                       <div
//                         style={{
//                           fontSize: "10px",
//                           color: "#666",
//                           marginTop: "4px",
//                           textAlign: "right",
//                         }}
//                       >
//                         {currentDate.toLocaleTimeString([], {
//                           hour: "2-digit",
//                           minute: "2-digit",
//                         })}
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//           <div style={styles.inputContainer}>
//             <input
//               type="text"
//               value={input}
//               onChange={(e) => setInput(e.target.value)}
//               placeholder="Ask something..."
//               style={styles.input}
//             />
//             <button
//               style={styles.sendBtn}
//               onClick={() => {
//                 if (input.trim()) {
//                   handleUserMessage(input.trim());
//                   setInput("");
//                 }
//               }}
//             >
//               Ask
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChatBot;

// const styles = {

//   redDot: {
//   position: "absolute",
//   top: "8px",
//   right: "8px",
//   width: "12px",
//   height: "12px",
//   borderRadius: "50%",
//   backgroundColor: "red",
//   zIndex: 2,
// },

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
