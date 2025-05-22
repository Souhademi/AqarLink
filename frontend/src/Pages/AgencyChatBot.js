import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import chatbot from "../assets/chatbot.png";

const AgencyChatBot = ({ sender = "AgencyAdmin" }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const socketRef = useRef(null);
  const [faqData, setFaqData] = useState([]);

  const ROLES = {
    CLIENT: "Client",
    INVESTOR: "Investor",
    AGENCY_ADMIN: "AgencyAdmin",
    ADMIN: "Admin",
    CHATBOT: "Chatbot"
  };

  useEffect(() => {
    const senderId = localStorage.getItem("agencyId");
    if (!senderId) return;

    // socketRef.current = io("${process.env.REACT_APP_BACKEND_URL}");
    socketRef.current = io("${process.env.NEXT_PUBLIC_BACKEND_URL}");

    socketRef.current.emit("register_user", {
      userId: senderId,
      role: ROLES.AGENCY_ADMIN,
    });

    socketRef.current.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socketRef.current.disconnect();
  }, []);

  useEffect(() => {
    const senderId = localStorage.getItem("agencyId");
    if (!senderId) return;

    axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/messages/${senderId}`).then((res) => {
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
    fetch("${process.env.REACT_APP_BACKEND_URL}api/faq")
      .then((res) => res.json())
      .then((data) => setFaqData(data));
  }, []);

  const handleUserMessage = (userMessage) => {
    const senderId = localStorage.getItem("agencyId");
    const adminId = "system";
    const adminRole = ROLES.AGENCY_ADMIN;

    if (!senderId || !userMessage) return;

    setMessages((prev) => [
      ...prev,
      {
        sender: ROLES.AGENCY_ADMIN,
        text: userMessage,
        timestamp: new Date().toISOString(),
      },
    ]);

    socketRef.current.emit("send_message", {
      senderId,
      senderRole: ROLES.AGENCY_ADMIN,
      question: userMessage,
      adminId,
      adminRole,
    });
  };

  return (
    <div style={styles.chatbotContainer}>
      {!isOpen ? (
        <button style={styles.openBtn} onClick={() => setIsOpen(true)}>
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


export default AgencyChatBot;