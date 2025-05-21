const express = require('express');
const router = express.Router();
const Message = require('../models/Message');

router.post('/', async(req, res) => {
    const { senderId, senderRole, question } = req.body;

    if (!senderId || !senderRole || !question) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    try {
        const newMessage = new Message({ senderId, senderRole, question });
        await newMessage.save();
        res.status(201).json(newMessage);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/unanswered', async(req, res) => {
    try {
        const unanswered = await Message.find({ reply: '' }).sort({ createdAt: -1 });
        res.status(200).json(unanswered);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

router.post('/reply', async(req, res) => {
    const { messageId, reply } = req.body;

    if (!messageId || !reply) {
        return res.status(400).json({ error: 'Missing messageId or reply' });
    }

    try {
        const message = await Message.findById(messageId);
        if (!message) return res.status(404).json({ error: 'Message not found' });

        message.reply = reply;
        message.repliedAt = new Date();
        await message.save();

        res.status(200).json({ message: 'Reply saved', data: message });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// router.post('/reply', async(req, res) => {
//     const { messageId, reply } = req.body;
//     if (!messageId || !reply) {
//         return res.status(400).json({ error: 'Missing messageId or reply' });
//     }

//     try {
//         console.log("Reply route called with:", { messageId, reply });

//         const message = await Message.findById(messageId);
//         if (!message) {
//             console.log("Message not found for id:", messageId);
//             return res.status(404).json({ error: 'Message not found' });
//         }

//         message.reply = reply;
//         message.repliedAt = new Date();
//         await message.save();

//         console.log("Message updated:", message);

//         const clientSocketId = clientSockets[message.senderId];
//         console.log("Client socket ID:", clientSocketId);

//         if (clientSocketId) {
//             io.to(clientSocketId).emit("receive_message", {
//                 sender: "admin",
//                 text: reply,
//                 timestamp: message.repliedAt.toISOString(),
//             });
//             console.log("Emit sent to client");
//         } else {
//             console.log("Client socket ID not found, can't emit");
//         }

//         res.status(200).json({ message: 'Reply saved', data: message });
//     } catch (err) {
//         console.error("Error in /reply route:", err);
//         res.status(500).json({ error: 'Server error' });
//     }
// });




// Get all messages from a specific user
router.get('/:userId', async(req, res) => {
    try {
        const messages = await Message.find({ senderId: req.params.userId }).sort({ createdAt: 1 });
        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch messages" });
    }
});

// Get all conversations grouped by senderId
router.get('/conversations/all', async(req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: 1 });

        const conversations = {};

        messages.forEach(msg => {
            const { senderId, senderRole, question, reply, createdAt, repliedAt } = msg;

            if (!conversations[senderId]) {
                conversations[senderId] = {
                    senderRole,
                    messages: []
                };
            }

            conversations[senderId].messages.push({
                question,
                reply,
                createdAt,
                repliedAt
            });
        });

        res.status(200).json(conversations);
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all users who have sent messages
router.get('/users', async(req, res) => {
    try {
        const messages = await Message.find().sort({ createdAt: -1 });

        const uniqueUsers = {};
        messages.forEach(msg => {
            if (!uniqueUsers[msg.senderId]) {
                uniqueUsers[msg.senderId] = {
                    _id: msg.senderId,
                    name: msg.senderName || null,
                    email: msg.senderEmail || null,
                    role: msg.senderRole || 'User',
                };
            }
        });

        res.status(200).json({ users: Object.values(uniqueUsers) });
    } catch (err) {
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router;