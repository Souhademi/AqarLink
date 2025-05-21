import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminConversations = () => {
  const [conversations, setConversations] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/messages/conversations/all")
      .then((res) => setConversations(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h2>All User Conversations</h2>
      {Object.entries(conversations).map(([userId, convo]) => (
        <div key={userId} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 20 }}>
          <h4>User ID: {userId} ({convo.senderRole})</h4>
          {convo.messages.map((m, idx) => (
            <div key={idx} style={{ marginBottom: 10 }}>
              <p><strong>Q:</strong> {m.question}</p>
              <p><strong>A:</strong> {m.reply || <i>No reply yet</i>}</p>
              <hr />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default AdminConversations;
