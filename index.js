var path = require('path');
var express = require('express');
var PageFactory = require('./PageFactory');
    
var configs = require('./configs.json');
var app = express();
var port = configs.port;
var hostname = '127.0.0.1';

app.set('view engine', 'jade');
app.set('views', path.resolve(__dirname, 'pages'));

PageFactory(app);

var server = app.listen(port, hostname, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('Listening at http://%s:%s', host, port);
});
