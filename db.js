exports.x = function (callback) {
  var CouchClient = require('couch-client');
  var db = CouchClient("http://localhost:5984/youngmindsdb");
  
  db.save({_id: "creationix", name: "Tim Caswell", age: 28}, function ( err, doc) {
    // You know know if there was an error and have an updated version
    // of the document (with `_id` and `_rev`).
  });


  db.get("creationix", function (err, doc) {
    // Now you have the document or error if there was trouble
    callback(JSON.stringify(doc))
  });
}
