// models/connections.js
const mongoose = require("mongoose");

const estateAgencyAdminDb = mongoose.createConnection(process.env.MONGO_ATLAS_URI_AGENCY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const clientDb = mongoose.createConnection(process.env.MONGO_ATLAS_URI_CLIENT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

module.exports = { estateAgencyAdminDb, clientDb };