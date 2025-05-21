const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
// const Property = require('./Property'); // Import Property model

const estateAgencyAdminDb = mongoose.createConnection(process.env.MONGO_ATLAS_URI_AGENCY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const PropertySchema = new mongoose.Schema({
    description: String,
    price: String,
    transactionType: String,
    propertyType: String,
    location: String,
    space: { type: Number }, // 🆕 Added here
    images: [{
        filename: String,
        fileId: mongoose.Schema.Types.ObjectId,
    }],
    createdAt: Date,
}, { timestamps: true });

const EstateAgencyAdminSchema = new mongoose.Schema({
    agencyName: { type: String, required: true },
    adminFirstName: { type: String, required: true },
    adminLastName: { type: String, required: true },

    agencyAddress: { type: String, required: true }, // ✅ Added this line

    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    proofFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    isPaid: { type: Boolean, default: false },
    subscriptionEndDate: { type: Date, default: null },
    verifiedProof: { type: Boolean, default: false }, // 🚨 NEW FIELD

    properties: [PropertySchema],


    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }
    // properties: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Property' }],
}, { timestamps: true });




EstateAgencyAdminSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

EstateAgencyAdminSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

const Admin = estateAgencyAdminDb.model("Admin", EstateAgencyAdminSchema, "admins");

Admin.updateMany({ verifiedProof: { $exists: false } }, { $set: { verifiedProof: false } }).then(result => {
    console.log("Updated agency documents:", result.modifiedCount);
}).catch(err => {
    console.error("Error updating agency documents:", err);
});


module.exports = Admin;