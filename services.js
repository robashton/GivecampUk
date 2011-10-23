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
    app.use(express.cookieParser());
    app.use(express.static(__dirname + '/site'));
  });

  app.post('/login', function(req, res){
    security.signInUser(req, res, req.body.email, req.body.password, function(result,reason) {
      if(!result){
          res.json({ success: false, reason: reason}, {}, 401); 
        }
        else
        { 
          res.json({success: true},{},200);
        }
    });    
  });

  app.get('/get_questions_by_rank',security.validateUser,function(req,res){
    dbapi.get_questions_by_rank(function(err, doc){
      res.json(err,doc);
    })  
  });

  app.get('/get_popular_tags',security.validateUser, function(req, res) {
      dbapi.get_popular_tags(function(err, docs) {
        res.json({err: err, rows: docs.rows});
      });
  });

  app.get('/get_all_users', security.validateElevatedUser, function(req,res){
    dbapi.get_all_users(function(err, doc){
       res.json({ err: err, doc: doc});
    });
  });

  app.get('/get_questions_by_tag/:tag?',security.validateUser, function(req, res) {
      if(!req.params.tag || req.params.tag == "All")
        dbapi.get_questions(function(err, doc) {
          res.json({ err: err, doc: doc});
        });
      else
        dbapi.get_questions_by_tag(req.params.tag, function(err, doc) {
          res.json({ err: err, doc: doc});
        });
  });

  app.post('/answer',security.validateUser, function(req, res){
    if(!expect(req, res, {
      question_id: "There must be a question id!",
      answer_text: "There must be answer text"
    })) return;
    
    dbapi.save_answer(req, res, req.body.question_id, req.body.answer_text, function(doc){
        res.json(doc);
      }); 

    dbapi.update_answer_count_for_question(req.body.question_id); 
  });

  app.post('/promote_user', security.validateElevatedUser,  function(req, res){

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

  app.post('/remove_user',security.validateElevatedUser,  function(req, res){

    db.get(req.body.userId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        db.remove(doc, function(err, doc){
          res.json({ err: err, doc: doc});
        });
      }
    });  
  });


  app.post('/demote_user',security.validateElevatedUser,  function(req, res){

    db.get(req.body.userId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.isElevated = false;
        db.save(doc, function(err, doc){
          res.json({ err: err, doc: doc});
        });
      }
    });  
  });
  app.post('/removeTag',security.validateElevatedUser,  function(req, res){
       db.get("tagList", function(err, doc) {
        if(err) 
           res.json({error: err});
        else
          {
             for (i in doc.tags) {
                  var value = doc.tags[i].tagName;
                  if(value === req.body.idtoremove)
                  {
                    doc.tags.splice(i, 1);
                  }
                }          
          db.save(doc, function(err, doc){
              res.json({ err: err, doc: doc});
        });
          }
      });    
    });
  app.post('/increment_answer_rank',security.validateElevatedUser, function(req, res){

    security.getCurrentUser(req, res, function(user) {
      db.get(req.body.answerId, function(err, doc) {
        if(err) 
          res.json({error: err});
        else
        {
          doc.rank++;
          doc.upvotes.push(user._id);
          db.save(doc, function(err, doc){
          res.json({ err: err, doc: doc});
          });
        }
      }
    );  
  });
  });

  app.post('/decrement_answer_rank',security.validateElevatedUser, function(req, res){

    security.getCurrentUser(req, res, function(user) {
    db.get(req.body.answerId, function(err, doc) {
      if(err) 
         res.json({error: err});
      else
      {
        doc.rank--;
        doc.downvotes.push(user._id);
        db.save(doc, function(err, doc){
          res.send({ err: err, doc: doc});
        });
      }
    });  
    });  
  });

  app.post('/set_accepted_answer',security.validateElevatedUser,  function(req, res){

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
  
  app.post('/reset_accepted_answer',security.validateElevatedUser,  function(req, res){

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

  app.post('/delete_answer', security.validateElevatedUser,  function(req, res){
      db.remove(req.body.answerId, function(err, doc){
        res.send({ err: err, doc: doc});        
      });
  });

  app.post('/register', function(req, res){
    dbapi.get_user(req.body.email, function(err, userDoc){
      if(err == undefined && userDoc.rows.length > 0){
         res.json({ success: false, error: 'Email address ' + req.body.email + ' already registered.'}, {}, 200);  
      }else{
         dbapi.create_user(req.body.email,req.body.name,req.body.password);
         security.setCookieForUser(req, res, req.body.email);
         res.json({ success: true}, {}, 200);  
      }
    });
  });

  app.get('/logout', security.validateUser,  function(req, res){
    security.signOutUser(req, res);
    res.json({ success: true}, {}, 200);  
  });

  app.get('/currentuser', security.validateUser, function(req, res) {
    security.getCurrentUser(req, res, function(user) {
      res.json({
         isElevated: user.isElevated,
         displayName: user.name      
      }, {}, 200);
    });
  });
  
  app.get('/createquestion', security.validateUser, function(req, res) {
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

  app.get('/updateTags', security.validateElevatedUser,  function(req, res) {
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

  app.post('/updateTags',security.validateElevatedUser,  function(req, res) {

      db.save(
      {
        _id: "tagList",
        type:"tags",
        tags:req.body.tagList
        }, 
       function ( err, doc) {
          res.json({
            err: err,
            doc: doc
          });
       });    
  });  

  app.post('/createquestion',security.validateUser,  function(req, res) {
    
      if(!expect(req, res, {
        title: "There must be a title",
        description: "There must be a description",
        tag: "There must be a selected tag"
      })) return;
     
      security.getCurrentUser(req, res, function(user ){
          db.save(
          {
            _id: utils.generateGuid(),
            type:"question",
            user: user._id, 
            displayname: user.name,
            date:new Date(),
            deleted:0,
            title: req.body.title, 
            description: req.body.description,
            tag: req.body.tag
            }, 
           function ( err, doc) {

              dbapi.update_answer_count_for_question(doc._id); 

              res.json({
                err: err,
                doc: doc
              });
           });
      })
  }); 

  app.get('/question/:id',security.validateUser,  function(req, res) {
    var questionId = req.params.id;
    var question, answers;

      security.getCurrentUser(req, res, function(user ){
    db.get(questionId, function(err, doc) {
      if(err) {    
        res.json({error: err});      
      }
      else {
          question = doc;
          delete question.user;
          dbapi.update_answer_count_for_question(doc._id);
          dbapi.get_question_answers(questionId, function(err, doc) {
            if(err) {
                res.json({error: err});    
            }
            else {
              answers = doc;
              /*for(i =0; i<answers.length; i++){
                delete answers[i].upvotes;
                delete answers[i].downvotes;
              }*/
              res.json({
                question: question,
                answers: answers
              });
            }
          });       
      }
    });
    });

  });

  expect = function(req, res, keys) {
   for (i in keys) {
      var value = req.body[i];
      if(!value) { 
        res.json({ error: keys[i]});
        return false;
      }
    }
    return true;
  }

}
