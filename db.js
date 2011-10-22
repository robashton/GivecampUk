config = require('./config')
encryption = require('./encryption');
utils = require('./utils');
security = require('./security');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);

exports.save_answer = function(question_id, answer_text, rank, callback) {
  db.save({_id:utils.generateGuid(),
      type:"answer", 
      questionId: question_id, 
      userId: "adsda",//security.currentUser(), 
      answer: answer_text, 
      rank: rank,
      date:new Date()
      }, function(err, doc) {
        // TODO: error handling
        callback(doc);
      });
}

exports.get_user = function (email, callback) {
  db.view('/youngmindsdb/_design/users/_view/by_email', {key: email}, function(err, doc) {
      // Now you have the document(s) or error if there was trouble
      callback(doc)
  });
};

exports.get_question_answers = function(questionId, callback) {
    db.view('/youngmindsdb/_design/answers/_view/by_questionid', {key: questionId}, function(err, doc) {
      callback(err, doc)
  });
};

exports.get_questions_by_tag = function(questionTag, callback) {
    db.view('/youngmindsdb/_design/questions/_view/by_tag', {key: questionTag}, function(err, doc) {
      callback(doc)
  });
};

exports.get_questions = function(callback) {
    db.view('/youngmindsdb/_design/questions/_view/by_tag', {key: ""}, function(err, doc) {
      callback(doc)
  });
};

exports.create_session = function (id,name, callback) {
    var guid =  utils.generateGuid();
    db.save({session: guid, name: name, type: "session"}, function ( err, doc) {
      callback(guid);
    });
  }

exports.create_user = function () {
  encryption.hash("password", function(hash){
    db.save({questionId: req.param('qId')})
    
    db.save({_id: "test", name: "Tim Caswell", age: 28, email: "Tim.Caswell@gmail.com", password: hash, type: "user", isElevated: false}, function ( err, doc) {
      // You know know if there was an error and have an updated version
      // of the document (with `_id` and `_rev`).
    });
  })
};
