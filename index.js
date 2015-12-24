const express = require('express');
const app = express();

app.use('/game', express.static('./src'));

app.get('/', (req, res) => {
    res.json({'hello': 'world'});
});

var server = app.listen(3000, () => {
    console.log('Listening at port', server.address().port);
});
