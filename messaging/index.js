const express = require('express');
const { createServer } = require('node:http');
const { join } = require('node:path');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
const io = new Server(server);

app.get('/', (req, res) => {
  res.sendFile(join(__dirname, 'index.html'));
});

io.on('connection', (socket) => {
    console.log('A user connected');

    // Emit 'hello', 'world' to the connected client on connection!
    io.emit('hello', 'WELCOME TO DA CHAT');

    // Listen for 'chat message' from the client
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg); // Broadcast the message to all clients
    });

    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});



server.listen(3000, () => {
  console.log('server running at http://localhost:3000');
});