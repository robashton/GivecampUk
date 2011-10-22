http = require('http'),  
path = require('path'),

fs = require('fs'),
startup = require('./startup');

DB_CONFIG_FILE = "config/db.json"

ENV = startup.get_env()
startup.check_config_exists(DB_CONFIG_FILE)

var express = require('express');

var app = express.createServer();

app.get('/login', function(req, res){
  var CouchClient = require('couch-client');
    var qa = new QA(CouchClient('http://localhost:5984/youngmindsdb'));
    qa.createQuestion("qone",1,"Whats my name","Whats my name......",[{tagName:"Tag1"},{tagName:"Tag2"},{tagName:"Tag3"}]);
    console.log("test");
    qa.createAnswer("athree",1,2,"this is my answer");
    res.json({ success: true}, {}, 200);  
   res.json({ success: true}, {}, 200);  
});


  


var QA = function(couchdb) {
  db = couchdb;
  this.createQuestion = function(id, _userId, _title, _description,_tags) {
    db.save(
    {
      _id: id,
      user:_userId, 
      date:new Date(),
      deleted:0,
      title: _title, 
      description: _description,
      tags:_tags
      }, function ( err, doc) {});
  }

  this.createAnswer = function(id, _questionId, _userId,_answer)
  {
    console.log("Here1");
    db.save(
    {
     _id: id,
     questionId : _questionId,
     userId : _userId,
     answer : _answer,
     rank:0,
     deleted:0,
     date:new Date()
    }, function (err, doc) {});
    console.log("here2");
  }
}



//require('./services').init(app);
app.listen(8081);

console.log("Listening on port 8081");
