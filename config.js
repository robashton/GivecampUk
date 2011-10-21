(function() {
  var fs;
  fs = require('fs');
  module.exports = function(file_name) {
    return JSON.parse(fs.readFileSync('config/' + file_name + '.json', 'utf8'))[ENV];
  };
}).call(this);