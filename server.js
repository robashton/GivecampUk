// Telephone support: 07939 012 139

http = require('http'),  
path = require('path'),
fs = require('fs');
Cookies = require('cookies');

var express = require('express');
var app = express.createServer();

function validateUser(req, res) {
  var cookies = new Cookies( req, res );
  var username = cookies.get( "username" );

  if(!username) {
   res.json({ success: false}, {}, 401); 
   return false;
  }
  return true;
};

app.get('/', express.static(__dirname + '/site'));

app.get('/login', function(req, res){
   var cookies = new Cookies( req, res );
   cookies.set( "username", "Emma", { httpOnly: false } );
   res.json({ success: true}, {}, 200);  
});

app.get('/currentuser', function(req, res) {
  if(!validateUser(req,res)) return;
  res.json({ username: 'Emma'}, {}, 200);
});

app.listen(8080);

console.log("Listening on port 8083");

