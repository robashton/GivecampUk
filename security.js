Cookies = require('cookies');
db = require('./db');
encryption = require('./encryption');
var KeyGrip = require('keygrip');

var keys = new KeyGrip([ "This should not be in here", "and this" ])


exports.validateUser = function(req, res, next) {
var cookies = new Cookies( req, res , keys);
  var session_cookie = cookies.get( "ymindsid" );

  if(!session_cookie) {
   res.json({ success: false}, {}, 401); 
  }
  else{
    //TODO: session db validation
    console.log(session_cookie);
    next();
  }
};

exports.currentUser = function(req, res) {
var cookies = new Cookies( req, res , keys);
  try {
  var username = cookies.get("ymindsid");
  return username;
  } catch (ex) {
    return null;  
  }
};

exports.signInUser = function(req, res, email, password, callback) {
  
   db.get_user(email, function(err,doc){
     if(err == undefined && doc.rows.length > 0){
       encryption.compare(password, doc.rows[0].value.password, function(result) {
        
console.log(email);
      var cookies = new Cookies( req, res , keys);
       cookies.set("ymindsid", email, { signed: true } );
       callback(true);
       }); 
     }
     else { callback(false); }
   });
};

exports.signOutUser = function(req, res) {
  var cookies = new Cookies( req, res , keys);
   cookies.set( "ymindsid", null, { httpOnly: false } );
};
