http = require('http'),  
path = require('path'),
fs = require('fs');
paperboy = require('paperboy');
db = require('./db');
startup = require('./startup')

ROOT = path.dirname(__filename) + "/site";

DB_CONFIG_FILE = "config/db.json"

ENV = startup.get_env()
startup.check_config_exists(DB_CONFIG_FILE)

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

