var bcrypt = require('bcrypt');
var seed = 10;

exports.hash = function(text, callback){
//callback(text);
//return;
bcrypt.gen_salt(seed, function(err, salt) {
  bcrypt.encrypt(text, salt, function(err, crypted) {
    callback(crypted);
  });
})
};

exports.compare = function(text,hash,callback){
//return text === hash;
console.log("text: " + text);
console.log("hash: " + hash);
    bcrypt.compare(text, hash, function(err, res) {
console.log(res);
      callback(res);
    });
};
