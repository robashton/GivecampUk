var express = require('express');
var security = require('./security');

var url = config(DB_CONFIG_FILE);
var utils = require('./utils');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);
var dbapi = require('./db');

exports.init = function(app) {

  app.configure(function(){
    app.use(express.bodyParser());
    app.use(express.static(__dirname + '/site'));
  });

  app.post('/login', function(req, res){
    security.signInUser(req, res, req.body.username, req.body.password, function(result,session_id) {
      if(!result){
          res.json({ success: false}, {}, 401); 
        }
        else
        { 
          res.json({success: true, session: session_id},{},200);
        }
    });
    
  });

  app.get('/get_questions_by_tag/:tag', function(req, res) {
        if(req.params.tag === null)
        { 
            res.json({error: "Tag cannot be null" });   
        }
        else
          dbapi.get_questions_by_tag(req.params.tag, function(err, doc) {
            res.send(err, doc);
          });
  });

  app.post('/answer', function(req, res){
    dbapi.save_answer(req.body.question_id, req.body.answer_text, req.body.rank, function(doc){
      res.send(doc);
      }); 
  });

  app.post('/promote_user', function(req, res){

    db.get(req.body.userId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.isElevated = true;
        db.save(doc, function(err, doc){
          res.send(err, doc);
        });
      }
    });  
  });

  app.post('/demote_user', function(req, res){

    db.get(req.body.userId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.isElevated = false;
        db.save(doc, function(err, doc){
          res.send(err, doc);
        });
      }
    });  
  });

  app.post('/increment_answer_rank', function(req, res){

    db.get(req.body.answerId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.rank++;
        db.save(doc, function(err, doc){
          res.send(err, doc);
        });
      }
    });  
  });

  app.post('/decrement_answer_rank', function(req, res){

    db.get(req.body.answerId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.rank--;
        db.save(doc, function(err, doc){
          res.send(err, doc);
        });
      }
    });  
  });

  app.post('/set_accepted_answer', function(req, res){

    db.get(req.body.answerId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.isAcceptedAnswer = true;
        db.save(doc, function(err, doc){
          res.send(err, doc);
        });
      }
    });  
  });
  
  app.post('/reset_accepted_answer', function(req, res){

    db.get(req.body.answerId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.isAcceptedAnswer = false;
        db.save(doc, function(err, doc){
          res.send(err, doc);
        });
      }
    });  
  });

  app.post('/delete_answer', function(req, res){

    // TODO: test that the curret user has elevated permissions
    var currentUserIsElevated = true;
    if(currentUserIsElevated)
    {
        db.remove(req.body.answerId, function(err, doc){
          res.send(err, doc);        
        });
    }
  });

  app.get('/register', function(req, res){
    dbapi.create_user()
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
          tags: doc.tags
        });
    });    
  }); 

  app.post('/createquestion', function(req, res) {
    
      if(!expect(req, res, {
        title: "There must be a title",
        description: "There must be a description",
        tag: "There must be a selected tag"
      })) return;

      var userid = security.currentUser();     

      db.save(
      {
        _id: utils.generateGuid(),
        type:"question",
        user:userid, 
        date:new Date(),
        deleted:0,
        title: req.body.title, 
        description: req.body.description,
        tag: req.body.tag
        }, 
       function ( err, doc) {
          res.json({
            err: err,
            doc: doc
          });
       });    
  }); 

  app.get('/question/:id', function(req, res) {
    var questionId = req.params.id;
    var question, answers;

    db.get(questionId, function(err, doc) {
      if(err) {    
        res.json({error: err});      
      }
      else {
          question = doc;
          dbapi.get_question_answers(questionId, function(err, doc) {
            if(err) {
                res.json({error: err});    
            }
            else {
              answers = doc;
              res.json({
                question: question,
                answers: answers
              });
            }
          });       
      }
    });


  });

  app.get('/service', security.validateUser, function(req, res){
      db.get("creationix", function (doc) {
        res.send('hello world: ' + doc);
      })

});

  expect = function(req, res, keys) {
    for(i in keys) {
      var value = req.body[i];
      if(!value) { 
        res.json({ error: keys[i]});
        return false;
      }
    }
    return true;
  }
};
