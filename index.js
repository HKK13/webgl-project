const express = require('express');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);

app.use('/game', express.static('./src'));

app.get('/', (req, res) => {
    res.json({'hello': 'world'});
});
io.on('connection', (socket) => {
    console.log('User connected with id', socket.id);
});

server.listen(3000);
