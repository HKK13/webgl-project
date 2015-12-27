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
            name: username,
            members: [{
                socketId: socket.id
            }]
        });

        socket.join(username);
    });

    socket.on('joinRoom', function(roomName) {
        let room = _.find(rooms, (room) => {
            return room.name == roomName
        });

        if (room) {
            room.members.push({
                socketId: socket.id
            })
            socket.join(room.name);
            socket.to(room.name).emit('gameStarted');
            socket.emit('gameStarted');
        }
    });

    socket.on('positionUpdate', function(position) {
        let roomIndex = _.find(rooms, (room) => {
            return _.contains(room.members, (member) => {
                return member.socketId == socket.id
            });
        });

        //if (roomIndex == -1) return console.error('Not found');

        //console.log(rooms[roomIndex]);
        //socket.to(rooms[roomIndex].name).emit('positionUpdated', position);
    });

    socket.on('gameShouldEnd', function(point) {
        let roomIndex = _.findIndex(rooms, (room) => {
            return _.find(room.members, _.matchesProperty('socketId', socket.id));
        });

        if (roomIndex == -1) return console.error('Not found');

        socket.to(rooms[roomIndex].name).emit('gameEnded', point);
    });

    socket.on('disconnect', function() {
        console.log('User with id', socket.id, 'disconnected');

        let roomIndex = _.findIndex(rooms, (room) => {
            return _.find(room.members, _.matchesProperty('socketId', socket.id));
        });

        if (roomIndex == -1) return;

        delete members[roomIndex];
    });
});

server.listen(3000);
