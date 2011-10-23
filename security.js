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
    next();
  }
};

exports.validateElevatedUser = function(req, res, next) {
  exports.getCurrentUser(req, res, function(user) {
    if(!user || !user.isElevated) {
        res.json({ success: false}, {}, 401); 
        return;
    }
    next();
    
  });
};

exports.usersDisplayName = function(email, callback) {
  db.get_user(email, function(err, doc) {
      if(doc.rows && doc.rows.length > 1) {
          callback(doc.rows[0]['value'].name);
      } else callback(null);
  });
}

exports.getCurrentUser = function(req, res, callback) {
  var cookies = new Cookies( req, res , keys);
  var username = cookies.get( "ymindsid" );

  if(!username) { callback(null); return; }

  db.get_user(username, function(err, doc) {
      if(doc.rows.length === 1)
        callback(doc.rows[0].value);
      else callback(null);
  });
};

exports.setCookieForUser = function(req, res, email) {
    var cookies = new Cookies( req, res , keys);
    cookies.set("ymindsid", email, { signed: true } );
};

exports.signInUser = function(req, res, email, password, callback) {
  
   db.get_user(email, function(err,doc){
     if(err === null && doc.rows.length > 0){
       encryption.compare(password, doc.rows[0].value.password, function(result) {
          if(result) {
            exports.setCookieForUser(req, res, email);
            callback(true,undefined);
          }
        else{ callback(false,"Bad Password"); }
       }); 
     }
     else { callback(false,"User Not Found"); }
   });
};

exports.signOutUser = function(req, res) {
  var cookies = new Cookies( req, res , keys);
   cookies.set( "ymindsid", null, { httpOnly: false } );
};
