http = require('http'),  
path = require('path'),

fs = require('fs'),
startup = require('./startup');

DB_CONFIG_FILE = "config/db.json"

ENV = startup.get_env()
startup.check_config_exists(DB_CONFIG_FILE)

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

app.configure(function(){
  app.use(express.static(__dirname + '/site'));
});

app.get('/login', function(req, res){
   var cookies = new Cookies( req, res );
   cookies.set( "username", "Emma", { httpOnly: false } );
   res.json({ success: true}, {}, 200);  
});

app.get('/currentuser', function(req, res) {
  if(!validateUser(req,res)) return;
  res.json({ username: 'Emma'}, {}, 200);
});

app.get('/service', function(req, res){
    db.get_document("creationix", function (doc) {
      res.send('hello world: ' + doc);
    });
});

var app = express.createServer();
require('./services').init(app);
app.listen(8081);

console.log("Listening on port 8081");

