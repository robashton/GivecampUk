config = require('./config')
encryption = require('./encryption');

var url = config(DB_CONFIG_FILE)
var CouchClient = require('couch-client');
var db = CouchClient(url);

exports.get_user = function (email, callback) {
db.view('/youngmindsdb/_design/users/_view/by_email', {key: email}, function(err, doc) {
    // Now you have the document(s) or error if there was trouble
    callback(doc)
});
}

exports.get_document = function (id, callback) {
  encryption.hash("password",function(hash){

  db.save({_id: id, name: "Tim Caswell", age: 28,email: "Tim.Caswell@gmail.com",password: hash, type: "user"}, function ( err, doc) {
    // You know know if there was an error and have an updated version
    // of the document (with `_id` and `_rev`).
  });
});


  db.get(id, function (err, doc) {
    // Now you have the document or error if there was trouble
    callback(JSON.stringify(doc))
  });
}

