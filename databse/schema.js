const mongoose = require('mongoose');

//create schema for the chatdb database
const chatSchema = mongoose.Schema({
    msg: String,
    createdAt: {type: Date, default:Date.now}
});

module.exports = chatSchema;