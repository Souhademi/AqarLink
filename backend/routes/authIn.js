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
        if (!admin) { return res.status(404).json({ success: false, message: "Agency Admin not found." }); }
        console.log(`Estate Agency Admin with ID ${agencyAdminId} logged out at ${new Date().toISOString()}`);
        return res.status(200).json({
            success: true,
            message: "Logout successful",
            admin: { id: admin._id, email: admin.email }
        });
    } catch (error) { console.error("Logout error:", error); return res.status(500).json({ success: false, message: "Logout failed" }); }
});
// Investor logout API
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