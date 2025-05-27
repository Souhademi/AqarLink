const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Client = require("../models/Client");
const Admin = require("../models/Admin");
const Investor = require("../models/Investor");
const Notification = require("../models/Notification");
const Message = require("../models/Message");



const mongoose = require('mongoose');

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { GridFSBucket, ObjectId } = require("mongodb");

const multer = require('multer');

// Set up Nodemailer transporter

const { upload, dbReady, uploadToGridFS, getBucket } = require('../middlewares/gridfsUpload');


const Grid = require('gridfs-stream');
const conn = mongoose.connection;
let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('uploads'); // or whatever your collection name
});


require('dotenv').config();




const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
    },
    secure: true, // Use this for port 465
    port: 465, // Port for secure connection
    tls: {
        rejectUnauthorized: false,
    },
});


router.post("/send", async(req, res) => {
    try {
        const { senderId, senderType, message } = req.body;
        const newMessage = new Message({ senderId, senderType, message });
        await newMessage.save();
        res.status(200).json({ success: true, message: "Message sent!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Admin gets all messages
router.get("/admin", async(req, res) => {
    try {
        const messages = await Message.find().sort({ timestamp: 1 });
        res.status(200).json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Utility to send email
const sendEmail = async(to, subject, html) => {
    await transporter.sendMail({
        from: `"AqarLink Platform" <${process.env.EMAIL_USERNAME}>`,
        to,
        subject,
        html,
    });
};



///////////////////////////////
// ❌ PATCH: Reject Investor
///////////////////////////////
router.patch('/investor/reject/:id', async(req, res) => {
    try {
        const investor = await Investor.findById(req.params.id);
        if (!investor) return res.status(404).json({ message: 'Investor not found' });

        investor.verifiedProof = false;
        await investor.save();

        await sendEmail(
            investor.email,
            'Account Rejected',
            `<p>Hello ${investor.firstName} ${investor.lastName},</p><p>We're sorry to inform you that your investment legal proof has been <strong>rejected</strong>, You have to recreate your account again with new legal proof.</p>`
        );

        res.status(200).json({ message: 'Investor rejected and email sent' });
    } catch (error) {
        console.error('Error rejecting investor:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


///////////////////////////////
// ❌ PATCH: Reject Agency
///////////////////////////////
router.patch('/agency/reject/:id', async(req, res) => {
    try {
        const agency = await Admin.findById(req.params.id);
        if (!agency) return res.status(404).json({ message: 'Agency not found' });

        agency.verifiedProof = false;
        await agency.save();

        await sendEmail(
            agency.email,
            'Agency Rejected',
            `<p>Hello ${agency.agencyName},</p><p>We're sorry to inform you that your agency legal proof has been <strong>rejected</strong>, You have to recreate your account again with new legal proof.</p>`
        );

        res.status(200).json({ message: 'Agency rejected and email sent' });
    } catch (error) {
        console.error('Error rejecting agency:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

router.post("/admin/verify-proof/:userType/:id", async(req, res) => {
    const { userType, id } = req.params;

    try {
        let user;
        if (userType === 'agency') {
            user = await Admin.findById(id);
        } else if (userType === 'investor') {
            user = await Investor.findById(id);
        } else {
            return res.status(400).json({ success: false, message: "Invalid user type" });
        }

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.verifiedProof = true;
        await user.save();

        if (userType === 'agency') {
            await transporter.sendMail({

                from: `"AqarLink" <${process.env.EMAIL_USERNAME}>`,
                to: user.email,
                subject: "Your agency legal proof has been verified",

                html: `
          <p>Hello ${user.agencyName}</p>
          <p>Your submitted proof has been reviewed and verified by our team.</p>
          <p>You now have to continue your registration with pay your subscription and registration fees.</p>
        `
            });
            return res.status(200).json({ success: true, message: "Proof verified and email sent" }); // ✅ ADD THIS
        } else {
            await transporter.sendMail({

                from: `"AqarLink" <${process.env.EMAIL_USERNAME}>`,
                to: user.email,
                subject: "Your investment legal proof has been verified",

                html: `
          <p>Hello ${user.firstName || user.adminFirstName},</p>
          <p>Your submitted proof has been reviewed and verified by our team.</p>
          <p>You now have to continue your registration with pay your subscription and registration fees.</p>
        `
            });

            res.status(200).json({ success: true, message: "Proof verified and email sent" });

        }
    } catch (err) {
        console.error("Proof verification error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Account creation
dbReady.then(() => {
    router.post("/estateAgency/create-account", upload.single("image"), async(req, res) => {
        try {
            const {
                agencyName,
                adminFirstName,
                adminLastName,
                agencyAddress,

                email,
                phone,
                password
            } = req.body;

            const image = req.file;

            if (!agencyName || !agencyAddress || !adminFirstName || !adminLastName || !email || !phone || !password || !image) {
                return res.status(400).json({ success: false, message: "All fields are required" });
            }

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email address"
                });
            }

            const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?#&])[A-Za-z\d@$!%*?#&]{8,}$/;

            if (!strongPasswordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
                });
            }

            const existing = await Admin.findOne({ email: email.toLowerCase() });
            if (existing) {
                return res.status(400).json({ success: false, message: "This email is already registered", });
            }

            const { fileId, filename } = await uploadToGridFS(image.buffer, image.originalname);

            const saltRounds = Number(process.env.SALT) || 10;
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            const verificationToken = crypto.randomBytes(32).toString('hex');
            const verificationTokenExpires = new Date(Date.now() + 3600000);

            const newAdmin = new Admin({
                agencyName,
                agencyAddress,
                adminFirstName,
                adminLastName,
                // username,
                email: email.toLowerCase(),
                phone,
                password, // 🔥 Just pass the raw password
                image: filename,
                proofFileId: fileId,
                isVerified: false,
                verifiedProof: false,
                verificationToken,
                verificationTokenExpires,
                properties: []
            });

            await newAdmin.save(); // 🔥 This triggers pre('save') and hashes password

            const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

            await transporter.sendMail({
                to: newAdmin.email,
                subject: "Verify your account",
                html: `
            <p>Hello ${newAdmin.adminFirstName},</p>
            <p>Please verify your email by clicking the link below:</p>
            <a href="${verificationLink}" target="_blank">${verificationLink}</a>
            <p>This link will expire in 1 hour.</p>
          `
            });

            return res.status(201).json({
                success: true,
                message: "Account created. Please check your email to verify your account."
            });

        } catch (error) {
            console.error("Account creation error:", error);
            return res.status(500).json({ success: false, message: "Server error" });
        }
    });
});




// LOGIN FOR ESTATE AGENCY ADMIN
router.post('/estateAgency/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required"
            });
        }

        const lowerCaseEmail = email.toLowerCase();
        console.log(`Login attempt for email: ${lowerCaseEmail}`);

        const admin = await Admin.findOne({ email: lowerCaseEmail });

        if (!admin) {
            console.log("Admin not found in database");
            //             return res.status(401).json({
            //                 // success: false,
            //                 // message: "Invalid email or password"
            //  });

            return res.status(401).json({ success: false, message: "Invalid credentials" });

        }

        if (!admin.isVerified) {
            console.log("Login blocked - account not verified");
            return res.status(403).json({
                success: false,
                message: "Account not verified. Please check your email for verification link."
            });
        }


        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            console.log("Password mismatch for estate admin login");
            return res.status(401).json({
                success: false,
                message: "Invalid email or password"
            });
        }

        const token = jwt.sign({
            userId: admin._id,
            email: admin.email,
            role: 'estateAgencyAdmin'
        }, process.env.JWT_SECRET, { expiresIn: '24h' });

        const userResponse = {
            id: admin._id,
            agencyName: admin.agencyName,
            verifiedProof: admin.verifiedProof,
            agencyAddress: admin.agencyAddress,
            adminFirstName: admin.adminFirstName,
            adminLastName: admin.adminLastName,
            // username: admin.username,
            email: admin.email,
            phone: admin.phone,
            isPaid: admin.isPaid,
            subscriptionEndDate: admin.subscriptionEndDate,
            isVerified: admin.isVerified
        };

        console.log(`Successful login for ${admin.email}`);
        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: userResponse
        });

    } catch (error) {
        console.error("Estate admin login error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Login failed"
        });
    }
});


// Estate Agency Admin Logout API
router.post('/estateAgency/logout', async(req, res) => {
    const { agencyAdminId } = req.body;

    if (!agencyAdminId) {
        return res.status(400).json({ success: false, message: "Agency Admin ID is required for logout." });
    }

    try {
        const admin = await Admin.findById(agencyAdminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found." });
        }

        console.log(`Estate Agency Admin with ID ${agencyAdminId} logged out at ${new Date().toISOString()}`);

        // Optional: Invalidate token using blacklist method if implemented

        return res.status(200).json({
            success: true,
            message: "Logout successful",
            admin: {
                id: admin._id,
                email: admin.email
            }
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
});

// === 1. Forgot Password ===
router.post('/estateAgency/forgot-password', async(req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: 'Email is required' });
    try {
        const user = await Admin.findOne({ email: email.toLowerCase() });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hour
        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiration;
        await user.save();
        const resetLink = `${process.env.FRONTEND_URL}/estateAgency/reset-password/${token}`;
        await transporter.sendMail({
            to: user.email,
            subject: 'Reset your password',
            html: `
       <p>Hello ${user.agencyName},</p>
       <p>You requested to reset your password. Click the link below:</p>
       <a href="${resetLink}">${resetLink}</a>
       <p>This link expires in 1 hour.</p>
       `,
        });
        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send reset link' });
    }
});

router.post('/estateAgency/reset-password', async(req, res) => {
    const { password, token } = req.body;
    if (!password || !token) {
        return res.status(400).json({ message: 'Password and token are required' });
    }

    try {
        const user = await Admin.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set plain password, let Mongoose hash it
        user.password = password;

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log('Saved user password:', user.password); // should be hashed (starts with $2a$...)


        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

// Add to your estateAgency router
router.put('/estateAgency/update/:id', async(req, res) => {
    try {
        const admin = await Admin.findById(req.params.id);
        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found.' });
        }

        const updatableFields = ['adminFirstName', 'adminLastName', 'phone', 'agencyName', 'agencyAddress'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                admin[field] = req.body[field];
            }
        });

        await admin.save();

        return res.status(200).json({ success: true, message: "Profile updated successfully." });
    } catch (error) {
        console.error("Update profile error:", error);
        return res.status(500).json({ success: false, message: "Profile update failed." });
    }
});

// GET profile by ID
router.get("/estateAgencyManage/:id", async(req, res) => {
    try {
        const admin = await Admin.findById(req.params.id).select("-password");
        if (!admin) return res.status(404).json({ message: "Admin not found" });
        res.json(admin);
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

router.get('/estateAgency/verify/:token', async(req, res) => {
    const { token } = req.params;
    try {
        const admin = await Admin.findOne({ verificationToken: token });

        if (!admin) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        admin.isVerified = true;
        admin.verificationToken = undefined;
        admin.verificationTokenExpires = undefined;
        await admin.save(); // ✅ This triggers the password hashing middleware if needed

        console.log('Admin verified:', admin.email);

        return res.status(200).json({ message: "Your email has been verified successfully!" });
    } catch (err) {
        console.error("Verification error:", err);
        return res.status(500).json({ error: "Server error during verification." });
    }
});

router.post('/estateAgency/resend-verification', async(req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const admin = await Admin.findOne({ email: email.toLowerCase() });
        if (!admin) {
            return res.status(404).json({ error: "User not found." });
        }

        if (admin.isVerified) {
            return res.status(400).json({ error: "User already verified." });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        admin.verificationToken = verificationToken;
        await admin.save();

        const link = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
        await transporter.sendMail({
            to: admin.email,
            subject: "Resend: Verify your Estate Admin Account",
            html: `
            <p>Your previous link expired. Click to verify:</p>
            <a href="${link}">${link}</a>
          `
        });

        return res.status(200).json({ message: "Verification email resent successfully." });
    } catch (err) {
        console.error("Resend error:", err);
        return res.status(500).json({ error: "Failed to resend verification email." });
    }
});
router.get('/file/view/:id', async(req, res) => {
    await dbReady; // ensure bucket is ready
    try {
        const bucket = getBucket();
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const files = await bucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = files[0];
        res.set('Content-Type', file.contentType || 'application/octet-stream');
        bucket.openDownloadStream(fileId).pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// router.get('/file/download/:id', async(req, res) => {
//     await dbReady;
//     try {
//         const bucket = getBucket();
//         const fileId = new mongoose.Types.ObjectId(req.params.id);
//         const files = await bucket.find({ _id: fileId }).toArray();

//         if (!files || files.length === 0) {
//             return res.status(404).json({ message: 'File not found' });
//         }



//         const file = files[0];
//         const mimeType = file.contentType || 'application/octet-stream';

//         res.set("Content-Type", mimeType);
//         res.set("Content-Disposition", `inline; filename="${file.filename}"`);

//         const downloadStream = bucket.openDownloadStream(fileId);
//         downloadStream.pipe(res);
//     } catch (err) {
//         console.error(err);
//         res.status(500).json({ message: 'Server Error' });
//     }
// });



router.get('/file/download/:id', async(req, res) => {
    await dbReady;
    try {
        const bucket = getBucket();
        const fileId = new mongoose.Types.ObjectId(req.params.id);
        const files = await bucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: 'File not found' });
        }

        const file = files[0];
        const mimeType = file.contentType || 'application/octet-stream';

        res.set("Content-Type", mimeType);

        // 🧠 Force download with correct filename and extension
        res.set("Content-Disposition", `attachment; filename="${file.filename}"`);

        const downloadStream = bucket.openDownloadStream(fileId);
        downloadStream.pipe(res);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server Error' });
    }
});

// Admin logout route
router.post("/admin/logout", (req, res) => {
    res.clearCookie("token"); // Optional if you're using cookies
    res.status(200).json({ success: true, message: "Successfully logged out" });
});


router.get("/imageProperty/:id", async(req, res) => {
    try {
        await dbReady; // ensure DB is connected
        const fileId = new mongoose.Types.ObjectId(req.params.id);

        const bucket = getBucket();
        const files = await bucket.find({ _id: fileId }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ message: "File not found" });
        }

        res.set("Content-Type", files[0].contentType || "application/octet-stream");
        const downloadStream = bucket.openDownloadStream(fileId);
        downloadStream.pipe(res);
    } catch (err) {
        console.error("❌ File download error:", err.message);
        res.status(500).json({ message: "Could not retrieve file" });
    }
});




// ✅ 1. Define the postProperty function
const postProperty = async(req, res) => {
    const { agencyAdminId, description, price, transactionType, propertyType, location, space } = req.body;

    try {
        if (!agencyAdminId || !description || !price || !transactionType || !propertyType || !location || !space) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const admin = await Admin.findById(agencyAdminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found." });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ success: false, message: "At least one image is required." });
        }

        const imageUploads = await Promise.all(
            req.files.map(file => uploadToGridFS(file.buffer, file.originalname))
        );

        const imageMetadata = imageUploads.map(upload => ({
            filename: upload.filename,
            fileId: upload.fileId,
        }));

        const newProperty = {
            description,
            price,
            transactionType,
            propertyType,
            location,
            space,
            images: imageMetadata,
            createdAt: new Date(),
        };

        admin.properties.push(newProperty);
        await admin.save();

        // 🔔 Match property to client preferences
        const clients = await Client.find({ propertyFeature: { $ne: null } });

        const matchingClients = clients.filter(client => {
            const feature = client.propertyFeature;

            // ✅ Log client features being checked
            console.log("Checking client features:", feature);

            const matchesType = feature.type === propertyType;
            const matchesLocation = feature.location.includes(location);
            const withinPriceRange = price >= feature.price.min && price <= feature.price.max;
            const matchesSpace = !feature.space ||
                (typeof feature.space === 'object' ?
                    space >= feature.space.min && space <= feature.space.max :
                    space >= feature.space); // fallback if it's a single number

            return matchesType && matchesLocation && withinPriceRange && matchesSpace;
        });

        // ✅ Log matched client IDs
        console.log("Matched client IDs:", matchingClients.map(c => c._id));

        await Promise.all(
            matchingClients.map((client) =>
                new Notification({
                    clientId: client._id,
                    propertyId: admin.properties[admin.properties.length - 1]._id,
                    title: 'New Property Match',
                    message: `A new ${propertyType} is available in ${location} within your preferred budget.`,
                    read: false,
                }).save()
            )
        );

        return res.status(201).json({ success: true, message: "Property added successfully." });
    } catch (error) {
        console.error("Add property error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
};

// ✅ 2. Use it in your route
router.post("/estateAgency/property", upload.array("images"), postProperty);




router.get("/estateAgency/properties/:adminId", async(req, res) => {
    try {
        const admin = await Admin.findById(req.params.adminId);
        if (!admin) {
            return res.status(404).json({ success: false, message: "Admin not found" });
        }

        return res.status(200).json({ success: true, properties: admin.properties });
    } catch (err) {
        console.error("Fetch properties error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


router.put("/estateAgency/property/:id", upload.array("images"), async(req, res) => {
    const { description, price, transactionType, propertyType, location, space } = req.body;
    const propertyId = req.params.id;

    try {
        if (!description || !price || !transactionType || !propertyType || !location || !space) {
            return res.status(400).json({ success: false, message: "All fields are required." });
        }

        const admin = await Admin.findOne({ "properties._id": propertyId });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Property not found." });
        }

        const property = admin.properties.id(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found in admin." });
        }

        // Handle new images if provided
        let imageMetadata = property.images; // existing images
        if (req.files && req.files.length > 0) {
            const uploadedImages = await Promise.all(
                req.files.map(file => uploadToGridFS(file.buffer, file.originalname))
            );

            const newImages = uploadedImages.map(upload => ({
                filename: upload.filename,
                fileId: upload.fileId,
            }));

            imageMetadata = [...imageMetadata, ...newImages];
        }

        // Update property fields
        property.description = description;
        property.price = price;
        property.transactionType = transactionType;
        property.propertyType = propertyType;
        property.location = location;
        property.space = space;
        property.images = imageMetadata;
        property.updatedAt = new Date();

        await admin.save();

        return res.status(200).json({ success: true, message: "Property updated successfully." });
    } catch (err) {
        console.error("Update property error:", err);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

// DELETE: Property by ID
router.delete("/estateAgency/property/:propertyId", async(req, res) => {
    try {
        const propertyId = req.params.propertyId;

        const admin = await Admin.findOne({ "properties._id": propertyId });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        admin.properties = admin.properties.filter(
            prop => prop._id.toString() !== propertyId
        );

        await admin.save();
        res.status(200).json({ success: true, message: "Property deleted" });
    } catch (err) {
        console.error("Delete error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
});



// Get all properties from all admins, including agency name
router.get("/estateAgency/properties", async(req, res) => {
    try {
        const admins = await Admin.find({}).lean(); // use lean for performance
        const propertiesWithAgency = admins.flatMap((admin) =>
            admin.properties.map((property) => ({
                ...property,
                agencyName: admin.agencyName,
                phone: admin.phone,
            }))
        );

        res.status(200).json({ success: true, properties: propertiesWithAgency });
    } catch (error) {
        console.error("Fetch all properties with agency error:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

router.get("/estateAgency/propertyDetails/:id", async(req, res) => {
    try {
        const propertyId = req.params.id;

        // Step 1: Find the admin who has this property
        const admin = await Admin.findOne({ "properties._id": propertyId });
        if (!admin) {
            return res.status(404).json({ success: false, message: "Property not found" });
        }

        // Step 2: Extract the property using Mongoose's subdocument access
        const property = admin.properties.id(propertyId);
        if (!property) {
            return res.status(404).json({ success: false, message: "Property not found in admin document" });
        }

        // Step 3: Send property with agency name
        res.status(200).json({
            success: true,
            property: {
                ...property.toObject(),
                agencyName: admin.agencyName,
                phone: admin.phone,
            },
        });
    } catch (error) {
        console.error("❌ Error fetching property details:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// File upload setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/properties/');
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});




router.post('/client/create-account', async(req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    if (!firstName || !lastName || !email || !phone || !password) {
        return res.status(400).json({ success: false, message: "All fields are required" });

    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Please enter a valid email address"
        });
    }
    const strongPasswordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#._-])[A-Za-z\d@$!%*?&#._-]{8,}$/;
    if (!strongPasswordRegex.test(password)) {
        return res.status(400).json({
            success: false,
            message: "Password must be at least 8 characters long and include uppercase, lowercase, number, and special character."
        });
    }

    try {
        // const existingUser = await Client.findOne({
        //     $or: [{ email: email.toLowerCase() }, { username }]
        // });

        // if (existingUser) {
        //     return res.status(409).json({
        //         success: false,
        //         message: existingUser.email === email.toLowerCase() ? "Email already in use" : "Username already taken"
        //     });
        // }


        const existing = await Client.findOne({ email: email.toLowerCase() });
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "This email is already registered",
            });
        }

        const verificationToken = crypto.randomBytes(32).toString('hex');
        const newUser = new Client({
            firstName,
            lastName,
            email: email.toLowerCase(),
            phone,
            password,
            verificationToken,
            verificationTokenExpires: new Date(Date.now() + 3600000),
            isVerified: false,
            businesses: [] // Ensure it's initialized
        });

        await newUser.save();

        const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

        await transporter.sendMail({
            to: newUser.email,
            subject: "Verify your account",
            html: `
                <p>Hello ${newUser.firstName},</p>
                <p>Please verify your email by clicking the link below:</p>
                <a href="${verificationLink}" target="_blank">${verificationLink}</a>
                <p>This link will expire in 1 hour.</p>
            `
        });

        res.status(201).json({
            success: true,
            message: "Account created. Please check your email to verify your account.",
            user: {
                id: newUser._id,
                email: newUser.email,

            }
        });
    } catch (error) {
        console.error("Account creation error:", error);
        res.status(500).json({ success: false, message: "Account creation failed" });
    }
});

router.post('/client/login', async(req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    try {
        const user = await Client.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid credentials" });
        }

        if (!user.isVerified) {
            return res.status(403).json({ success: false, message: "Account not verified. Please check your email." });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ success: false, message: "Invalid email or password" });
        }

        const token = jwt.sign({ userId: user._id, email: user.email, role: 'client' },
            process.env.JWT_SECRET, { expiresIn: '24h' }
        );

        const userResponse = {
            id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,

            phone: user.phone,
            isVerified: user.isVerified
        };

        res.status(200).json({ success: true, message: "Login successful", token, user: userResponse });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ success: false, message: "Login failed" });
    }
});


// routes/client.js or wherever your router is
router.post('/client/logout', async(req, res) => {
    const { clientId } = req.body;

    if (!clientId) {
        return res.status(400).json({ success: false, message: "Client ID is required for logout." });
    }

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found." });
        }

        console.log(`Client with ID ${clientId} logged out at ${new Date().toISOString()}`);

        // Optionally: invalidate token by blacklisting or other method here

        return res.status(200).json({
            success: true,
            message: "Logout successful",
            client: {
                id: client._id,
                email: client.email
            }
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
});



// === 1. Forgot Password ===
router.post('/client/forgot-password', async(req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await Client.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiration;

        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/client/reset-password/${token}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Reset your password',
            html: `
          <p>Hello ${user.firstName},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link expires in 1 hour.</p>
        `,
        });

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send reset link' });
    }
});



router.post('/client/reset-password', async(req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
        return res.status(400).json({ message: 'Password and token are required' });
    }

    try {
        const user = await Client.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set plain password, let Mongoose hash it
        user.password = password;

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log('Saved user password:', user.password); // should be hashed (starts with $2a$...)


        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

router.put('/client/update/:id', async(req, res) => {
    const { id } = req.params;
    const updates = req.body;

    if (!updates) return res.status(400).json({ success: false, message: "No data to update." });

    try {
        const user = await Client.findById(id);
        if (!user) return res.status(404).json({ success: false, message: "Client not found" });

        if (updates.email) user.email = updates.email.toLowerCase();
        if (updates.phone) user.phone = updates.phone;
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(updates.password, salt);
        }

        await user.save();
        res.json({ success: true, message: "Profile updated successfully" });
    } catch (err) {
        console.error("Update error:", err);
        res.status(500).json({ success: false, message: "Failed to update client profile" });
    }
});

// Get client profile by ID
router.get('/clientManage/:id', async(req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findById(id).select('-password');
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        res.status(200).json({ success: true, client });
    } catch (error) {
        console.error('Error fetching client data:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

router.post('/client/property', async(req, res) => {
    const { type, location, price, rooms, space, clientId } = req.body;

    // if (!type || !Array.isArray(location) || !price ? .min || !price ? .max || !space ? .min || !space ? .max || !clientId) {
    //     return res.status(400).json({ success: false, message: 'Missing required fields.' });
    // }
    if (!type ||
        !Array.isArray(location) ||
        !price || price.min == null || price.max == null ||
        !space || space.min == null || space.max == null ||
        !clientId
    ) {
        return res.status(400).json({ success: false, message: 'Missing required fields.' });
    }


    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found.' });
        }



        client.propertyFeature = {
            type,
            location,
            price,
            rooms,
            space,
            clientId
        };

        await client.save();
        return res.status(201).json({ success: true, message: 'Property features added successfully.' });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ success: false, message: 'Server error while adding property features.' });
    }
});


// GET property features for a client
router.get('/client/property/:clientId', async(req, res) => {
    console.log('Request received for clientId:', req.params.clientId); // Log the clientId
    try {
        const client = await Client.findById(req.params.clientId);
        if (!client || !client.propertyFeature) {
            return res.status(404).json({ success: false, message: "Property features not found" });
        }
        res.status(200).json({ success: true, property: client.propertyFeature });
    } catch (err) {
        console.error("Error getting property:", err);
        res.status(500).json({ success: false, message: "Error getting property features" });
    }
});


// DELETE property features
router.delete('/client/property', async(req, res) => {
    const { clientId } = req.body;

    if (!clientId) {
        return res.status(400).json({ success: false, message: "Client ID is required" });
    }

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        // client.propertyFeatures = undefined;

        client.propertyFeature = undefined;

        await client.save();

        res.status(200).json({ success: true, message: "Property features deleted" });
    } catch (err) {
        console.error("Error deleting property:", err);
        res.status(500).json({ success: false, message: "Error deleting property features" });
    }
});
// PUT update property features for a client
router.put('/client/property/:clientId', async(req, res) => {
    const { type, location, price, rooms, space } = req.body;

    // Check for required fields
    if (!type || !location || !price || !space) {
        return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    try {
        const client = await Client.findById(req.params.clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: "Client not found" });
        }

        // Assign the propertyFeature with required clientId
        client.propertyFeature = {
            clientId: client._id, // 🔥 ADD THIS to satisfy validation
            type,
            location,
            price,
            rooms,
            space
        };

        await client.save();

        res.status(200).json({
            success: true,
            message: "Property features updated",
            property: client.propertyFeature
        });
    } catch (err) {
        console.error("Error updating property features:", err);
        res.status(500).json({ success: false, message: "Error updating property features" });
    }
});
// ✅ Get notifications for a client
router.get('/client/notifications/:clientId', async(req, res) => {
    try {
        const { clientId } = req.params;
        console.log("📨 Fetching notifications for:", clientId);

        const notifications = await Notification.find({ clientId }).sort({ createdAt: -1 });

        res.status(200).json({ success: true, notifications });
    } catch (error) {
        console.error("❌ Error fetching notifications:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// ✅ Mark notification as read
router.patch('/client/notifications/:notificationId/read', async(req, res) => {
    try {
        const { notificationId } = req.params;
        console.log("📘 Marking as read:", notificationId);

        const notification = await Notification.findByIdAndUpdate(
            notificationId, { read: true }, { new: true }
        );

        if (!notification) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, notification });
    } catch (error) {
        console.error("❌ Error marking notification as read:", error);
        res.status(500).json({ success: false, message: 'Error marking as read' });
    }
});

// ✅ Delete notification
router.delete('/client/notifications/:notificationId', async(req, res) => {
    try {
        const { notificationId } = req.params;
        console.log("🗑️ Deleting notification:", notificationId);

        const deleted = await Notification.findByIdAndDelete(notificationId);

        if (!deleted) {
            return res.status(404).json({ success: false, message: "Notification not found" });
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        console.error("❌ Error deleting notification:", error);
        res.status(500).json({ success: false, message: 'Error deleting notification' });
    }
});

router.get('/client/verify/:token', async(req, res) => {
    const { token } = req.params;
    try {
        const client = await Client.findOne({ verificationToken: token });

        if (!client || client.verificationTokenExpires < new Date()) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        client.isVerified = true;
        client.verificationToken = undefined;
        client.verificationTokenExpires = undefined;
        await client.save();

        console.log('Client verified:', client.email);
        return res.status(200).json({ message: "Your email has been verified successfully!" });
    } catch (err) {
        console.error("Client verification error:", err);
        return res.status(500).json({ error: "Server error during verification." });
    }
});


router.post('/client/resend-verification', async(req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ error: "Email is required." });

    try {
        const user = await Client.findOne({ email: email.toLowerCase() });

        if (!user) return res.status(404).json({ error: "User not found." });
        if (user.isVerified) return res.status(400).json({ error: "User already verified." });

        const verificationToken = crypto.randomBytes(32).toString("hex");
        user.verificationToken = verificationToken;
        user.verificationTokenExpires = new Date(Date.now() + 3600000);
        await user.save();


        const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;


        await transporter.sendMail({
            to: user.email,
            subject: "Resend: Verify your account",
            html: `<p>Your previous link expired. Click to verify:</p><a href="${verificationLink}">${verificationLink}</a>`
        });

        res.status(200).json({ message: "Verification email resent successfully." });
    } catch (err) {
        console.error("Resend error:", err);
        res.status(500).json({ error: "Failed to resend verification email." });
    }
});



router.post('/client/business', upload.single("businessPlan"), async(req, res) => {
    const {
        clientId, // ensure that this is passed
        businessName,
        industry,
        years,
        employees,
        revenue,
        propertyType,
        propertyLocation,
        size,
        budgetMin,
        budgetMax,
        purpose,
        investmentAmount,
        returnModel,
        returnDetails,
        investmentDuration,
        fullName,
        email,
        phone
    } = req.body;

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        let businessPlanFile = null;
        if (req.file) {
            const { fileId, filename } = await uploadToGridFS(req.file.buffer, req.file.originalname);
            businessPlanFile = { fileId, filename };
        }

        // Ensure that clientId is included in the business object
        const newBusiness = {
            clientId: clientId, // Make sure clientId is added here
            businessName,
            industry,
            years,
            employees,
            revenue,
            propertyType,
            propertyLocation,
            size,
            budgetMin,
            budgetMax,
            purpose,
            investmentAmount,
            returnModel,
            returnDetails,
            investmentDuration,
            businessPlan: businessPlanFile,
            fullName,
            email,
            phone
        };

        client.businesses.push(newBusiness); // Add the new business to the client's businesses array
        await client.save();

        res.status(200).json({ success: true, message: 'Business info added', client });
    } catch (error) {
        console.error('Error saving business:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});






router.put('/client/business/:id', upload.single("businessPlan"), async(req, res) => {
    const { id } = req.params;

    try {
        const client = await Client.findOne({ "businesses._id": id });
        if (!client) return res.status(404).json({ success: false, message: "Business not found" });

        const business = client.businesses.id(id);
        if (!business) return res.status(404).json({ success: false, message: "Business not found" });

        Object.assign(business, req.body);
        if (req.file) business.businessPlan = req.file.filename;

        await client.save();

        res.json({ success: true, updatedBusiness: business });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Failed to update business" });
    }
});


router.get('/client/business-plan/:clientId/:businessId', async(req, res) => {
    const { clientId, businessId } = req.params;

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ message: 'Client not found' });
        }

        const business = client.businesses.id(businessId);
        if (!business || !business.businessPlan || !business.businessPlan.fileId) {
            return res.status(404).json({ message: 'Business plan not found' });
        }

        const bucket = getBucket();
        const fileId = new mongoose.Types.ObjectId(business.businessPlan.fileId);

        const files = await bucket.find({ _id: fileId }).toArray();
        if (!files || files.length === 0) {
            return res.status(404).json({ message: "File not found in GridFS" });
        }

        const file = files[0];
        const mimeType = file.contentType || 'application/octet-stream';

        res.set("Content-Type", mimeType);
        res.set("Content-Disposition", `inline; filename="${file.filename}"`);

        const downloadStream = bucket.openDownloadStream(fileId);
        downloadStream.pipe(res);

    } catch (err) {
        console.error("❌ Error retrieving business plan:", err.message);
        res.status(500).json({ message: "Could not retrieve business plan" });
    }
});


router.get('/client/businesses/:clientId', async(req, res) => {

    const { clientId } = req.params;

    try {
        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

        res.status(200).json({ success: true, businesses: client.businesses });
    } catch (error) {
        console.error('Error fetching businesses:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// DELETE one business by ID from client
router.delete('/client/business/:businessId', async(req, res) => {
    const { businessId } = req.params;

    try {
        const client = await Client.findOneAndUpdate({ 'businesses._id': businessId }, { $pull: { businesses: { _id: businessId } } }, { new: true });

        if (!client) {
            return res.status(404).json({ success: false, message: "Business not found" });
        }

        res.json({ success: true, message: "Business deleted", client });
    } catch (err) {
        console.error("Failed to delete business:", err);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
});

router.get("/client/businesses", async(req, res) => {
    try {
        const clients = await Client.find({}).lean();

        const businessesWithInfo = clients.flatMap((client) =>
            Array.isArray(client.businesses) ?
            client.businesses.map((business) => ({
                businessName: business.businessName,
                industry: business.industry,
                revenue: business.revenue,
                years: business.years,
                employees: business.employees,
                propertyType: business.propertyType,
                propertyLocation: business.propertyLocation,
                size: business.size,
                budgetMin: business.budgetMin,
                budgetMax: business.budgetMax,
                purpose: business.purpose,
                investmentAmount: business.investmentAmount,
                returnModel: business.returnModel,
                returnDetails: business.returnDetails,
                investmentDuration: business.investmentDuration,
                contact: business.phone,
                clientName: `${client.firstName} ${client.lastName}`,
                clientEmail: client.email,
            })) : []
        );

        res.status(200).json({ success: true, businesses: businessesWithInfo });
    } catch (error) {
        console.error("❌ Fetch all businesses error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
});


// Save a property
router.post('/client/save-property', async(req, res) => {
    const { clientId, propertyId } = req.body;

    if (!clientId || !propertyId) {
        return res.status(400).json({ success: false, message: 'Client ID and Property ID are required' });
    }

    try {
        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

        if (!client.savedProperties.includes(propertyId)) {
            client.savedProperties.push(propertyId);
            await client.save();
        }

        res.status(200).json({ success: true, message: 'Property saved successfully' });
    } catch (error) {
        console.error('Error saving property:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// Unsave a property
router.post('/client/unsave-property', async(req, res) => {
    const { clientId, propertyId } = req.body;

    if (!clientId || !propertyId) {
        return res.status(400).json({ success: false, message: 'Client ID and Property ID are required' });
    }

    try {
        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

        client.savedProperties = client.savedProperties.filter(id => id.toString() !== propertyId);
        await client.save();

        res.status(200).json({ success: true, message: 'Property unsaved successfully' });
    } catch (error) {
        console.error('Error unsaving property:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});
// Check if a property is saved by a client
router.get('/client/check-saved-property', async(req, res) => {
    const { clientId, propertyId } = req.query;

    if (!clientId || !propertyId) {
        return res.status(400).json({ success: false, message: 'Client ID and Property ID are required' });
    }

    try {
        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ success: false, message: 'Client not found' });

        const isSaved = client.savedProperties.includes(propertyId);
        res.status(200).json({ success: true, isSaved });
    } catch (error) {
        console.error('Error checking saved property:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

router.get('/client/saved-properties/:clientId', async(req, res) => {
    const { clientId } = req.params;

    try {
        const client = await Client.findById(clientId);
        if (!client) {
            return res.status(404).json({ success: false, message: 'Client not found' });
        }

        const savedPropertyIds = client.savedProperties.map(id => id.toString());

        // Fetch all Admins with their properties
        const allAdmins = await Admin.find({}, 'properties');

        const matchedProperties = [];

        // Loop through each admin and match properties
        for (const admin of allAdmins) {
            for (const property of admin.properties) {
                if (savedPropertyIds.includes(property._id.toString())) {
                    matchedProperties.push(property);
                }
            }
        }

        res.status(200).json({ success: true, savedProperties: matchedProperties });

    } catch (error) {
        console.error('Error fetching saved properties:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

// // Account creation
// dbReady.then(() => {
//     router.post("/investor/create-account", upload.single("image"), async(req, res) => {
//         try {
//             const {
//                 firstName,
//                 lastName,
//                 email,
//                 phone,
//                 password
//             } = req.body;

//             const image = req.file;

//             // if (!firstName || !lastName || !email || !phone || !password || !image) {
//             //     return res.status(400).json({ success: false, message: "All fields are required" });
//             // }
//             if (!firstName || !lastName || !email || !phone || !password) {
//                 return res.status(400).json({ success: false, message: "All fields are required except legal proof" });
//             }

//             const existing = await Investor.findOne({ email: email.toLowerCase() });
//             if (existing) {
//                 return res.status(400).json({ success: false, message: "Email already exists" });
//             }

//             // const { fileId, filename } = await uploadToGridFS(image.buffer, image.originalname);

//             let fileId = null;
//             let filename = null;

//             if (image) {
//                 const uploaded = await uploadToGridFS(image.buffer, image.originalname);
//                 fileId = uploaded.fileId;
//                 filename = uploaded.filename;
//             }
// image: filename || null,
// proofFileId: fileId || null,


//             const saltRounds = Number(process.env.SALT) || 10;
//             const hashedPassword = await bcrypt.hash(password, saltRounds);

//             const verificationToken = crypto.randomBytes(32).toString('hex');
//             const verificationTokenExpires = new Date(Date.now() + 3600000);

//             const newInvestor = new Investor({

//                 firstName,
//                 lastName,
//                 email: email.toLowerCase(),
//                 phone,
//                 password, // 🔥 Just pass the raw password
//                 image: filename,
//                 proofFileId: fileId,
//                 verifiedProof: false,

//                 isVerified: false,
//                 verificationToken,
//                 verificationTokenExpires,

//             });

//             await newInvestor.save(); // 🔥 This triggers pre('save') and hashes password

//             const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

//             await transporter.sendMail({
//                 to: newInvestor.email,
//                 subject: "Verify your account",
//                 html: `
//             <p>Hello ${newInvestor.firstName},</p>
//             <p>Please verify your email by clicking the link below:</p>
//             <a href="${verificationLink}" target="_blank">${verificationLink}</a>
//             <p>This link will expire in 1 hour.</p>
//           `
//             });

//             return res.status(201).json({
//                 success: true,
//                 message: "Account created. Please check your email to verify your account."
//             });

//         } catch (error) {
//             console.error("Account creation error:", error);
//             return res.status(500).json({ success: false, message: "Server error" });
//         }
//     });
// });


// const strongPasswordRegex =
//     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;
// Account creation
dbReady.then(() => {
    router.post("/investor/create-account", upload.single("image"), async(req, res) => {
        try {
            const { firstName, lastName, email, phone, password } = req.body;
            const image = req.file;

            if (!firstName || !lastName || !email || !phone || !password) {
                return res.status(400).json({
                    success: false,
                    message: "All fields are required except legal proof",
                });

            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: "Please enter a valid email address"
                });
            }
            const strongPasswordRegex =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]).{8,}$/;

            if (!strongPasswordRegex.test(password)) {
                return res.status(400).json({
                    success: false,
                    message: "Password must be at least 8 characters and include uppercase, lowercase, number, and special character.",
                });
            }


            const existing = await Investor.findOne({ email: email.toLowerCase() });
            if (existing) {
                return res.status(400).json({
                    success: false,
                    message: "This email is already registered",

                });
            }

            let fileId = null;
            let filename = null;

            if (image) {
                const uploaded = await uploadToGridFS(image.buffer, image.originalname);
                fileId = uploaded.fileId;
                filename = uploaded.filename;
            }

            const verificationToken = crypto.randomBytes(32).toString("hex");
            const verificationTokenExpires = new Date(Date.now() + 3600000); // 1 hour

            const newInvestor = new Investor({
                firstName,
                lastName,
                email: email.toLowerCase(),
                phone,
                password, // 🔥 Will be hashed in pre('save')
                image: filename || null,
                proofFileId: fileId || null,
                verifiedProof: false,
                isVerified: false,
                verificationToken,
                verificationTokenExpires,
            });

            await newInvestor.save(); // Assumes hashing is handled in pre('save') middleware

            const verificationLink = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;

            await transporter.sendMail({
                to: newInvestor.email,
                subject: "Verify your account",
                html: `
          <p>Hello ${newInvestor.firstName},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}" target="_blank">${verificationLink}</a>
          <p>This link will expire in 1 hour.</p>
        `,
            });

            return res.status(201).json({
                success: true,
                message: "Account created. Please check your email to verify your account.",
            });

        } catch (error) {
            console.error("Account creation error:", error);
            return res.status(500).json({
                success: false,
                message: "Server error",
            });
        }
    });
});


// Investor login API
router.post('/investor/login', async(req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        const investor = await Investor.findOne({ email: email.toLowerCase() });

        if (!investor) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        if (!investor.isVerified) {
            return res.status(401).json({ success: false, message: "Please verify your email before logging in." });
        }

        const isMatch = await bcrypt.compare(password, investor.password);
        if (!isMatch) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        const token = jwt.sign({ investorId: investor._id, role: "investor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // Send the token and user data back
        return res.status(200).json({
            success: true,
            token,
            user: {
                id: investor._id,
                firstName: investor.firstName,
                lastName: investor.lastName,
                email: investor.email,
                phone: investor.phone,
                image: investor.image
            }
        });



    } catch (err) {
        console.error("Investor login error:", err);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});

// === 1. Forgot Password ===
router.post('/investor/forgot-password', async(req, res) => {
    const { email } = req.body;

    if (!email) return res.status(400).json({ message: 'Email is required' });

    try {
        const user = await Investor.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiration = Date.now() + 3600000; // 1 hour

        user.resetPasswordToken = token;
        user.resetPasswordExpires = expiration;

        await user.save();

        const resetLink = `${process.env.FRONTEND_URL}/investor/reset-password/${token}`;

        await transporter.sendMail({
            to: user.email,
            subject: 'Reset your password',
            html: `
          <p>Hello ${user.firstName} ${user.firstLast},</p>
          <p>You requested to reset your password. Click the link below:</p>
          <a href="${resetLink}">${resetLink}</a>
          <p>This link expires in 1 hour.</p>
        `,
        });

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to send reset link' });
    }
});



router.post('/investor/reset-password', async(req, res) => {
    const { password, token } = req.body;

    if (!password || !token) {
        return res.status(400).json({ message: 'Password and token are required' });
    }

    try {
        const user = await Investor.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token' });
        }

        // Set plain password, let Mongoose hash it
        user.password = password;

        // Clear token fields
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined;

        await user.save();
        console.log('Saved user password:', user.password); // should be hashed (starts with $2a$...)


        res.status(200).json({ message: 'Password has been reset successfully.' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error resetting password' });
    }
});

// // Investor logout API
// router.post('/investor/logout', async(req, res) => {
//     const { investorId } = req.body;

//     if (!investorId) {
//         return res.status(400).json({ success: false, message: "Investor ID is required for logout." });
//     }

//     try {
//         const investor = await Investor.findById(investorId);
//         if (!investor) {
//             return res.status(404).json({ success: false, message: "Investor not found." });
//         }

//         console.log(`Investor with ID ${investorId} logged out at ${new Date().toISOString()}`);

//         // Optional: You can invalidate the token by blacklisting or other methods

//         return res.status(200).json({
//             success: true,
//             message: "Logout successful",
//             investor: {
//                 id: investor._id,
//                 email: investor.email
//             }
//         });
//     } catch (error) {
//         console.error("Logout error:", error);
//         return res.status(500).json({ success: false, message: "Logout failed" });
//     }
// });
router.post('/investor/logout', async(req, res) => {
    const { investorId } = req.body;

    if (!investorId) {
        return res.status(400).json({ success: false, message: "Investor ID is required for logout." });
    }
    try {
        const investor = await Investor.findById(investorId);
        if (!investor) {
            return res.status(404).json({ success: false, message: "Investor not found." });
        }
        console.log(`Investor with ID ${investorId} logged out at ${new Date().toISOString()}`);
        return res.status(200).json({
            success: true,
            message: "Logout successful",
            investor: {
                id: investor._id,
                email: investor.email
            }
        });
    } catch (error) {
        console.error("Logout error:", error);
        return res.status(500).json({ success: false, message: "Logout failed" });
    }
});
// Update investor profile
router.put('/investor/update/:id', async(req, res) => {
    try {
        const investor = await Investor.findById(req.params.id);
        if (!investor) {
            return res.status(404).json({ success: false, message: 'Investor not found.' });
        }

        const updatableFields = ['firstName', 'lastName', 'phone', 'investmentInterests', 'location'];
        updatableFields.forEach(field => {
            if (req.body[field] !== undefined) {
                investor[field] = req.body[field];
            }
        });

        await investor.save();

        return res.status(200).json({ success: true, message: "Investor profile updated successfully." });
    } catch (error) {
        console.error("Investor profile update error:", error);
        return res.status(500).json({ success: false, message: "Investor profile update failed." });
    }
});
// Get investor profile by ID (excluding password)
router.get("/investorManage/:id", async(req, res) => {
    try {
        const investor = await Investor.findById(req.params.id).select("-password");
        if (!investor) {
            return res.status(404).json({ success: false, message: "Investor not found." });
        }

        return res.status(200).json({ success: true, investor });
    } catch (error) {
        console.error("Get investor error:", error);
        return res.status(500).json({ success: false, message: "Server error." });
    }
});

router.get('/investor/verify/:token', async(req, res) => {
    const { token } = req.params;
    try {
        const investor = await Investor.findOne({ verificationToken: token });

        if (!investor) {
            return res.status(400).json({ error: "Invalid or expired token." });
        }

        investor.isVerified = true;
        investor.verificationToken = undefined;
        investor.verificationTokenExpires = undefined;
        await investor.save(); // ✅ This triggers the password hashing middleware if needed

        console.log('Investor verified:', investor.email);

        return res.status(200).json({ message: "Your email has been verified successfully!" });
    } catch (err) {
        console.error("Verification error:", err);
        return res.status(500).json({ error: "Server error during verification." });
    }
});

router.post('/investor/resend-verification', async(req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ error: "Email is required." });
    }

    try {
        const investor = await Investor.findOne({ email: email.toLowerCase() });
        if (!investor) {
            return res.status(404).json({ error: "User not found." });
        }

        if (investor.isVerified) {
            return res.status(400).json({ error: "User already verified." });
        }

        // Generate new verification token
        const verificationToken = crypto.randomBytes(32).toString("hex");
        investor.verificationToken = verificationToken;
        await investor.save();

        const link = `${process.env.FRONTEND_URL}/verify/${verificationToken}`;
        await transporter.sendMail({
            to: investor.email,
            subject: "Resend: Verify your Investor Account",
            html: `
            <p>Your previous link expired. Click to verify:</p>
            <a href="${link}">${link}</a>
          `
        });

        return res.status(200).json({ message: "Verification email resent successfully." });
    } catch (err) {
        console.error("Resend error:", err);
        return res.status(500).json({ error: "Failed to resend verification email." });
    }
});



// router.get("/file/:id", async(req, res) => {
//     try {
//         const conn = await mongoose.createConnection(process.env.MONGO_ATLAS_URI_INVESTOR, {
//             useNewUrlParser: true,
//             useUnifiedTopology: true,
//         });

//         const bucket = new GridFSBucket(conn.db, {
//             bucketName: "uploads",
//         });


//         const fileId = new mongoose.Types.ObjectId(req.params.id);
//         bucket.openDownloadStream(fileId).pipe(res);
//     } catch (err) {
//         console.error("File download error:", err);
//         res.status(500).json({ message: "Could not retrieve file" });
//     }
// });






router.get("/admin/all-agencies", async(req, res) => {
    try {
        const agencies = await Admin.find()
            .select("agencyName adminFirstName adminLastName email phone isVerified proofFileId verifiedProof isPaid subscriptionEndDate")
            .lean();

        const formattedAgencies = agencies.map(agency => ({
            _id: agency._id,
            agencyName: agency.agencyName,
            adminFirstName: agency.adminFirstName,
            adminLastName: agency.adminLastName,
            email: agency.email,
            phone: agency.phone,
            isVerified: agency.isVerified,
            proofFileId: agency.proofFileId,
            verifiedProof: agency.verifiedProof,

            isPaid: agency.isPaid,
            subscriptionEndDate: agency.subscriptionEndDate,
        }));

        res.status(200).json({ success: true, agencies: formattedAgencies });
    } catch (error) {
        console.error("Error fetching agencies:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Get all Investors (with necessary fields, including proofFileId)
router.get("/admin/all-investors", async(req, res) => {
    try {
        const investors = await Investor.find()
            .select("firstName lastName email phone isVerified proofFileId verifiedProof isPaid subscriptionEndDate")
            .lean();

        const formattedInvestors = investors.map(investor => ({
            _id: investor._id,
            firstName: investor.firstName,
            lastName: investor.lastName,
            email: investor.email,
            phone: investor.phone,
            isVerified: investor.isVerified,
            proofFileId: investor.proofFileId,
            verifiedProof: investor.verifiedProof,

            isPaid: investor.isPaid,
            subscriptionEndDate: investor.subscriptionEndDate,
        }));

        res.status(200).json({ success: true, investors: formattedInvestors });
    } catch (error) {
        console.error("Error fetching investors:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});
router.get("/admin/all-clients", async(req, res) => {
    try {
        const clients = await Client.find()
            .select("firstName lastName email phone isVerified")
            .lean();

        const formattedClients = clients.map(client => ({
            _id: client._id,
            firstName: client.firstName,
            lastName: client.lastName,
            email: client.email,
            phone: client.phone,
            isVerified: client.isVerified,
        }));

        res.status(200).json({ success: true, clients: formattedClients });
    } catch (error) {
        console.error("Error fetching clients:", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// DELETE Investor
router.delete("/admin/delete-investor/:id", async(req, res) => {
    try {
        const investor = await Investor.findByIdAndDelete(req.params.id);
        if (!investor) return res.status(404).json({ message: "Investor not found" });
        res.status(200).json({ message: "Investor deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// DELETE Agency
router.delete("/admin/delete-agency/:id", async(req, res) => {
    try {
        const agency = await Admin.findByIdAndDelete(req.params.id);
        if (!agency) return res.status(404).json({ message: "Agency not found" });
        res.status(200).json({ message: "Agency deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});

// DELETE Client
router.delete("/admin/delete-client/:id", async(req, res) => {
    try {
        const client = await Client.findByIdAndDelete(req.params.id);
        if (!client) return res.status(404).json({ message: "Client not found" });
        res.status(200).json({ message: "Client deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
});


module.exports = router;