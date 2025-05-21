const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
// const PropertyFeatures = require("./PropertyFeatures");

const clientDB = mongoose.createConnection(process.env.MONGO_ATLAS_URI_CLIENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

clientDB.on('connected', () => {
    console.log('✅ ClientDB connection established');
});

clientDB.on('error', (err) => {
    console.error('❌ Error connecting to ClientDB:', err);
});




const BusinessSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client', // Assuming "Client" is the model name
        required: true
    },
    businessName: String,
    industry: String,
    years: String, // Changed to String
    employees: Number,
    revenue: Number,
    propertyType: String,
    propertyLocation: String,
    size: Number,
    budgetMin: Number,
    budgetMax: Number,
    purpose: String,
    investmentAmount: Number,
    returnModel: String,
    returnDetails: String,
    investmentDuration: String, // Changed to String
    businessPlan: {
        fileId: mongoose.Schema.Types.ObjectId,
        filename: String,
        uploadedAt: Date
    },
    fullName: String,
    email: String,
    phone: String,
});



const PropertyFeaturesSchema = new mongoose.Schema({
    type: { type: String, required: true },

    location: {
        type: [String],
        required: true
    },
    price: {
        min: { type: Number, required: true },
        max: { type: Number, required: true }
    },
    rooms: { type: Number },
    space: {
        min: { type: Number, required: true },
        max: { type: Number, required: true },
    },
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'Client', required: true }
}, { _id: false });



const ClientSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    businesses: [BusinessSchema],
    savedProperties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
    propertyFeature: {
        type: PropertyFeaturesSchema,
        default: null,
    },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
}, { timestamps: true });



// Hash password before save (only if modified)
ClientSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        console.error("Error hashing password:", err);
        next(err);
    }
});

const Client = clientDB.model('Client', ClientSchema);
module.exports = Client;