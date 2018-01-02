const mongoose = require('mongoose');
const chatSchema = require('./schema');

//create the document model for chat messages;
const Chat = mongoose.model('Message', chatSchema);

module.exports = Chat;