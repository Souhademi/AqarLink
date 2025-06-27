const express = require("express");
const router = express.Router();
const { ChargilyClient } = require('@chargily/chargily-pay');
const Invoice = require("../models/Invoice");




// POST /api/payment/agency-invoice
router.post("/agency-invoice", async(req, res) => {
    const { email, phoneNumber, subscriptionPlan, postLimit } = req.body;

    const amountMap = {
        monthly: 4000,
        trimesterly: 10000,
        yearly: 40000,
    };

    const amount = amountMap[subscriptionPlan];

    if (!email || !phoneNumber || !subscriptionPlan || !amount || !postLimit) {
        return res.status(400).json({ message: "Missing required fields" });
    }

    try {
        if (process.env.CHARGILY_API_KEY) {
            const chargily = new ChargilyClient({
                api_key: process.env.CHARGILY_API_KEY,
                mode: "EDAHABIA", // or "CIB"
            });
            const success_url = `${process.env.FRONTEND_URL}/payment-success`;
            const failure_url = `${process.env.FRONTEND_URL}/payment-failure`;

            const invoice = await chargily.createInvoice({
                amount,
                client: email,
                client_email: email,
                client_phone: phoneNumber,
                mode: "EDAHABIA",
                success_url,
                failure_url,
            });

            // Save invoice to DB
            await Invoice.create({
                email,
                phoneNumber,
                subscriptionPlan,
                amount,
                postLimit,
                status: "pending",
                createdAt: new Date(),
                invoiceToken: invoice.invoice.token, // save for tracking
            });

            return res.status(200).json({ redirectUrl: invoice.checkout_url });
        } else {
            // fallback test
            const redirectUrl = `https://baridimob.fakepay.dz/pay?amount=${amount}&email=${email}&plan=${subscriptionPlan}`;
            return res.status(200).json({ redirectUrl });
        }
    } catch (error) {
        console.error("Payment invoice error:", error.message || error);
        return res.status(500).json({ message: "Error while creating the invoice." });
    }
});

// POST /api/payment/webhook
router.post("/webhook", express.raw({ type: "application/json" }), async(req, res) => {
    const signature = req.headers["x-signature"];
    const secret = process.env.CHARGILY_WEBHOOK_SECRET;

    const payload = req.body;
    const payloadString = JSON.stringify(payload);

    const expectedSignature = crypto
        .createHmac("sha256", secret)
        .update(payloadString)
        .digest("hex");

    if (signature !== expectedSignature) {
        return res.status(401).send("Invalid signature");
    }

    const { invoice_token, status } = payload;

    try {
        const invoice = await Invoice.findOne({ invoiceToken: invoice_token });

        if (invoice) {
            invoice.status = status === "paid" ? "paid" : "failed";
            await invoice.save();
            res.status(200).send("Invoice updated");
        } else {
            res.status(404).send("Invoice not found");
        }
    } catch (err) {
        console.error("Webhook error:", err.message);
        res.status(500).send("Server error");
    }
});

// POST /api/payment/invoice
router.post("/investor-invoice", async(req, res) => {
    const { email, phoneNumber, subscriptionPlan, postLimit } = req.body;

    const amountMap = {
        monthly: 5000,
        trimesterly: 13000,
        yearly: 50000,
    };


    const amount = amountMap[subscriptionPlan];

    if (!email || !phoneNumber || !subscriptionPlan || !amount || !postLimit) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        if (process.env.CHARGILY_API_KEY) {
            // Use real Chargily integration
            const chargily = new ChargilyClient({
                api_key: process.env.CHARGILY_API_KEY,
                mode: "EDAHABIA", // Change to "CIB" if needed
            });

            const redirectUrl = await chargily.createInvoice({
                amount,
                client: email,
                client_email: email,
                client_phone: phoneNumber,
                mode: "EDAHABIA",
                success_url: "http://localhost:3000/payment-success",
                failure_url: "http://localhost:3000/payment-failure",
            });

            return res.status(200).json({ redirectUrl });
        } else {
            // Fallback simulation logic
            const redirectUrl = `https://baridimob.fakepay.dz/pay?amount=${amount}&email=${email}&plan=${subscriptionPlan}`;
            return res.status(200).json({ redirectUrl });
        }
    } catch (error) {
        console.error("Payment invoice error:", error.message || error);
        return res.status(500).json({ message: "Error while creating the invoice." });
    }
});

module.exports = router;