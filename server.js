http = require('http'),  
path = require('path'),

fs = require('fs'),
startup = require('./startup');

DB_CONFIG_FILE = "config/db.json"

ENV = startup.get_env()
startup.check_config_exists(DB_CONFIG_FILE)

var express = require('express');
var app = express.createServer();
require('./services').init(app);
app.listen(8081);

console.log("Listening on port 8081");

