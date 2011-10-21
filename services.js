var express = require('express');
db = require('./db');
var security = require('./security');

exports.init = function(app) {

  app.configure(function(){
      app.use(express.bodyParser());
  });

  app.configure(function(){
    app.use(express.static(__dirname + '/site'));
  });

  app.get('/login', function(req, res){
    security.signInUser(req, res, req.body.username, req.body.password);
    res.json({ success: true}, {}, 200);  
  });

  app.get('/logout', function(req, res){
    security.signOutUser(req, res);
    res.json({ success: true}, {}, 200);  
  });

  app.get('/currentuser', security.validateUser, function(req, res) {
    res.json({ username: 'Emma'}, {}, 200);
  });

  app.get('/service', security.validateUser, function(req, res){
      db.get_document("creationix", function (doc) {
        res.send('hello world: ' + doc);
      });
  });



  

};
