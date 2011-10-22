var express = require('express');
db = require('./db');
var security = require('./security');

exports.init = function(app) {

  app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/site'));
  });

  app.post('/login', function(req, res){
    console.log(req.body.loginUser)
    security.signInUser(req, res, "Tim.Caswell@gmail.com", req.body.loginPass, function(result) {
      console.log(result)
      if(!result){
          res.json({ success: false}, {}, 401); 
        }
        else
        { 
          var cookies = new Cookies( req, res );
          cookies.set( "username", email, { httpOnly: false } );
          res.json({success: true},{},200);
        }
    });
    
  });
  
  app.get('/register', function(req, res){
    db.create_user()
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
      })
  });

};
