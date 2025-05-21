const express = require('express');
const router = express.Router();

const faqData = [{
        keywords: ["platform", "site", "application", "what is this"],
        answer: "This platform connects clients, agencies, and investors in the real estate market. You can buy, rent, exchange, or invest in properties."
    },
    {
        keywords: ["who can use", "users", "access", "who can access"],
        answer: "Clients (buyers, renters, exchangers, and those seeking investors), real estate agencies, and property investors can use this platform."
    },
    {
        keywords: ["create account", "sign up", "register", "registration", "signing up"],
        answer: "Click on 'Sign Up' and choose your user type (Client, Agency, or Investor). Fill in the required details and complete registration."
    },
    {
        keywords: ["client", "buyer", "renter", "exchange", "investor request"],
        answer: "Clients can be buyers, renters, exchangers, or those seeking investors. You can use filters to find suitable properties."
    },
    {
        keywords: ["agency", "agencies", "register agency", "agency fee"],
        answer: "Agencies register with name, email, password, and phone number. They must also pay a registration and subscription fee."
    },
    {
        keywords: ["investor", "invest", "how to invest", "investor account"],
        answer: "Investors register with an email, password, and phone or Google login. They must pay fees to view client investment requests."
    },
    {
        keywords: ["password", "forgot", "reset"],
        answer: "Click on 'Forgot Password?' on the login page to reset your password."
    },
    {
        keywords: ["payment", "subscription", "baridi mob", "pricing"],
        answer: "We support Baridi Mob for secure payments. Currently, there's no free trial for agencies and investors."
    },
    {
        keywords: ["dashboard", "not loading", "bug", "technical issue"],
        answer: "Please refresh the page or check your internet connection. If the issue persists, contact our support team."
    },
    {
        keywords: ["contact client", "how to contact client", "client contact", "speak to client"],
        answer: "You have to see the contact of the client on the offer."
    },
    {
        keywords: ["contact agency", "how to contact agency", "agency contact", "reach agency"],
        answer: "When you choose a property, you can see the contact of the agency."
    }
];

router.get('/faq', (req, res) => {
    res.json(faqData);
});

module.exports = {
    faqRoutes: router,
    faqData
};