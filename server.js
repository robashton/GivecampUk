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
			  res.writeHead(404, "Content-Type: text/plain");
			  res.write("Not found and all that");
			  res.end();		
	  });

});
server.listen(8081);

console.log("Listening on port 8081");

