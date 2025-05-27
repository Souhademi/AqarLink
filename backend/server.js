require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require('./routes/auth');
const payRoutes = require('./routes/chargily-invoice');
const messageRoutes = require('./routes/message');
const Message = require('./models/Message');
const { faqRoutes, faqData } = require('./faqData');







const app = express();
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        // origin: "http://localhost:3000",

        // origin: process.env.FRONTEND_URL,
        origin: [process.env.FRONTEND_URL, "http://localhost:3000"],

        methods: ["GET", "POST"]
    }
});

app.use(express.json());
// app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(cors({ origin: process.env.FRONTEND_URL, credentials: true }));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api', faqRoutes);
app.use('/api/payment', payRoutes)

// MongoDB Connections
if (!process.env.MONGO_ATLAS_URI_CLIENT || !process.env.MONGO_ATLAS_URI_AGENCY || !process.env.MONGO_ATLAS_URI_INVESTOR) {
    console.error("MongoDB URIs are missing.");
    process.exit(1);
}





const clientDB = mongoose.createConnection(process.env.MONGO_ATLAS_URI_CLIENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 200000,
    bufferCommands: false,
    autoIndex: false, // <--- disable index auto-creation
});

const estateAgencyDB = mongoose.createConnection(process.env.MONGO_ATLAS_URI_AGENCY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 200000,
    bufferCommands: false
});

const investorDB = mongoose.createConnection(process.env.MONGO_ATLAS_URI_INVESTOR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 200000,
    bufferCommands: false
});


clientDB.on('connected', () => console.log("✅ Client DB connected"));
estateAgencyDB.on('connected', () => console.log("✅ Estate Agency DB connected"));
investorDB.on('connected', () => console.log("✅ Investor DB connected"));

module.exports = { clientDB, estateAgencyDB, investorDB };




mongoose.connect(process.env.MONGO_ATLAS_URI_CHATBOT, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        serverSelectionTimeoutMS: 20000
    })
    .then(() => console.log("✅ Chatbot DB connected"))
    .catch(err => console.error("❌ Chatbot DB error:", err));




const clientSockets = {};
const agencySockets = {};
const investorSockets = {};

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("register_user", ({ userId, role }) => {
        if (role === "Client") {
            clientSockets[userId] = socket.id;
        } else if (role === "AgencyAdmin") {
            agencySockets[userId] = socket.id;
        } else if (role === "Investor") {
            investorSockets[userId] = socket.id;
        }
    });

    socket.on("send_message", async({ senderId, senderRole, question, adminId, adminRole }) => {
        if (!senderId || !question || !adminId || !adminRole) return;

        const roleMap = {
            client: "Client",
            investor: "Investor",
            agencyadmin: "AgencyAdmin",
            admin: "Admin",
            chatbot: "Chatbot",
        };

        const normalizedSenderRole = roleMap[senderRole.toLowerCase()] || senderRole;

        const savedMessage = await new Message({ senderId, senderRole: normalizedSenderRole, question }).save();

        let reply = `I couldn't find an exact answer. Our team will respond soon.`;
        const lowerText = question.toLowerCase();

        // Handle FAQ responses
        for (const faq of faqData) {
            for (const keyword of faq.keywords) {
                if (new RegExp(`\\b${keyword}\\b`, "i").test(lowerText)) {
                    reply = faq.answer;
                    break;
                }
            }
            if (reply !== `I couldn't find an exact answer. Our team will respond soon.`) break;
        }

        // Send message to the client
        const senderSocketId = clientSockets[senderId] || agencySockets[senderId] || investorSockets[senderId];
        if (senderSocketId) {
            io.to(senderSocketId).emit("receive_message", {
                sender: "chatbot",
                text: reply,
                userId: senderId,
                timestamp: new Date().toISOString(),
            });
        }

        // Save chatbot reply
        await new Message({
            senderId,
            senderRole: "Chatbot",
            question: reply,
        }).save();

        // Forward message to the appropriate admin
        let adminSocketId = null;
        if (adminRole === "AgencyAdmin") {
            adminSocketId = agencySockets[adminId];
        } else if (adminRole === "Investor") {
            adminSocketId = investorSockets[adminId];
        }

        if (adminSocketId) {
            io.to(adminSocketId).emit("receive_message", {
                sender: senderRole,
                text: question,
                userId: senderId,
                messageId: savedMessage._id,
                timestamp: new Date().toISOString(),
            });
        }
    });

    socket.on("disconnect", () => {
        Object.entries(clientSockets).forEach(([userId, socketId]) => {
            if (socketId === socket.id) delete clientSockets[userId];
        });
        Object.entries(agencySockets).forEach(([userId, socketId]) => {
            if (socketId === socket.id) delete agencySockets[userId];
        });







        Object.entries(investorSockets).forEach(([userId, socketId]) => {
            if (socketId === socket.id) delete investorSockets[userId];
        });
    });
});
// 🌐 Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));