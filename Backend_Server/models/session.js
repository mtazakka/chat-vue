const { Schema, model } = require('mongoose')

const sessionSchema = new Schema({
    sessionID: String,
    userID: String,
    username: String,
    connected: Boolean,
});

module.exports = model('Session', sessionSchema);
