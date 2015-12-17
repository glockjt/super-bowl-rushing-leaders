var express = require('express'),
    bodyParser = require('body-parser'),
    api = require('./api');

var app = express();

app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());

app.get('/api/getRushingLeaders', function (req, res) {
    api.getStatistics().then(function(data) {
        res.json(data);
    });
});

app.get('*', function (req, res) {
    res.sendFile(__dirname + '/public/index.html');
});

app.listen(3000);
console.log('Listening on port 3000');