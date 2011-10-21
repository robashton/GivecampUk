http = require('http'),  
path = require('path'),
fs = require('fs');
paperboy = require('paperboy');

ROOT = path.dirname(__filename) + "/site";

server = http.createServer(function(req, res){ 
	  paperboy
	  .deliver(ROOT, req, res)
	  .addHeader('Cache-Control', 'no-cache')
	  .otherwise(function(){
    
        if(req.url.indexOf("/services") == 0) {
			   	  res.writeHead(200, "Content-Type: text/plain");
			      res.write("Services will be found here");
			      
			      var CouchClient = require('couch-client');
            var db = CouchClient("http://localhost:5984/youngmindsdb");
			      
            db.save({_id: "creationix", name: "Tim Caswell", age: 28}, function ( err, doc) {
              // You know know if there was an error and have an updated version
              // of the document (with `_id` and `_rev`).
            });


            db.get("creationix", function (err, doc) {
              // Now you have the document or error if there was trouble
              res.write(JSON.stringify(doc))
              res.end();	
            });
			      
			     
		    } else {
			    res.writeHead(404, "Content-Type: text/plain");
			    res.write("Not found and all that");
			    res.end();
        }
	  });

});
server.listen(8081);

console.log("Listening on port 8081");

