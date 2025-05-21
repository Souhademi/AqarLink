const mongoose = require('mongoose');

const PropertyFeaturesSchema = new mongoose.Schema({
    type: { type: String, required: true },
    locations: [{ type: String }], // Array of strings
    price: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    rooms: { type: Number }, // Optional for non-villa/apartment properties
    space: { type: Number, required: true },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { timestamps: true });

// const PropertyFeatures = mongoose.model('PropertyFeatures', PropertyFeaturesSchema);
module.exports = PropertyFeatures;