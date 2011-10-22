config = require('./config')
encryption = require('./encryption');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);

exports.get_user = function (email, callback) {
  db.view('/youngmindsdb/_design/users/_view/by_email', {key: email}, function(err, doc) {
      // Now you have the document(s) or error if there was trouble
      console.log(doc)
      callback(doc)
  });
}

exports.create_user = function () {
  encryption.hash("password", function(hash){
    db.save({questionId: req.param('qId')})
    
    db.save({_id: "test", name: "Tim Caswell", age: 28, email: "Tim.Caswell@gmail.com", password: hash, type: "user"}, function ( err, doc) {
      // You know know if there was an error and have an updated version
      // of the document (with `_id` and `_rev`).
    });
  })
};

exports.save_answer = function(question_id, answer_text) {
  db.save({_id:getGuid(),
      type:"answer", 
      questionId: question_id, 
      userId: security.getUser(), 
      answer: answer_text, 
      rank:0,
      deleted:0,
      date:new Date()
      }, function(err, doc) {
        // TODO: error handling
      });
};
