'use strict';


const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const _ = require('lodash');

app.use('/game', express.static('./src'));

app.get('/', (req, res) => {
    res.json({'hello': 'world'});
});

let rooms = [];

io.on('connection', (socket) => {
    console.log('User connected with id', socket.id);

    socket.on('queryRooms', function() {
        console.log('queryRooms')
        socket.emit('getRooms', rooms);
    });

    socket.on('createRoom', function(username) {
        rooms.push({
            id: socket.id,
            username: username,
            members: [username]
        });

        socket.join(username);
    });

    socket.on('joinRoom', function(roomName) {
        let room = _.find(rooms, (room) => {
            return room.username == roomName
        });

        if (room) {
            room.members = socket.id;
            socket.join(room.username);
            socket.to(room.username).emit('gameStarted');
            socket.emit('gameStarted');
        }
    });

    socket.on('positionUpdate', function(position) {
        //socket.to(room.username).emit('positionUpdated', position);
    });

    socket.on('gameShouldEnd', function(point) {
        //io.sockets.adapter.rooms[socket.id].emit('gameEnded', point);
    })
});

server.listen(3000);
