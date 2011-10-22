var bcrypt = require('bcrypt');
var seed = 10;

exports.hash = function(text, callback){
bcrypt.gen_salt(seed, function(err, salt) {
  bcrypt.encrypt(text, salt, function(err, crypted) {
    callback(crypted);
  });
})
};

exports.compare = function(text,hash){
bcrypt.gen_salt(seed, function(err, salt) {
    bcrypt.compare(text, hash, function(err, res) {
      return true;
    });
  });
  return false;
};
