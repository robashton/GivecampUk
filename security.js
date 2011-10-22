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

exports.currentUser = function(req, res) {
  var cookies = new Cookies( req, res );
  try {
  var username = cookies.get( "username" );
  return username;
  } catch (ex) {
    return null;  
  }
};

exports.signInUser = function(req, res, email, password, callback) {
  
   db.get_user(email, function(err,doc){
     if(doc.error == undefined && doc.rows.length > 0){
       encryption.compare(password, doc.rows[0].value.password, function(result) {
       db.create_session(doc.rows[0].value._id,doc.rows[0].value.name,function(guid){
          if(err == undefined){
            callback(result,guid);
          } else {
            callback(false,undefined);
          }
       });
       }); 
     }
   });
};

exports.signOutUser = function(req, res) {
   var cookies = new Cookies( req, res );
   cookies.set( "username", null, { httpOnly: false } );
};
