config = require('./config')

exports.get_document = function (id, callback) {
  var url = config('db')
  var CouchClient = require('couch-client');
  var db = CouchClient(url);
  
  db.save({_id: id, name: "Tim Caswell", age: 28}, function ( err, doc) {
    // You know know if there was an error and have an updated version
    // of the document (with `_id` and `_rev`).
  });


  db.get(id, function (err, doc) {
    // Now you have the document or error if there was trouble
    callback(JSON.stringify(doc))
  });
}
