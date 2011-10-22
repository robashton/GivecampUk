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
    security.signInUser(req, res, req.body.email, req.body.password, function(result,session_id,name) {
      if(!result){
          res.json({ success: false}, {}, 401); 
        }
        else
        { 
          res.json({success: true, session: session_id, name: name},{},200);
        }
    });    
  });

  app.get('/get_questions_by_rank',function(req,res){
    dbapi.get_questions_by_rank(function(err, doc){
      res.json(err,doc);
    })  
  });

  app.get('/get_popular_tags', function(req, res) {
      dbapi.get_popular_tags(function(err, docs) {
        res.json({err: err, rows: docs.rows});
      });
  });

  app.get('/get_all_users',function(req,res){
    dbapi.get_all_users(function(err, doc){
      res.json(err,doc);
    });
  });

  app.get('/get_questions_by_tag/:tag?', function(req, res) {
      if(!req.params.tag)
        dbapi.get_questions(function(err, doc) {
          res.json({ err: err, doc: doc});
        });
      else
        dbapi.get_questions_by_tag(req.params.tag, function(err, doc) {
          res.json({ err: err, doc: doc});
        });
  });

  app.post('/answer', function(req, res){
    if(!expect(req, res, {
      question_id: "There must be a question id!",
      answer_text: "There must be answer text"
    })) return;
    
    dbapi.save_answer(req.body.question_id, req.body.answer_text, function(doc){
        res.json(doc);
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
          res.json({ err: err, doc: doc});
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
          res.json(err, doc);
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
          res.json({ err: err, doc: doc});
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
          res.send({ err: err, doc: doc});
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
          res.send({ err: err, doc: doc});
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
          res.send({ err: err, doc: doc});        
        });
    }
  });

  app.post('/register', function(req, res){
    dbapi.create_user(req.body.email,req.body.name,req.body.password);
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
    console.log('test')
    db.get("tagList", function(err, doc) {
      console.log(doc)
      if(err) 
         res.json({error: err});
      else
        res.json({ 
          error: null,
          tags: doc.tags
        });
    });    
  }); 

  app.get('/updateTags', function(req, res) {
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

}
