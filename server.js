// Telephone support: 07939 012 139

http = require('http'),  
path = require('path'),
fs = require('fs'),
db = require('./db'),
startup = require('./startup');

DB_CONFIG_FILE = "config/db.json"

ENV = startup.get_env()
startup.check_config_exists(DB_CONFIG_FILE)

var express = require('express');
var app = express.createServer();

app.get('/', express.static(__dirname + '/site'));

app.get('/service', function(req, res){
    db.get_document("creationix", function (doc) {
      res.send('hello world: ' + doc);
    });
});

app.listen(8081);

console.log("Listening on port 8081");

