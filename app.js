var express = require('express');
var compression = require('compression');
var path = require('path');
var cors = require('cors');
var router = express.Router();

var app = express();

app.use('/src', express.static(path.join(__dirname, '/src')));

app.enable('trust proxy');

app.use(compression());

app.get('*', function(req, res) {
    res.header('Cache-Control', "max-age=60, must-revalidate, private");
    res.sendFile( path.join(__dirname, 'index.html') );
});


var server = app.listen(process.env.PORT || 5000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log(`ESRI ARCGIS-JS-API 4.4 Example app listening at http://%s:%s`, host, port);
});