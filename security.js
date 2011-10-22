Cookies = require('cookies');
db = require('./db');
encryption = require('./encryption');

exports.validateUser = function(req, res, next) {
  var cookies = new Cookies( req, res );
  var username = cookies.get( "username" );

  if(!username) {
   res.json({ success: false}, {}, 401); 
  }
  else next();
};

exports.signInUser = function(req, res, email, password, callback) {
  
   db.get_user(email, function(doc){
     if(doc.rows > 0){
       encryption.compare(password, doc.rows[0].value.password, function(result) {
          callback(result)
       }); 
     }
  });
};

exports.signOutUser = function(req, res) {
   var cookies = new Cookies( req, res );
   cookies.set( "username", null, { httpOnly: false } );
};
