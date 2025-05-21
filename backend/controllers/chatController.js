const Message = require("./models/Message");

exports.saveMessage = async(req, res) => {
    try {
        const newMsg = new Message(req.body);
        await newMsg.save();
        res.status(200).send("Message enregistré.");
    } catch (err) {
        res.status(500).send("Erreur serveur");
    }
};