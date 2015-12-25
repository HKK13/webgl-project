'use strict';


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/game', express.static('./src'));

app.get('/', (req, res) => {
    res.json({'hello': 'world'});
});

let rooms = [
    {'id': 5, 'username': 'ahmet'}
];

io.on('connection', (socket) => {
    console.log('User connected with id', socket.id);

    socket.on('queryRooms', function() {
        console.log('queryRooms')
        socket.emit('getRooms', rooms);
    });
});

server.listen(3000);
