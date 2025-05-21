const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");



const investorDB = mongoose.createConnection(process.env.MONGO_ATLAS_URI_INVESTOR, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});


// Define Investor schema
const InvestorSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    email: { type: String, required: true, unique: true },

    isVerified: { type: Boolean, default: false },
    verificationToken: { type: String },
    verificationTokenExpires: { type: Date },
    // proofFileId: { type: mongoose.Schema.Types.ObjectId, required: true },
    proofFileId: { type: mongoose.Schema.Types.ObjectId, default: null },

    isPaid: { type: Boolean, default: false },
    subscriptionEndDate: { type: Date, default: null },

    verifiedProof: { type: Boolean, default: false }, // 🚨 NEW FIELD

    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date }

}, { timestamps: true });




InvestorSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});


InvestorSchema.methods.comparePassword = function(password) {
    return bcrypt.compare(password, this.password);
};

// Export model using the correct database connection
const Investor = investorDB.model("Investor", InvestorSchema);



// Update existing investors to include default verifiedProof if missing
Investor.updateMany({ verifiedProof: { $exists: false } }, { $set: { verifiedProof: false } }).then(result => {
    console.log("Investor verifiedProof field defaulted:", result.modifiedCount);
}).catch(err => {
    console.error("Error updating Investor verifiedProof defaults:", err);
});

module.exports = Investor;