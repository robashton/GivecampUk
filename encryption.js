var bcrypt = require('bcrypt');
var seed = 10;

exports.hash = function(text, callback){
bcrypt.gen_salt(seed, function(err, salt) {
  bcrypt.encrypt(text, salt, function(err, crypted) {
    callback(crypted, salt);
  });
})
};

exports.compare = function(text,hash,salt, callback){
  bcrypt.encrypt(text, salt, function(err, crypted) {
    callback(crypted === hash);
})

};
