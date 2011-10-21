// Telephone support: 07939 012 139

http = require('http'),  
path = require('path'),
fs = require('fs');

var express = require('express');
var app = express.createServer();

app.get('/', express.static(__dirname + '/site'));

app.get('/service', function(req, res){
  res.send('hello world');
});

app.listen(8081);

console.log("Listening on port 8081");

