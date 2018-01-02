const express = require('express');
const mongoose = require('mongoose');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const Chat = require('./database/model');

server.listen(8000);

//connect to the MongoDB
mongoose.connect('mongodb://127.0.0.1/chatdb', (err)=>{
    if(err) {
        console.log(err);
        // As we are unable to connect, exit.
        process.exit(2);
    }
    else {
        console.log('connection successful');
    }
});

// if we get a connection then listen to that event.
io.sockets.on('connection', (socket)=>{

    //try to get the data here so that when someone loads the page newly, that user will get
    //latest 20 messages
    let query = Chat.find({});
    query.sort('-createdAt').limit(20).exec((err, docs)=>{
        if (err) {
            console.log("Error receiving messages, error is: " + err);
        }
        //send old messages to HTML
        socket.emit('oldMessages', docs);
    });

    //catch the message that was sent through the HTML's socket.io
    socket.on('sendMessage', (data)=>{

        //save the message that we get from the HTML's form
        let newMessage = new Chat({msg:data});
        newMessage.save((err)=>{
            if (err) {
                console.log(('Unable to save message, reason is: ' + err));
            }
            else {
                // send this message back to everyone that a user sent using "sendMessage" event
                io.sockets.emit('newMessage', data);
            }
        });
        // io.sockets.emit('newMessage', data);
    });
});

// make the default route and serve the main index.html
app.get('/', function (request, response) {
   response.sendFile(__dirname + '/public/index.html');
});

