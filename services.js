var express = require('express');
db = require('./db');
var security = require('./security');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);

exports.init = function(app) {

  app.configure(function(){
    app.use(express.static(__dirname + '/site'));
      app.use(express.bodyParser());
  });

  app.post('/login', function(req, res){
    security.signInUser(req, res, req.body.username, req.body.password);
  });

  app.get('/logout', function(req, res){
    security.signOutUser(req, res);
    res.json({ success: true}, {}, 200);  
  });

  app.get('/currentuser', security.validateUser, function(req, res) {
    res.json({ username: 'Emma'}, {}, 200);
  });

  app.get('/createquestion', function(req, res) {
    db.get("tagList", function(err, doc) {
      if(err) 
         res.json({error: err});
      else
        res.json({ 
          error: null,
          tags: doc.Tags
        });
    });    
  }); 

};
