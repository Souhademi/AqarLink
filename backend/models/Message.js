// const mongoose = require("mongoose");

// const messageSchema = new mongoose.Schema({
//     question: {
//         type: String,
//         required: true,
//     },
//     senderRole: {
//         type: String,
//         required: true,
//     },
//     senderId: {
//         type: mongoose.Schema.Types.ObjectId,
//         required: true,
//         refPath: 'senderRole' // dynamically reference either 'Agency' or 'Investor'
//     },
//     reply: {
//         type: String,
//         default: "",
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now,
//     },
// });

// module.exports = mongoose.model("Message", messageSchema);
// models/Message.js


const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    senderId: {
        type: String,
        required: true,
    },
    senderRole: {
        type: String,
        // enum: ['Client', 'Investor', 'AgencyAdmin', 'Admin', 'Chatbot'],
        enum: ['Client', 'Investor', 'AgencyAdmin', 'Admin', 'Chatbot'],

        required: true,
    },
    question: {
        type: String,
        default: '',
    },
    reply: {
        type: String,
        default: '',
    },
    repliedAt: {
        type: Date,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Message', messageSchema);