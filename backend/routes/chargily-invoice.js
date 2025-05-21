const express = require("express");
const router = express.Router();
const { ChargilyClient } = require('@chargily/chargily-pay');

// POST /api/payment/invoice
router.post("/agency-invoice", async(req, res) => {
    const { email, phoneNumber, subscriptionPlan, postLimit } = req.body;

    const amountMap = {
        monthly: 4000,
        trimesterly: 10000,
        yearly: 40000,
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