var express = require('express');
db = require('./db');
var security = require('./security');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);


function generateGuid() {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}


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
    res.json({ username: security.currentUser() }, {}, 200);
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

  app.post('/createquestion', function(req, res) {
      if(!expect({
        title: "There must be a title",
        description: "There must be a description",
        tag: "There must be a selected tag"
      })) return;

      var userid = security.currentUser();     

      db.save(
      {
        _id: generateGuid(),
        type:"question",
        user:userid, 
        date:new Date(),
        deleted:0,
        title: req.params.title, 
        description: req.params.description,
        tag: req.params.tag
        }, 
       function ( err, doc) {
          res.json({
            err: err,
            doc: doc
          });
       });      
  }); 

  app.get('/service', security.validateUser, function(req, res){
      db.get_document("creationix", function (doc) {
        res.send('hello world: ' + doc);
      })
  });

  expect = function(req, res, keys) {
    for(i in keys) {
      var value = req.params[i];
      if(!value) { 
        res.json({ error: keys[i]});
        return false;
      }
      return true;

    }
  }
};
