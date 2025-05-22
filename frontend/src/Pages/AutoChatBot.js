import React, { useState, useEffect, useRef } from "react";
import chatbot from "../assets/chatbot.png";

const AutoChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef(null);
  const [faqData, setFaqData] = useState([]);

  useEffect(() => {
    // fetch("${process.env.REACT_APP_BACKEND_URL}api/faq")
  fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/faq`)


      .then((res) => res.json())
      .then((data) => setFaqData(data));
  }, []);

  useEffect(() => {
    if (isOpen && chatRef.current) {
      const timeout = setTimeout(() => {
        chatRef.current.scrollTop = chatRef.current.scrollHeight;
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [messages, isOpen]);

  const handleUserMessage = (userMessage) => {
    const normalize = (text) =>
      text.toLowerCase().replace(/[^\w\s]/gi, "").trim();

    const inputNormalized = normalize(userMessage);

const matchedFaq = faqData.find((faq) => {
  return faq.keywords.some((keyword) => {
    const keywordNormalized = normalize(keyword);
    return inputNormalized.includes(keywordNormalized);
  });
});


    const userMsg = {
      sender: "client",
      text: userMessage,
      timestamp: new Date().toISOString(),
    };

    const botMsg = {
      sender: "chatbot",
      text: matchedFaq
        ? matchedFaq.answer
        : "Sorry, I couldn't find an answer to that. Please try asking something else.",
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg, botMsg]);
  };

  return (
    <div style={styles.chatbotContainer}>
      {!isOpen ? (
        <button style={styles.openBtn} onClick={() => setIsOpen(true)}>
          {/* <img src={chatbot} alt="Chatbot" style={{ width: "40px" }} /> */}
        </button>
      ) : (
        <div style={styles.chatWindow}>
          <div style={styles.header}>
            <span>FAQ Assistant</span>
            <button style={styles.closeBtn} onClick={() => setIsOpen(false)}>
              &times;
            </button>
          </div>
          <div ref={chatRef} style={styles.body}>
            {messages.map((msg, idx) => {
              const date = new Date(msg.timestamp);
              return (
                <div
                  key={idx}
                  style={{
                    display: "flex",
                    justifyContent:
                      msg.sender === "client" ? "flex-end" : "flex-start",
                    marginBottom: "10px",
                  }}
                >
                  <div
                    style={{
                      ...styles.messageBubble,
                      backgroundColor:
                        msg.sender === "client" ? "#DCF8C6" : "#E2E2FF",
                    }}
                  >
                    <div style={styles.messageSender}>
                      {msg.sender === "client" ? "You" : "Chatbot"}
                    </div>
                    <div>{msg.text}</div>
                    <div style={styles.messageTime}>
                      {date.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
              placeholder="Ask a question..."
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
export default AutoChatBot;
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
    border: "none",
    borderRadius: "50%",
    width: "70px",
    height: "70px",
    cursor: "pointer",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
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
  dateDivider: {
    textAlign: "center",
    margin: "10px 0",
    fontSize: "12px",
    color: "#666",
  },
  messageBubble: {
    maxWidth: "70%",
    padding: "8px 12px",
    borderRadius: "16px",
    color: "#333",
    textAlign: "left",
  },
  messageSender: {
    fontSize: "12px",
    fontWeight: "bold",
    marginBottom: "4px",
  },
  messageTime: {
    fontSize: "10px",
    color: "#666",
    marginTop: "4px",
    textAlign: "right",
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
