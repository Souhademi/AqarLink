// import React, { useEffect, useRef, useState } from "react";
// import { io } from "socket.io-client";

// const socket = io("${process.env.REACT_APP_BACKEND_URL}");
// socket.emit("register", "admin");

// const AdminChat = () => {
//   const [input, setInput] = useState("");
//   const [messages, setMessages] = useState([]);
//   const chatRef = useRef();

//   useEffect(() => {
//     socket.on("receive_message", (msg) => {
//       setMessages((prev) => [...prev, msg]);
//     });

//     return () => socket.off("receive_message");
//   }, []);

//   useEffect(() => {
//     if (chatRef.current) {
//       chatRef.current.scrollTop = chatRef.current.scrollHeight;
//     }
//   }, [messages]);

//   const sendMessage = () => {
//     if (!input.trim()) return;
//     const msg = { text: input };
//     socket.emit("admin_message", msg);
//     setMessages((prev) => [...prev, { ...msg, sender: "admin" }]);
//     setInput("");
//   };

//   return (
//     <div>
//       <h2>Admin Chat Panel</h2>
//       <div ref={chatRef} style={{ height: 300, overflowY: "auto", border: "1px solid #ccc", padding: 10 }}>
//         {messages.map((msg, idx) => (
//           <div key={idx}>
//             <strong>{msg.sender}:</strong> {msg.text}
//           </div>
//         ))}
//       </div>
//       <input
//         value={input}
//         onChange={(e) => setInput(e.target.value)}
//         onKeyDown={(e) => e.key === "Enter" && sendMessage()}
//         placeholder="Type a reply"
//       />
//       <button onClick={sendMessage}>Reply</button>
//     </div>
//   );
// };

// export default AdminChat;





import React, { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("${process.env.REACT_APP_BACKEND_URL}");
socket.emit("register", "admin"); // Register the admin

const AdminChat = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const chatRef = useRef();

  // Listen for incoming messages
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => socket.off("receive_message");
  }, []);

  // Auto-scroll to the bottom when new messages arrive
  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const msg = { text: input };
    socket.emit("admin_message", msg); // Send message to the client
    setMessages((prev) => [...prev, { ...msg, sender: "admin" }]);
    setInput("");
  };

  return (
    <div>
      <h2>Admin Chat Panel</h2>
      <div
        ref={chatRef}
        style={{
          height: 300,
          overflowY: "auto",
          border: "1px solid #ccc",
          padding: 10,
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.sender}:</strong> {msg.text}
          </div>
        ))}
      </div>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Type a reply"
      />
      <button onClick={sendMessage}>Reply</button>
    </div>
  );
};

export default AdminChat;
