module.exports = (connection) => {
    const mongoose = require('mongoose');

    const PropertySchema = new mongoose.Schema({
        description: String,
        price: String,
        transactionType: String,
        propertyType: String,
        location: String,
        images: [{
            filename: String,
            fileId: mongoose.Schema.Types.ObjectId,
        }],
    }, { timestamps: true });

    return connection.model('Property', PropertySchema);
};