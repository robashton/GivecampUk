http = require('http'),  
path = require('path'),
fs = require('fs');
paperboy = require('paperboy');
db = require('./db');

ROOT = path.dirname(__filename) + "/site";

DB_CONFIG_FILE = "config/db.json"

if(process.argv.length == 3)
  ENV = process.argv[(4 - 2)] // WTF.
else
  ENV = "development"
  
path.exists(DB_CONFIG_FILE, function (exists) {
  if(!exists) {
    console.error("DB file is missing. Please set config file at: " + DB_CONFIG_FILE)
    process.exit(1)
  }
});

server = http.createServer(function(req, res){ 
	  paperboy
	  .deliver(ROOT, req, res)
	  .addHeader('Cache-Control', 'no-cache')
	  .otherwise(function(){
	    
        if(req.url.indexOf("/services") == 0) {
			   	  res.writeHead(200, "Content-Type: text/plain");
			      res.write("Services will be found here");
			      
            db.get_document("creationix", function (doc) {
              // Now you have the document or error if there was trouble
              res.write(doc)
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

