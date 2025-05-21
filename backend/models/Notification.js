const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const NotificationSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', index: true },
    propertyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Property' },
    message: String,
    read: { type: Boolean, default: false, index: true }


}, { timestamps: true });


module.exports = mongoose.model("Notification", NotificationSchema);